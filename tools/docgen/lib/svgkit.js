// 재사용 가능한 SVG 다이어그램 조립 도구.
// 아키텍처/흐름도/ERD를 데이터(nodes/edges) 기반으로 그려 tools/docgen 각 다이어그램 스크립트에서 공용으로 사용한다.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const FONT = "Malgun Gothic, Segoe UI, sans-serif";

const PALETTE = {
  web: { fill: "#eaf1fb", stroke: "#2f5597", title: "#2f5597", text: "#1f2430" },
  was: { fill: "#eaf1fb", stroke: "#2f5597", title: "#2f5597", text: "#1f2430" },
  db: { fill: "#e8f6ef", stroke: "#1f7a4d", title: "#1f7a4d", text: "#1f2430" },
  llm: { fill: "#fdf1e3", stroke: "#c0620a", title: "#c0620a", text: "#1f2430" },
  infra: { fill: "#eef1f4", stroke: "#55606e", title: "#3c4552", text: "#1f2430" },
  danger: { fill: "#fdecea", stroke: "#b3261e", title: "#b3261e", text: "#1f2430" },
  neutral: { fill: "#ffffff", stroke: "#8891a0", title: "#3c4552", text: "#1f2430" },
  accent: { fill: "#f1ecfb", stroke: "#6c5ce7", title: "#5842c9", text: "#1f2430" }
};

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textBlock(x, y, lines, { fontSize = 14, lineHeight, fill = "#1f2430", weight = "400", anchor = "middle", fontFamily = FONT } = {}) {
  const lh = lineHeight || fontSize * 1.4;
  const arr = Array.isArray(lines) ? lines : [lines];
  const tspans = arr.map((line, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(line)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${tspans}</text>`;
}

function anchorPoint(n, side) {
  switch (side) {
    case "top":
      return [n.x + n.w / 2, n.y];
    case "bottom":
      return [n.x + n.w / 2, n.y + n.h];
    case "left":
      return [n.x, n.y + n.h / 2];
    case "right":
      return [n.x + n.w, n.y + n.h / 2];
    case "topLeft":
      return [n.x + n.w * 0.22, n.y];
    case "topRight":
      return [n.x + n.w * 0.78, n.y];
    case "bottomLeft":
      return [n.x + n.w * 0.22, n.y + n.h];
    case "bottomRight":
      return [n.x + n.w * 0.78, n.y + n.h];
    default:
      return [n.x + n.w / 2, n.y + n.h / 2];
  }
}

function renderSimpleBox(n) {
  const p = PALETTE[n.color || "neutral"];
  const fill = n.fill || p.fill;
  const stroke = n.stroke || p.stroke;
  const titleColor = n.titleColor || p.title;
  const textColor = n.textColor || p.text;
  const rx = n.rx ?? 12;
  const dash = n.dashed ? ` stroke-dasharray="6 4"` : "";
  let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${n.strokeWidth ?? 1.6}"${dash}/>`;

  const hasTitle = Boolean(n.title);
  const bodyLines = n.lines || [];
  const titleFontSize = n.titleFontSize || 15.5;
  const bodyFontSize = n.bodyFontSize || 12.6;

  if (hasTitle && bodyLines.length) {
    const titleH = n.titleH || 30;
    out += `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${titleH}" rx="${rx}" fill="${stroke}"/>`;
    out += `<rect x="${n.x}" y="${n.y + titleH - rx}" width="${n.w}" height="${rx}" fill="${stroke}"/>`;
    out += textBlock(n.x + n.w / 2, n.y + titleH / 2 + titleFontSize * 0.35, [n.title], {
      fontSize: titleFontSize,
      fill: "#ffffff",
      weight: "700"
    });
    const bodyCenterY = n.y + titleH + (n.h - titleH) / 2 - ((bodyLines.length - 1) * (bodyFontSize * 1.42)) / 2 + bodyFontSize * 0.35;
    out += textBlock(n.x + n.w / 2, bodyCenterY, bodyLines, { fontSize: bodyFontSize, fill: textColor, lineHeight: bodyFontSize * 1.42 });
  } else if (hasTitle) {
    out += textBlock(n.x + n.w / 2, n.y + n.h / 2 + titleFontSize * 0.35, [n.title], { fontSize: titleFontSize, fill: titleColor, weight: "700" });
  } else if (bodyLines.length) {
    const centerY = n.y + n.h / 2 - ((bodyLines.length - 1) * (bodyFontSize * 1.42)) / 2 + bodyFontSize * 0.35;
    out += textBlock(n.x + n.w / 2, centerY, bodyLines, { fontSize: bodyFontSize, fill: textColor, lineHeight: bodyFontSize * 1.42 });
  }
  return out;
}

function renderNote(n) {
  const fill = n.fill || "#fffdf3";
  const stroke = n.stroke || "#c9a227";
  let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-dasharray="5 3"/>`;
  const fontSize = n.bodyFontSize || 12;
  const lines = [n.title, ...(n.lines || [])].filter(Boolean);
  const centerY = n.y + n.h / 2 - ((lines.length - 1) * (fontSize * 1.4)) / 2 + fontSize * 0.35;
  out += textBlock(n.x + n.w / 2, centerY, lines, { fontSize, fill: "#6b5a05", lineHeight: fontSize * 1.4 });
  return out;
}

function renderDiamond(n) {
  const p = PALETTE[n.color || "neutral"];
  const stroke = n.stroke || p.stroke;
  const fill = n.fill || p.fill;
  const cx = n.x + n.w / 2;
  const cy = n.y + n.h / 2;
  const pts = `${cx},${n.y} ${n.x + n.w},${cy} ${cx},${n.y + n.h} ${n.x},${cy}`;
  let out = `<polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`;
  const fontSize = n.bodyFontSize || 12.5;
  const lines = n.lines || [n.title];
  const centerY = cy - ((lines.length - 1) * (fontSize * 1.35)) / 2 + fontSize * 0.35;
  out += textBlock(cx, centerY, lines, { fontSize, fill: n.textColor || p.text, weight: n.weight || "600", lineHeight: fontSize * 1.35 });
  return out;
}

function renderGroup(n) {
  // 배경 그룹 박스 (예: "WAS 내부", "Docker 컨테이너") - 자식 노드 뒤에 깔리는 큰 라벨 영역
  const fill = n.fill || "#f7f8fb";
  const stroke = n.stroke || "#c7ccd6";
  let out = `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-dasharray="${n.dashed === false ? "0" : "7 5"}"/>`;
  if (n.title) {
    out += textBlock(n.x + 16, n.y + 22, [n.title], { fontSize: n.titleFontSize || 13.5, fill: n.titleColor || "#5b6472", weight: "700", anchor: "start" });
  }
  return out;
}

function renderEntity(n) {
  const p = PALETTE[n.color || "db"];
  const stroke = n.stroke || p.stroke;
  const headFill = n.headFill || stroke;
  const headH = 30;
  const rowH = n.rowH || 21;
  const rows = n.rows || [];
  const w = n.w;
  const h = headH + rows.length * rowH + 6;
  let out = `<rect x="${n.x}" y="${n.y}" width="${w}" height="${h}" rx="8" fill="#ffffff" stroke="${stroke}" stroke-width="1.5"/>`;
  out += `<rect x="${n.x}" y="${n.y}" width="${w}" height="${headH}" rx="8" fill="${headFill}"/>`;
  out += `<rect x="${n.x}" y="${n.y + headH - 8}" width="${w}" height="8" fill="${headFill}"/>`;
  out += textBlock(n.x + w / 2, n.y + headH / 2 + 5, [n.title], { fontSize: 14, fill: "#ffffff", weight: "700" });

  rows.forEach((row, i) => {
    const ry = n.y + headH + i * rowH;
    if (i % 2 === 1) {
      out += `<rect x="${n.x + 1.5}" y="${ry}" width="${w - 3}" height="${rowH}" fill="#f5f6fa"/>`;
    }
    const keyColor = row.key === "PK" ? "#b3261e" : row.key === "FK" ? "#1f6fb3" : "#1f2430";
    const nameWeight = row.key ? "700" : "400";
    out += `<text x="${n.x + 10}" y="${ry + rowH / 2 + 4.5}" font-family="${FONT}" font-size="11.6" font-weight="${nameWeight}" fill="${keyColor}">${esc(row.name)}</text>`;
    out += `<text x="${n.x + w - 10}" y="${ry + rowH / 2 + 4.5}" font-family="${FONT}" font-size="10.6" fill="#6b7280" text-anchor="end">${esc(row.type)}</text>`;
  });
  out += `<line x1="${n.x}" y1="${n.y + headH}" x2="${n.x + w}" y2="${n.y + headH}" stroke="${stroke}" stroke-width="1.2"/>`;
  return { svg: out, actualHeight: h };
}

const ARROW_COLORS = {
  default: "#55606e",
  blue: "#2f5597",
  green: "#1f7a4d",
  orange: "#c0620a",
  red: "#b3261e",
  purple: "#6c5ce7",
  gray: "#8891a0",
  // PALETTE 키와 동일한 이름도 엣지 색상으로 그대로 쓸 수 있도록 별칭 추가
  web: "#2f5597",
  was: "#1f3d7a",
  db: "#1f7a4d",
  llm: "#c0620a",
  accent: "#6c5ce7",
  neutral: "#8891a0",
  danger: "#b3261e"
};

function defs() {
  const markers = Object.entries(ARROW_COLORS)
    .map(
      ([key, color]) => `
    <marker id="arrow-${key}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="${color}"/>
    </marker>`
    )
    .join("");
  return `<defs>${markers}</defs>`;
}

function renderEdge(e, nodesById) {
  const from = nodesById[e.from];
  const to = nodesById[e.to];
  if (!from || !to) return "";
  const [x1, y1] = e.fromPoint || anchorPoint(from, e.fromSide || "bottom");
  const [x2, y2] = e.toPoint || anchorPoint(to, e.toSide || "top");
  const color = ARROW_COLORS[e.color || "default"];
  const dash = e.dashed ? ` stroke-dasharray="6 4"` : "";
  const strokeW = e.strokeWidth || 1.8;

  let pathD;
  if (e.points && e.points.length) {
    const all = [[x1, y1], ...e.points, [x2, y2]];
    pathD = all.map((pt, i) => `${i === 0 ? "M" : "L"}${pt[0]},${pt[1]}`).join(" ");
  } else if (e.route === "hv") {
    const midX = e.midX ?? (x1 + x2) / 2;
    pathD = `M${x1},${y1} L${midX},${y1} L${midX},${y2} L${x2},${y2}`;
  } else if (e.route === "vh") {
    const midY = e.midY ?? (y1 + y2) / 2;
    pathD = `M${x1},${y1} L${x1},${midY} L${x2},${midY} L${x2},${y2}`;
  } else {
    pathD = `M${x1},${y1} L${x2},${y2}`;
  }

  const marker = e.noArrow ? "" : ` marker-end="url(#arrow-${e.color || "default"})"`;
  let out = `<path d="${pathD}" fill="none" stroke="${color}" stroke-width="${strokeW}"${dash}${marker}/>`;

  if (e.label) {
    const labelLines = Array.isArray(e.label) ? e.label : [e.label];
    let lx, ly;
    if (e.labelPoint) {
      [lx, ly] = e.labelPoint;
    } else if (e.points && e.points.length) {
      const mid = e.points[Math.floor((e.points.length - 1) / 2)] || e.points[0];
      [lx, ly] = mid;
    } else {
      lx = (x1 + x2) / 2;
      ly = (y1 + y2) / 2;
    }
    const fontSize = e.labelFontSize || 11.3;
    const boxW = Math.max(...labelLines.map((l) => l.length)) * fontSize * 0.62 + 12;
    const boxH = labelLines.length * fontSize * 1.3 + 6;
    out += `<rect x="${lx - boxW / 2}" y="${ly - boxH / 2}" width="${boxW}" height="${boxH}" fill="#ffffff" fill-opacity="0.92" rx="4"/>`;
    out += textBlock(lx, ly - ((labelLines.length - 1) * fontSize * 1.3) / 2 + fontSize * 0.35, labelLines, {
      fontSize,
      fill: e.labelColor || "#3c4552",
      weight: e.labelWeight || "500",
      lineHeight: fontSize * 1.3
    });
  }
  return out;
}

function renderLegend(x, y, items, { title } = {}) {
  let out = "";
  let cy = y;
  if (title) {
    out += textBlock(x, cy, [title], { fontSize: 12.5, fill: "#3c4552", weight: "700", anchor: "start" });
    cy += 20;
  }
  items.forEach((item) => {
    const p = PALETTE[item.color] || { fill: item.fill, stroke: item.stroke };
    out += `<rect x="${x}" y="${cy - 11}" width="16" height="16" rx="3" fill="${item.fill || p.fill}" stroke="${item.stroke || p.stroke}" stroke-width="1.3"/>`;
    out += textBlock(x + 24, cy + 1, [item.label], { fontSize: 12, fill: "#3c4552", anchor: "start" });
    cy += 22;
  });
  return out;
}

function renderDiagram(spec) {
  const { width, height, background = "#ffffff", title, subtitle } = spec;
  let body = "";
  const nodesById = {};

  for (const n of spec.nodes || []) {
    nodesById[n.id] = n;
  }

  for (const n of spec.groups || []) {
    body += renderGroup(n);
  }

  for (const n of spec.nodes || []) {
    if (n.kind === "diamond") {
      body += renderDiamond(n);
    } else if (n.kind === "note") {
      body += renderNote(n);
    } else if (n.kind === "entity") {
      const res = renderEntity(n);
      body += res.svg;
      n.h = res.actualHeight;
    } else {
      body += renderSimpleBox(n);
    }
  }

  for (const e of spec.edges || []) {
    body += renderEdge(e, nodesById);
  }

  if (spec.legendItems) {
    body += renderLegend(spec.legendX ?? 24, spec.legendY ?? height - spec.legendItems.length * 22 - 16, spec.legendItems, {
      title: spec.legendTitle
    });
  }

  let header = "";
  let topOffset = 0;
  if (title) {
    header += textBlock(width / 2, 30, [title], { fontSize: 20, fill: "#1f2430", weight: "700" });
    topOffset = 36;
  }
  if (subtitle) {
    header += textBlock(width / 2, 30 + topOffset, [subtitle], { fontSize: 12.5, fill: "#6b7280", weight: "400" });
  }

  // 다이어그램마다 첫 노드의 y좌표를 손으로 맞추지 않아도 제목/부제와 겹치지 않도록,
  // 본문 전체를 아래로 밀어내는 고정 여백을 둔다.
  const headerPad = title ? 55 : 0;
  const scale = spec.scale ?? 2;
  const totalHeight = height + headerPad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${totalHeight * scale}" viewBox="0 0 ${width} ${totalHeight}">
  <rect width="${width}" height="${totalHeight}" fill="${background}"/>
  ${defs()}
  ${header}
  <g transform="translate(0, ${headerPad})">
    ${body}
  </g>
</svg>`;
}

async function writeDiagramPng(spec, outPath) {
  const svg = renderDiagram(spec);
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  return { width: spec.width, height: spec.height, path: outPath };
}

module.exports = {
  FONT,
  PALETTE,
  esc,
  textBlock,
  anchorPoint,
  renderDiagram,
  writeDiagramPng
};
