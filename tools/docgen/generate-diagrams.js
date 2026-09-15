// 모든 다이어그램을 assets/*.png로 일괄 렌더링.
const path = require("path");
const fs = require("fs");
const { writeDiagramPng } = require("./lib/svgkit");

const { buildArchitectureDiagram } = require("./diagrams/architecture");
const { buildSubmissionFlowDiagram } = require("./diagrams/flowSubmission");
const { buildDiagnosisFlowDiagram } = require("./diagrams/flowDiagnosis");
const { buildDiscussionFlowDiagram } = require("./diagrams/flowDiscussion");
const { buildLlmPipelineDiagram } = require("./diagrams/llmPipeline");
const { buildRubricStructureDiagram } = require("./diagrams/rubricStructure");
const { buildCurriculumMappingDiagram } = require("./diagrams/curriculumMapping");
const { buildRecommendationDataDiagram } = require("./diagrams/recommendationData");
const { buildErdCoreDiagram } = require("./diagrams/erdCurrentCore");
const { buildErdReferenceDiagram } = require("./diagrams/erdCurrentReference");
const { buildErdProductionDiagram } = require("./diagrams/erdProduction");

const OUT_DIR = path.join(__dirname, "assets");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const jobs = [
  ["architecture.png", buildArchitectureDiagram],
  ["flow-submission.png", buildSubmissionFlowDiagram],
  ["flow-diagnosis.png", buildDiagnosisFlowDiagram],
  ["flow-discussion.png", buildDiscussionFlowDiagram],
  ["llm-pipeline.png", buildLlmPipelineDiagram],
  ["rubric-structure.png", buildRubricStructureDiagram],
  ["curriculum-mapping.png", buildCurriculumMappingDiagram],
  ["recommendation-data.png", buildRecommendationDataDiagram],
  ["erd-current-core.png", buildErdCoreDiagram],
  ["erd-current-reference.png", buildErdReferenceDiagram],
  ["erd-production.png", buildErdProductionDiagram]
];

async function main() {
  for (const [filename, builder] of jobs) {
    const spec = builder();
    const outPath = path.join(OUT_DIR, filename);
    await writeDiagramPng(spec, outPath);
    console.log(`OK  ${filename}  (${spec.width}x${spec.height})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
