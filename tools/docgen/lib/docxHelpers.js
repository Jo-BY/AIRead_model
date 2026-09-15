// docx 문서 조립용 공용 헬퍼 (설계문서/ERD문서에서 공유).
const fs = require("fs");
const sharp = require("sharp");
const {
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ShadingType,
  ImageRun,
  VerticalAlign,
  Header,
  Footer,
  PageNumber,
  convertInchesToTwip
} = require("docx");

const BRAND = "2F5597";
const BRAND_DARK = "1F3864";
const LIGHT_FILL = "EAF1FB";

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BRAND } },
    children: [new TextRun({ text, bold: true, color: BRAND_DARK, size: 32 })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, color: BRAND, size: 26 })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 120 },
    children: [new TextRun({ text, bold: true, color: "333333", size: 22 })]
  });
}

function p(text, opts = {}) {
  const { bold = false, italic = false, size = 21, color = "222222", spacingAfter = 160, alignment } = opts;
  return new Paragraph({
    spacing: { after: spacingAfter, line: 300 },
    alignment,
    children: [new TextRun({ text, bold, italics: italic, size, color })]
  });
}

function bullet(text, opts = {}) {
  const { size = 21, color = "222222" } = opts;
  return new Paragraph({
    bullet: { level: opts.level || 0 },
    spacing: { after: 80, line: 280 },
    children: [new TextRun({ text, size, color })]
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 200 },
    shading: { type: ShadingType.CLEAR, fill: "FFF7E0" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "C9A227" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9A227" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "C9A227" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "C9A227" }
    },
    children: [new TextRun({ text: `⚠ ${text}`, size: 20, color: "6B5A05" })]
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 260 },
    children: [new TextRun({ text, italics: true, size: 19, color: "666666" })]
  });
}

async function imageParagraph(pngPath, { targetWidth = 620, caption: capText } = {}) {
  const buf = fs.readFileSync(pngPath);
  const meta = await sharp(buf).metadata();
  const ratio = meta.height / meta.width;
  const width = Math.min(targetWidth, meta.width);
  const height = Math.round(width * ratio);

  const paragraphs = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 120, after: capText ? 40 : 200 },
      children: [
        new ImageRun({
          type: "png",
          data: buf,
          transformation: { width, height }
        })
      ]
    })
  ];
  if (capText) {
    paragraphs.push(caption(capText));
  }
  return paragraphs;
}

function cellText(text, opts = {}) {
  const { bold = false, color = "222222", size = 19, alignment = AlignmentType.LEFT } = opts;
  return new Paragraph({
    alignment,
    children: [new TextRun({ text: String(text ?? ""), bold, color, size })]
  });
}

function headerCell(text, widthPct) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: BRAND },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [cellText(text, { bold: true, color: "FFFFFF", size: 19, alignment: AlignmentType.CENTER })]
  });
}

function bodyCell(text, widthPct, opts = {}) {
  return new TableCell({
    width: { size: widthPct, type: WidthType.PERCENTAGE },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 50, bottom: 50, left: 80, right: 80 },
    children: [cellText(text, { alignment: opts.alignment || AlignmentType.LEFT, color: opts.color, bold: opts.bold })]
  });
}

// columns: [{ header, width(퍼센트) }] / rows: string[][] (columns 순서와 동일)
function dataTable(columns, rows, { zebra = true } = {}) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: columns.map((c) => headerCell(c.header, c.width))
  });

  const bodyRows = rows.map(
    (row, rowIdx) =>
      new TableRow({
        children: row.map((cellVal, colIdx) =>
          bodyCell(cellVal, columns[colIdx].width, {
            fill: zebra && rowIdx % 2 === 1 ? "F5F6FA" : undefined,
            alignment: columns[colIdx].alignment
          })
        )
      })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "C7CCD6" }
    },
    rows: [headerRow, ...bodyRows]
  });
}

function tableSpacer() {
  return new Paragraph({ spacing: { after: 240 }, children: [] });
}

function codeBlock(lines) {
  const arr = Array.isArray(lines) ? lines : String(lines).split("\n");
  return new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: "F5F6FA" },
    border: {
      top: { style: BorderStyle.SINGLE, size: 2, color: "D5D9E0" },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "D5D9E0" },
      left: { style: BorderStyle.SINGLE, size: 2, color: "D5D9E0" },
      right: { style: BorderStyle.SINGLE, size: 2, color: "D5D9E0" }
    },
    spacing: { after: 200 },
    children: arr.flatMap((line, i) => [
      ...(i > 0 ? [new TextRun({ break: 1 })] : []),
      new TextRun({ text: line || " ", font: "Consolas", size: 17, color: "2B2B2B" })
    ])
  });
}

function pageNumberFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "888888" }),
          new TextRun({ text: " / ", size: 18, color: "888888" }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "888888" })
        ]
      })
    ]
  });
}

function titlePage({ title, subtitle, meta }) {
  const children = [
    new Paragraph({ spacing: { before: 2400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: title, bold: true, size: 56, color: BRAND_DARK })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240 },
      children: [new TextRun({ text: subtitle, size: 28, color: "555555" })]
    })
  ];
  if (meta) {
    children.push(
      new Paragraph({ spacing: { before: 800 }, children: [] }),
      ...meta.map(
        (line) =>
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [new TextRun({ text: line, size: 20, color: "777777" })]
          })
      )
    );
  }
  return children;
}

module.exports = {
  BRAND,
  BRAND_DARK,
  LIGHT_FILL,
  h1,
  h2,
  h3,
  p,
  bullet,
  note,
  caption,
  imageParagraph,
  dataTable,
  tableSpacer,
  codeBlock,
  pageNumberFooter,
  titlePage,
  cellText
};
