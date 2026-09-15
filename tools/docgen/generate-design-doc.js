// AIRead 설계 문서(.docx) 최종 조립 스크립트.
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, PageOrientation, convertInchesToTwip, TableOfContents, HeadingLevel } = require("docx");
const { pageNumberFooter, titlePage } = require("./lib/docxHelpers");
const { buildOverviewSection, buildArchitectureSection, buildProcessSection, OUT_PATH } = require("./design-doc-sections-1");
const { buildRubricSection, buildRecommendationSection, buildCurriculumSection } = require("./design-doc-sections-2");
const { buildLlmSection, buildAppendixSection } = require("./design-doc-sections-3");

async function main() {
  const titleChildren = titlePage({
    title: "AIRead 설계 문서",
    subtitle: "학생 문해력 평가 서비스 - 시스템 설계 및 상세 레퍼런스",
    meta: ["버전 1.0", `작성일: ${new Date().toISOString().slice(0, 10)}`, "대상 저장소: AIRead_model (WEB-WAS-DB)"]
  });

  const toc = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
      children: [new TextRun({ text: "목차", bold: true, size: 32 })]
    }),
    new TableOfContents("목차", { hyperlink: true, headingStyleRange: "1-3" }),
    new Paragraph({ pageBreakBefore: true, children: [] })
  ];

  const overview = buildOverviewSection();
  const architecture = await buildArchitectureSection();
  const process = await buildProcessSection();
  const rubric = await buildRubricSection();
  const recommendation = await buildRecommendationSection();
  const curriculum = await buildCurriculumSection();
  const llm = await buildLlmSection();
  const appendix = buildAppendixSection();

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "맑은 고딕", size: 21 }
        }
      }
    },
    features: { updateFields: true },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
            margin: {
              top: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8)
            }
          }
        },
        footers: { default: pageNumberFooter() },
        children: [
          ...titleChildren,
          ...toc,
          ...overview,
          ...architecture,
          ...process,
          ...rubric,
          ...recommendation,
          ...curriculum,
          ...llm,
          ...appendix
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, buffer);
  console.log(`OK: wrote ${OUT_PATH} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
