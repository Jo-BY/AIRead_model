const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const defaultDataDir = path.join(__dirname, "data");
const envDbPath = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : "";
const envDbDir = process.env.DB_DIR ? path.resolve(process.env.DB_DIR) : "";

const dataDir = envDbPath ? path.dirname(envDbPath) : envDbDir || defaultDataDir;
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = envDbPath || path.join(dataDir, "literacy.db");
const db = new Database(dbPath);

function initDatabase() {
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS student_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      school TEXT NOT NULL,
      grade INTEGER NOT NULL,
      class_name TEXT NOT NULL,
      student_number INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS book_reflections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      book_title TEXT NOT NULL,
      book_author TEXT,
      reflection_text TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES student_accounts(id)
    );

    CREATE TABLE IF NOT EXISTS literacy_evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reflection_id INTEGER NOT NULL,
      total_score INTEGER NOT NULL,
      comprehension INTEGER NOT NULL,
      inference INTEGER NOT NULL,
      critical_thinking INTEGER NOT NULL,
      expression INTEGER NOT NULL,
      vocab_grammar INTEGER NOT NULL,
      feedback_json TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(reflection_id) REFERENCES book_reflections(id)
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_title TEXT NOT NULL,
      book_author TEXT,
      summary_text TEXT NOT NULL,
      objective TEXT NOT NULL,
      due_date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      assignment_id INTEGER NOT NULL,
      answer_text TEXT NOT NULL,
      total_score INTEGER NOT NULL,
      comprehension INTEGER NOT NULL,
      inference INTEGER NOT NULL,
      critical_thinking INTEGER NOT NULL,
      expression INTEGER NOT NULL,
      vocab_grammar INTEGER NOT NULL,
      feedback_json TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES student_accounts(id),
      FOREIGN KEY(assignment_id) REFERENCES assignments(id)
    );

    CREATE TABLE IF NOT EXISTS literacy_rubric (
      id TEXT PRIMARY KEY,
      indicator_key TEXT NOT NULL,
      indicator_name TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      level INTEGER NOT NULL,
      descriptor TEXT NOT NULL,
      source TEXT
    );

    CREATE TABLE IF NOT EXISTS curriculum_standards (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      domain TEXT NOT NULL,
      description TEXT NOT NULL,
      indicator_keys_json TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 0,
      source TEXT
    );

    CREATE TABLE IF NOT EXISTS recommended_textbooks (
      id TEXT PRIMARY KEY,
      indicator_key TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      type TEXT,
      subject TEXT,
      unit TEXT NOT NULL,
      linked_standard_codes_json TEXT,
      verified INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS recommended_books (
      id TEXT PRIMARY KEY,
      indicator_key TEXT NOT NULL,
      grade_band TEXT NOT NULL,
      title TEXT NOT NULL,
      author TEXT,
      reason TEXT,
      source TEXT
    );

    CREATE TABLE IF NOT EXISTS discussion_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      book_title TEXT NOT NULL,
      book_author TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES student_accounts(id)
    );

    CREATE TABLE IF NOT EXISTS discussion_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES discussion_sessions(id)
    );

    CREATE TABLE IF NOT EXISTS ai_diagnoses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      attempt_count INTEGER NOT NULL DEFAULT 0,
      school TEXT,
      grade INTEGER,
      class_name TEXT,
      headline TEXT,
      overview TEXT,
      timeline_insights_json TEXT,
      indicator_insights_json TEXT,
      action_plan_json TEXT,
      textbook_recommendations_json TEXT,
      book_recommendations_json TEXT,
      weakest_indicator TEXT,
      strongest_indicator TEXT,
      confidence TEXT,
      needs_review INTEGER NOT NULL DEFAULT 0,
      model_version TEXT,
      prompt_version TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES student_accounts(id)
    );
  `);

  const columns = db.prepare("PRAGMA table_info(student_accounts)").all();
  const hasGradeColumn = columns.some((col) => col.name === "grade");
  if (!hasGradeColumn) {
    db.exec("ALTER TABLE student_accounts ADD COLUMN grade INTEGER NOT NULL DEFAULT 1");
  }

  function ensureColumn(table, column, definition) {
    const tableColumns = db.prepare(`PRAGMA table_info(${table})`).all();
    const exists = tableColumns.some((col) => col.name === column);
    if (!exists) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  }

  // LLM 평가 결과(근거 인용, 모델/프롬프트 버전, 신뢰도)를 저장하기 위한 컬럼 확장.
  for (const table of ["literacy_evaluations", "assignment_submissions"]) {
    ensureColumn(table, "evidence_json", "TEXT");
    ensureColumn(table, "model_version", "TEXT");
    ensureColumn(table, "prompt_version", "TEXT");
    ensureColumn(table, "confidence", "TEXT");
    ensureColumn(table, "needs_review", "INTEGER NOT NULL DEFAULT 0");
  }

  // 대시보드에서 "본인/교사" 제출 구분을 표시하기 위한 과제 연결 컬럼.
  ensureColumn("book_reflections", "assignment_id", "INTEGER REFERENCES assignments(id)");

  // 컬럼 추가 이전에 저장된 과제 제출 건은 (student_id, 점수, 제출 시각, 책 제목)이
  // 정확히 일치하는 assignment_submissions 건으로만 역추적해 채워 넣는다.
  db.exec(`
    UPDATE book_reflections
    SET assignment_id = (
      SELECT sub.assignment_id
      FROM assignment_submissions sub
      JOIN literacy_evaluations e ON e.reflection_id = book_reflections.id
      JOIN assignments a ON a.id = sub.assignment_id
      WHERE sub.student_id = book_reflections.student_id
        AND sub.total_score = e.total_score
        AND sub.created_at = book_reflections.created_at
        AND a.book_title = book_reflections.book_title
      LIMIT 1
    )
    WHERE assignment_id IS NULL
      AND EXISTS (
        SELECT 1
        FROM assignment_submissions sub
        JOIN literacy_evaluations e ON e.reflection_id = book_reflections.id
        JOIN assignments a ON a.id = sub.assignment_id
        WHERE sub.student_id = book_reflections.student_id
          AND sub.total_score = e.total_score
          AND sub.created_at = book_reflections.created_at
          AND a.book_title = book_reflections.book_title
      )
  `);

  // Merge legacy duplicates so one student key maps to one account consistently.
  const duplicates = db
    .prepare(
      `
      SELECT school, grade, class_name, student_number, GROUP_CONCAT(id) AS ids
      FROM student_accounts
      GROUP BY school, grade, class_name, student_number
      HAVING COUNT(*) > 1
    `
    )
    .all();

  const moveReflections = db.prepare("UPDATE book_reflections SET student_id = ? WHERE student_id = ?");
  const deleteStudent = db.prepare("DELETE FROM student_accounts WHERE id = ?");

  const dedupeTx = db.transaction(() => {
    for (const group of duplicates) {
      const ids = String(group.ids)
        .split(",")
        .map((v) => Number(v))
        .filter((v) => Number.isInteger(v));

      if (ids.length < 2) {
        continue;
      }

      const keepId = Math.min(...ids);
      const removeIds = ids.filter((id) => id !== keepId);
      for (const removeId of removeIds) {
        moveReflections.run(keepId, removeId);
        deleteStudent.run(removeId);
      }
    }
  });
  dedupeTx();

  db.exec(`
    DROP INDEX IF EXISTS idx_student_accounts_unique;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_student_accounts_unique
    ON student_accounts(school, grade, class_name, student_number);
  `);
}

function findStudentByIdentity(identity) {
  return db
    .prepare(
      `
      SELECT id, name, school, grade, class_name, student_number
      FROM student_accounts
      WHERE school = ? AND grade = ? AND class_name = ? AND student_number = ?
    `
    )
    .get(identity.school, identity.grade, identity.className, identity.studentNumber);
}

function createOrGetStudentAccount(identity) {
  const existing = findStudentByIdentity(identity);
  if (existing) {
    return existing;
  }

  const result = db
    .prepare(
      `
      INSERT INTO student_accounts (name, school, grade, class_name, student_number)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(identity.name, identity.school, identity.grade, identity.className, identity.studentNumber);

  return {
    id: result.lastInsertRowid,
    name: identity.name,
    school: identity.school,
    grade: identity.grade,
    class_name: identity.className,
    student_number: identity.studentNumber
  };
}

function getStudentById(studentId) {
  return db
    .prepare(
      `
      SELECT id, name, school, grade, class_name, student_number
      FROM student_accounts
      WHERE id = ?
    `
    )
    .get(studentId);
}

function createSubmission(studentId, reflection, evaluation) {
  const tx = db.transaction(() => {
    const reflectionStmt = db.prepare(`
      INSERT INTO book_reflections (student_id, book_title, book_author, reflection_text)
      VALUES (?, ?, ?, ?)
    `);

    const reflectionResult = reflectionStmt.run(
      studentId,
      reflection.bookTitle,
      reflection.bookAuthor || null,
      reflection.reflectionText
    );

    const evaluationStmt = db.prepare(`
      INSERT INTO literacy_evaluations (
        reflection_id,
        total_score,
        comprehension,
        inference,
        critical_thinking,
        expression,
        vocab_grammar,
        feedback_json,
        evidence_json,
        model_version,
        prompt_version,
        confidence,
        needs_review
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    evaluationStmt.run(
      reflectionResult.lastInsertRowid,
      evaluation.totalScore,
      evaluation.scores.comprehension,
      evaluation.scores.inference,
      evaluation.scores.criticalThinking,
      evaluation.scores.expression,
      evaluation.scores.vocabGrammar,
      JSON.stringify(evaluation.feedback),
      evaluation.evidence ? JSON.stringify(evaluation.evidence) : null,
      evaluation.modelVersion || null,
      evaluation.promptVersion || null,
      evaluation.confidence || null,
      evaluation.needsReview ? 1 : 0
    );

    return {
      studentId,
      reflectionId: reflectionResult.lastInsertRowid
    };
  });

  return tx();
}

function createAssignment(assignment) {
  const result = db
    .prepare(
      `
      INSERT INTO assignments (book_title, book_author, summary_text, objective, due_date)
      VALUES (?, ?, ?, ?, ?)
    `
    )
    .run(
      String(assignment.bookTitle || "").trim(),
      assignment.bookAuthor ? String(assignment.bookAuthor).trim() : null,
      String(assignment.summary || "").trim(),
      String(assignment.objective || "").trim(),
      String(assignment.deadline || "").trim()
    );

  return {
    id: Number(result.lastInsertRowid),
    bookTitle: String(assignment.bookTitle || "").trim(),
    bookAuthor: assignment.bookAuthor ? String(assignment.bookAuthor).trim() : null,
    summary: String(assignment.summary || "").trim(),
    objective: String(assignment.objective || "").trim(),
    deadline: String(assignment.deadline || "").trim(),
    createdAt: new Date().toISOString()
  };
}

function getAssignments() {
  return db
    .prepare(
      `
      SELECT id, book_title AS bookTitle, book_author AS bookAuthor, summary_text AS summary,
             objective, due_date AS deadline, created_at AS createdAt
      FROM assignments
      ORDER BY id DESC
    `
    )
    .all();
}

function getAssignmentById(assignmentId) {
  return db
    .prepare(
      `
      SELECT id, book_title AS bookTitle, book_author AS bookAuthor, summary_text AS summary,
             objective, due_date AS deadline, created_at AS createdAt
      FROM assignments
      WHERE id = ?
      LIMIT 1
    `
    )
    .get(assignmentId);
}

function createAssignmentSubmission(studentId, assignmentId, answerText, evaluation) {
  const assignment = getAssignmentById(assignmentId);
  if (!assignment) {
    throw new Error("해당 과제를 찾을 수 없습니다.");
  }

  const tx = db.transaction(() => {
    const reflectionStmt = db.prepare(`
      INSERT INTO book_reflections (student_id, book_title, book_author, reflection_text, assignment_id)
      VALUES (?, ?, ?, ?, ?)
    `);

    const reflectionResult = reflectionStmt.run(
      studentId,
      assignment.bookTitle,
      assignment.bookAuthor || null,
      String(answerText || "").trim(),
      assignmentId
    );

    const evaluationStmt = db.prepare(`
      INSERT INTO literacy_evaluations (
        reflection_id,
        total_score,
        comprehension,
        inference,
        critical_thinking,
        expression,
        vocab_grammar,
        feedback_json,
        evidence_json,
        model_version,
        prompt_version,
        confidence,
        needs_review
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    evaluationStmt.run(
      reflectionResult.lastInsertRowid,
      evaluation.totalScore,
      evaluation.scores.comprehension,
      evaluation.scores.inference,
      evaluation.scores.criticalThinking,
      evaluation.scores.expression,
      evaluation.scores.vocabGrammar,
      JSON.stringify(evaluation.feedback),
      evaluation.evidence ? JSON.stringify(evaluation.evidence) : null,
      evaluation.modelVersion || null,
      evaluation.promptVersion || null,
      evaluation.confidence || null,
      evaluation.needsReview ? 1 : 0
    );

    const submissionStmt = db.prepare(`
      INSERT INTO assignment_submissions (
        student_id,
        assignment_id,
        answer_text,
        total_score,
        comprehension,
        inference,
        critical_thinking,
        expression,
        vocab_grammar,
        feedback_json,
        evidence_json,
        model_version,
        prompt_version,
        confidence,
        needs_review
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const submissionResult = submissionStmt.run(
      studentId,
      assignmentId,
      String(answerText || "").trim(),
      evaluation.totalScore,
      evaluation.scores.comprehension,
      evaluation.scores.inference,
      evaluation.scores.criticalThinking,
      evaluation.scores.expression,
      evaluation.scores.vocabGrammar,
      JSON.stringify(evaluation.feedback),
      evaluation.evidence ? JSON.stringify(evaluation.evidence) : null,
      evaluation.modelVersion || null,
      evaluation.promptVersion || null,
      evaluation.confidence || null,
      evaluation.needsReview ? 1 : 0
    );

    return {
      id: Number(submissionResult.lastInsertRowid),
      studentId,
      assignmentId,
      reflectionId: Number(reflectionResult.lastInsertRowid),
      bookTitle: assignment.bookTitle,
      bookAuthor: assignment.bookAuthor,
      answerText: String(answerText || "").trim(),
      evaluation
    };
  });

  return tx();
}

function getDashboard(limit = 100, studentId = null) {
  const whereClause = studentId ? "WHERE r.student_id = ?" : "";
  const rowParams = studentId ? [studentId, limit] : [limit];

  const rows = db
    .prepare(
      `
      SELECT
        s.id AS student_id,
        s.name,
        s.school,
        s.grade,
        s.class_name,
        s.student_number,
        r.id AS reflection_id,
        r.book_title,
        r.book_author,
        r.reflection_text,
        r.created_at AS submitted_at,
        r.assignment_id,
        CASE WHEN r.assignment_id IS NOT NULL THEN 'teacher' ELSE 'self' END AS source_type,
        e.total_score,
        e.comprehension,
        e.inference,
        e.critical_thinking,
        e.expression,
        e.vocab_grammar,
        e.feedback_json,
        e.evidence_json,
        e.model_version,
        e.prompt_version,
        e.confidence,
        e.needs_review
      FROM book_reflections r
      JOIN student_accounts s ON r.student_id = s.id
      JOIN literacy_evaluations e ON e.reflection_id = r.id
      ${whereClause}
      ORDER BY r.id DESC
      LIMIT ?
    `
    )
    .all(...rowParams);

  const stats = studentId
    ? db
        .prepare(
          `
          SELECT
            (SELECT COUNT(*) FROM book_reflections WHERE student_id = ?) AS reflection_count,
            (
              SELECT ROUND(AVG(e.total_score), 1)
              FROM literacy_evaluations e
              JOIN book_reflections r ON e.reflection_id = r.id
              WHERE r.student_id = ?
            ) AS avg_score
        `
        )
        .get(studentId, studentId)
    : db
        .prepare(
          `
          SELECT
            (SELECT COUNT(*) FROM student_accounts) AS student_count,
            (SELECT COUNT(*) FROM book_reflections) AS reflection_count,
            (SELECT ROUND(AVG(total_score), 1) FROM literacy_evaluations) AS avg_score
        `
        )
        .get();

  return {
    stats,
    rows: rows.map((row) => ({
      ...row,
      feedback: JSON.parse(row.feedback_json || "{}"),
      evidence: row.evidence_json ? JSON.parse(row.evidence_json) : null,
      needs_review: Boolean(row.needs_review)
    }))
  };
}

function getStudentReflectionDetail(studentId, reflectionId) {
  const row = db
    .prepare(
      `
      SELECT
        s.id AS student_id,
        s.name,
        s.school,
        s.grade,
        s.class_name,
        s.student_number,
        r.id AS reflection_id,
        r.book_title,
        r.book_author,
        r.reflection_text,
        r.created_at AS submitted_at,
        e.total_score,
        e.comprehension,
        e.inference,
        e.critical_thinking,
        e.expression,
        e.vocab_grammar,
        e.feedback_json,
        e.evidence_json,
        e.model_version,
        e.prompt_version,
        e.confidence,
        e.needs_review
      FROM book_reflections r
      JOIN student_accounts s ON r.student_id = s.id
      JOIN literacy_evaluations e ON e.reflection_id = r.id
      WHERE r.id = ? AND r.student_id = ?
      LIMIT 1
    `
    )
    .get(reflectionId, studentId);

  if (!row) {
    return null;
  }

  const peerAvg = db
    .prepare(
      `
      SELECT
        COUNT(*) AS peer_count,
        ROUND(AVG(e.comprehension), 2) AS comprehension,
        ROUND(AVG(e.inference), 2) AS inference,
        ROUND(AVG(e.critical_thinking), 2) AS critical_thinking,
        ROUND(AVG(e.expression), 2) AS expression,
        ROUND(AVG(e.vocab_grammar), 2) AS vocab_grammar
      FROM book_reflections r
      JOIN literacy_evaluations e ON e.reflection_id = r.id
      WHERE r.book_title = ?
        AND r.student_id != ?
    `
    )
    .get(row.book_title, studentId);

  return {
    ...row,
    feedback: JSON.parse(row.feedback_json || "{}"),
    evidence: row.evidence_json ? JSON.parse(row.evidence_json) : null,
    needs_review: Boolean(row.needs_review),
    peer_average: {
      peer_count: Number(peerAvg?.peer_count || 0),
      comprehension: Number(peerAvg?.comprehension || 0),
      inference: Number(peerAvg?.inference || 0),
      critical_thinking: Number(peerAvg?.critical_thinking || 0),
      expression: Number(peerAvg?.expression || 0),
      vocab_grammar: Number(peerAvg?.vocab_grammar || 0)
    }
  };
}

function createDiscussionSession(studentId, bookTitle, bookAuthor) {
  const result = db
    .prepare(
      `
      INSERT INTO discussion_sessions (student_id, book_title, book_author)
      VALUES (?, ?, ?)
    `
    )
    .run(studentId, String(bookTitle).trim(), bookAuthor ? String(bookAuthor).trim() : null);

  return getDiscussionSessionById(Number(result.lastInsertRowid), studentId);
}

function getDiscussionSessionById(sessionId, studentId) {
  return db
    .prepare(
      `
      SELECT id, student_id AS studentId, book_title AS bookTitle, book_author AS bookAuthor,
             created_at AS createdAt, updated_at AS updatedAt
      FROM discussion_sessions
      WHERE id = ? AND student_id = ?
    `
    )
    .get(sessionId, studentId);
}

function getDiscussionSessionsByStudent(studentId) {
  return db
    .prepare(
      `
      SELECT
        ds.id, ds.book_title AS bookTitle, ds.book_author AS bookAuthor,
        ds.created_at AS createdAt, ds.updated_at AS updatedAt,
        (SELECT COUNT(*) FROM discussion_messages dm WHERE dm.session_id = ds.id) AS messageCount,
        (
          SELECT dm.content FROM discussion_messages dm
          WHERE dm.session_id = ds.id
          ORDER BY dm.id DESC LIMIT 1
        ) AS lastMessage
      FROM discussion_sessions ds
      WHERE ds.student_id = ?
      ORDER BY ds.updated_at DESC
    `
    )
    .all(studentId);
}

function getDiscussionMessages(sessionId) {
  return db
    .prepare(
      `
      SELECT id, session_id AS sessionId, role, content, created_at AS createdAt
      FROM discussion_messages
      WHERE session_id = ?
      ORDER BY id ASC
    `
    )
    .all(sessionId);
}

function addDiscussionMessage(sessionId, role, content) {
  const tx = db.transaction(() => {
    const result = db
      .prepare(
        `
        INSERT INTO discussion_messages (session_id, role, content)
        VALUES (?, ?, ?)
      `
      )
      .run(sessionId, role, content);

    db.prepare("UPDATE discussion_sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(sessionId);

    return db
      .prepare(
        `
        SELECT id, session_id AS sessionId, role, content, created_at AS createdAt
        FROM discussion_messages
        WHERE id = ?
      `
      )
      .get(result.lastInsertRowid);
  });

  return tx();
}

function replaceReferenceTable(table, rows, mapToColumns) {
  const insertTx = db.transaction((items) => {
    db.prepare(`DELETE FROM ${table}`).run();
    for (const item of items) {
      const record = mapToColumns(item);
      const keys = Object.keys(record);
      const placeholders = keys.map(() => "?").join(", ");
      db.prepare(`INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`).run(
        ...keys.map((key) => record[key])
      );
    }
  });
  insertTx(rows);
  return rows.length;
}

function seedRubric(items) {
  return replaceReferenceTable("literacy_rubric", items, (item) => ({
    id: item.id,
    indicator_key: item.indicatorKey,
    indicator_name: item.indicatorName,
    grade_band: item.gradeBand,
    level: item.level,
    descriptor: item.descriptor,
    source: item.source || null
  }));
}

function seedCurriculumStandards(items) {
  return replaceReferenceTable("curriculum_standards", items, (item) => ({
    id: item.id,
    code: item.code,
    grade_band: item.gradeBand,
    domain: item.domain,
    description: item.description,
    indicator_keys_json: JSON.stringify(item.indicatorKeys || []),
    verified: item.verified ? 1 : 0,
    source: item.source || null
  }));
}

function seedRecommendedTextbooks(items) {
  return replaceReferenceTable("recommended_textbooks", items, (item) => ({
    id: item.id,
    indicator_key: item.indicatorKey,
    grade_band: item.gradeBand,
    type: item.type || null,
    subject: item.subject || null,
    unit: item.unit,
    linked_standard_codes_json: JSON.stringify(item.linkedStandardCodes || []),
    verified: item.verified ? 1 : 0
  }));
}

function seedRecommendedBooks(items) {
  return replaceReferenceTable("recommended_books", items, (item) => ({
    id: item.id,
    indicator_key: item.indicatorKey,
    grade_band: item.gradeBand,
    title: item.title,
    author: item.author || null,
    reason: item.reason || null,
    source: item.source || null
  }));
}

function getRubricByGradeBand(gradeBand) {
  return db
    .prepare(
      `
      SELECT id, indicator_key AS indicatorKey, indicator_name AS indicatorName,
             grade_band AS gradeBand, level, descriptor, source
      FROM literacy_rubric
      WHERE grade_band = ?
      ORDER BY indicator_key, level
    `
    )
    .all(gradeBand);
}

function getCurriculumStandardsByGradeBand(gradeBand) {
  return db
    .prepare(
      `
      SELECT id, code, grade_band AS gradeBand, domain, description,
             indicator_keys_json AS indicatorKeysJson, verified, source
      FROM curriculum_standards
      WHERE grade_band = ?
    `
    )
    .all(gradeBand)
    .map((row) => ({
      ...row,
      indicatorKeys: JSON.parse(row.indicatorKeysJson || "[]"),
      verified: Boolean(row.verified)
    }));
}

function getRecommendedTextbooks(gradeBand, indicatorKey) {
  return db
    .prepare(
      `
      SELECT id, indicator_key AS indicatorKey, grade_band AS gradeBand, type, subject, unit,
             linked_standard_codes_json AS linkedStandardCodesJson, verified
      FROM recommended_textbooks
      WHERE grade_band = ? AND indicator_key = ?
    `
    )
    .all(gradeBand, indicatorKey)
    .map((row) => ({
      ...row,
      linkedStandardCodes: JSON.parse(row.linkedStandardCodesJson || "[]"),
      verified: Boolean(row.verified)
    }));
}

function getRecommendedBooks(gradeBand, indicatorKey) {
  return db
    .prepare(
      `
      SELECT id, indicator_key AS indicatorKey, grade_band AS gradeBand, title, author, reason, source
      FROM recommended_books
      WHERE grade_band = ? AND indicator_key = ?
    `
    )
    .all(gradeBand, indicatorKey);
}

function mapAiDiagnosisRow(row) {
  return {
    diagnosis: {
      headline: row.headline,
      overview: row.overview,
      timelineInsights: JSON.parse(row.timeline_insights_json || "[]"),
      indicatorInsights: JSON.parse(row.indicator_insights_json || "[]"),
      actionPlan: JSON.parse(row.action_plan_json || "[]")
    },
    recommendations: {
      textbooks: JSON.parse(row.textbook_recommendations_json || "[]"),
      books: JSON.parse(row.book_recommendations_json || "[]")
    },
    meta: {
      id: row.id,
      attemptCount: row.attempt_count,
      school: row.school,
      grade: row.grade,
      className: row.class_name,
      weakestIndicator: row.weakest_indicator,
      strongestIndicator: row.strongest_indicator,
      confidence: row.confidence,
      needsReview: Boolean(row.needs_review),
      modelVersion: row.model_version,
      promptVersion: row.prompt_version,
      createdAt: row.created_at
    }
  };
}

function createAiDiagnosis(studentId, result) {
  const diagnosis = result.diagnosis || {};
  const recommendations = result.recommendations || {};
  const meta = result.meta || {};

  const info = db
    .prepare(
      `
      INSERT INTO ai_diagnoses (
        student_id, attempt_count, school, grade, class_name,
        headline, overview, timeline_insights_json, indicator_insights_json, action_plan_json,
        textbook_recommendations_json, book_recommendations_json,
        weakest_indicator, strongest_indicator, confidence, needs_review, model_version, prompt_version
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    )
    .run(
      studentId,
      meta.attemptCount || 0,
      meta.school || null,
      meta.grade || null,
      meta.className || null,
      diagnosis.headline || null,
      diagnosis.overview || null,
      JSON.stringify(diagnosis.timelineInsights || []),
      JSON.stringify(diagnosis.indicatorInsights || []),
      JSON.stringify(diagnosis.actionPlan || []),
      JSON.stringify(recommendations.textbooks || []),
      JSON.stringify(recommendations.books || []),
      meta.weakestIndicator || null,
      meta.strongestIndicator || null,
      meta.confidence || null,
      meta.needsReview ? 1 : 0,
      meta.modelVersion || null,
      meta.promptVersion || null
    );

  return getAiDiagnosisById(info.lastInsertRowid);
}

function getAiDiagnosisById(id) {
  const row = db.prepare("SELECT * FROM ai_diagnoses WHERE id = ?").get(id);
  return row ? mapAiDiagnosisRow(row) : null;
}

function getLatestAiDiagnosis(studentId) {
  const row = db.prepare("SELECT * FROM ai_diagnoses WHERE student_id = ? ORDER BY id DESC LIMIT 1").get(studentId);
  return row ? mapAiDiagnosisRow(row) : null;
}

function getAiDiagnosisHistory(studentId, limit = 20) {
  const rows = db
    .prepare("SELECT * FROM ai_diagnoses WHERE student_id = ? ORDER BY id DESC LIMIT ?")
    .all(studentId, limit);
  return rows.map(mapAiDiagnosisRow);
}

module.exports = {
  initDatabase,
  findStudentByIdentity,
  createOrGetStudentAccount,
  getStudentById,
  createSubmission,
  createAssignment,
  getAssignmentById,
  getAssignments,
  createAssignmentSubmission,
  getDashboard,
  getStudentReflectionDetail,
  createDiscussionSession,
  getDiscussionSessionById,
  getDiscussionSessionsByStudent,
  getDiscussionMessages,
  addDiscussionMessage,
  seedRubric,
  seedCurriculumStandards,
  seedRecommendedTextbooks,
  seedRecommendedBooks,
  getRubricByGradeBand,
  getCurriculumStandardsByGradeBand,
  getRecommendedTextbooks,
  getRecommendedBooks,
  createAiDiagnosis,
  getLatestAiDiagnosis,
  getAiDiagnosisHistory
};
