// xlsx 문서 조립용 공용 헬퍼 (API기능정의서/주요기능명세서에서 공유).
const ExcelJS = require("exceljs");

const BRAND = "FF2F5597";
const BRAND_LIGHT = "FFEAF1FB";
const ZEBRA = "FFF5F6FA";

function newWorkbook(creator = "AIRead") {
  const wb = new ExcelJS.Workbook();
  wb.creator = creator;
  wb.created = new Date();
  return wb;
}

function addSheet(wb, name, columns, { freeze = 1, rowHeight = 20 } = {}) {
  const sheet = wb.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: freeze }],
    properties: { defaultRowHeight: rowHeight }
  });
  sheet.columns = columns;
  return sheet;
}

function styleHeaderRow(sheet, rowNumber = 1) {
  const row = sheet.getRow(rowNumber);
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = {
      top: { style: "thin", color: { argb: "FFC7CCD6" } },
      bottom: { style: "thin", color: { argb: "FFC7CCD6" } },
      left: { style: "thin", color: { argb: "FFC7CCD6" } },
      right: { style: "thin", color: { argb: "FFC7CCD6" } }
    };
  });
  row.height = 26;
}

function addDataRow(sheet, values, { zebraIndex, wrap = true } = {}) {
  const row = sheet.addRow(values);
  row.eachCell((cell) => {
    cell.alignment = { vertical: "top", horizontal: cell.alignment?.horizontal || "left", wrapText: wrap };
    cell.border = {
      top: { style: "thin", color: { argb: "FFE3E6EC" } },
      bottom: { style: "thin", color: { argb: "FFE3E6EC" } },
      left: { style: "thin", color: { argb: "FFE3E6EC" } },
      right: { style: "thin", color: { argb: "FFE3E6EC" } }
    };
    cell.font = { size: 10.5 };
  });
  if (zebraIndex !== undefined && zebraIndex % 2 === 1) {
    row.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZEBRA } };
    });
  }
  return row;
}

function centerColumn(sheet, colIndex) {
  sheet.getColumn(colIndex).alignment = { vertical: "top", horizontal: "center", wrapText: true };
}

function titleSheet(wb, { title, subtitle, meta }) {
  const sheet = wb.addWorksheet("표지");
  sheet.columns = [{ width: 6 }, { width: 90 }];
  sheet.mergeCells("A2:B2");
  const titleCell = sheet.getCell("A2");
  titleCell.value = title;
  titleCell.font = { bold: true, size: 22, color: { argb: BRAND } };
  titleCell.alignment = { horizontal: "center" };

  sheet.mergeCells("A4:B4");
  const subCell = sheet.getCell("A4");
  subCell.value = subtitle;
  subCell.font = { size: 13, color: { argb: "FF555555" } };
  subCell.alignment = { horizontal: "center" };

  let r = 7;
  (meta || []).forEach((line) => {
    sheet.mergeCells(`A${r}:B${r}`);
    const c = sheet.getCell(`A${r}`);
    c.value = line;
    c.font = { size: 11, color: { argb: "FF777777" } };
    c.alignment = { horizontal: "center" };
    r += 1;
  });
  for (let i = 1; i <= 20; i += 1) {
    sheet.getRow(i).height = i === 2 ? 40 : i === 4 ? 26 : 20;
  }
  return sheet;
}

module.exports = { newWorkbook, addSheet, styleHeaderRow, addDataRow, centerColumn, titleSheet, BRAND, BRAND_LIGHT, ZEBRA };
