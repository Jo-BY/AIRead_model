// Loads DB/data/reference/*.json into the reference tables used by the LLM literacy service.
const fs = require("fs");
const path = require("path");
const {
  initDatabase,
  seedRubric,
  seedCurriculumStandards,
  seedRecommendedTextbooks,
  seedRecommendedBooks
} = require("./database");

const referenceDir = path.join(__dirname, "data", "reference");

function loadItems(fileName) {
  const filePath = path.join(referenceDir, fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.items) ? parsed.items : [];
}

function run() {
  initDatabase();

  const rubricCount = seedRubric(loadItems("rubric.json"));
  const standardsCount = seedCurriculumStandards(loadItems("curriculum_standards.json"));
  const textbooksCount = seedRecommendedTextbooks(loadItems("recommended_textbooks.json"));
  const booksCount = seedRecommendedBooks(loadItems("recommended_books.json"));

  console.log("레퍼런스 데이터 시드 완료:");
  console.log(`  - literacy_rubric: ${rubricCount}건`);
  console.log(`  - curriculum_standards: ${standardsCount}건 (verified=false 항목은 NCIC 원문 대조 필요)`);
  console.log(`  - recommended_textbooks: ${textbooksCount}건`);
  console.log(`  - recommended_books: ${booksCount}건`);
}

if (require.main === module) {
  run();
}

module.exports = { run };
