// AIRead ERD 및 DB 설계서(.docx) 최종 조립 스크립트 (가로 방향 - ERD가 넓어서 landscape 사용).
const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, TextRun, PageOrientation, convertInchesToTwip, TableOfContents, HeadingLevel } = require("docx");
const { pageNumberFooter, titlePage } = require("./lib/docxHelpers");
const { buildOverview, buildCurrentSchema, OUT_PATH } = require("./erd-doc-sections-1");
const { buildProductionProposal, buildErdAppendix } = require("./erd-doc-sections-2");

async function main() {
  const titleChildren = titlePage({
    title: "AIRead ERD 및 DB 설계서",
    subtitle: "현재 SQLite 스키마 · 상용 DB(PostgreSQL) 전환 제안",
    meta: ["버전 1.0", `작성일: ${new Date().toISOString().slice(0, 10)}`, "대상 저장소: AIRead_model (DB/database.js)"]
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

  const overview = buildOverview();
  const currentSchema = await buildCurrentSchema();
  const proposal = await buildProductionProposal();
  const appendix = buildErdAppendix();

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
            size: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE },
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.6),
              left: convertInchesToTwip(0.6),
              right: convertInchesToTwip(0.6)
            }
          }
        },
        footers: { default: pageNumberFooter() },
        children: [...titleChildren, ...toc, ...overview, ...currentSchema, ...proposal, ...appendix]
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
