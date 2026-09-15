// AI 독서토론 1:1 채팅 처리 흐름 (POST /api/discussions/:sessionId/messages)
function buildDiscussionFlowDiagram() {
  const width = 820;
  const height = 980;
  const mainX = 250;
  const mainW = 320;

  const nodes = [
    { id: "n1", x: mainX, y: 50, w: mainW, h: 50, color: "web", title: "학생: 메시지 입력 후 전송" },
    {
      id: "n2",
      x: mainX,
      y: 130,
      w: mainW,
      h: 60,
      color: "was",
      title: "POST /discussions/:sessionId/messages",
      lines: ["메시지 길이(1~1000자) · 세션 소유자 검증"]
    },
    { id: "n3", x: mainX, y: 220, w: mainW, h: 50, color: "db", title: "user 메시지 저장 (addDiscussionMessage)" },
    { id: "n4", x: mainX, y: 300, w: mainW, h: 60, color: "db", title: "대화 이력 조회", lines: ["최근 20건 (MAX_DISCUSSION_HISTORY)"] },
    {
      id: "n5",
      x: mainX,
      y: 390,
      w: mainW,
      h: 60,
      color: "accent",
      title: "chatDiscussionReply 호출",
      lines: ["buildDiscussionSystemPrompt(책 제목/학년군)"]
    },
    { id: "n6", x: mainX, y: 480, w: mainW, h: 60, color: "llm", title: "LLM 호출", lines: ["temperature 0.6 · {\"reply\": ...} 스키마"] },
    { id: "n7", kind: "diamond", x: mainX, y: 570, w: mainW, h: 90, lines: ["스키마 검증", "통과?"] },
    { id: "n8", x: 610, y: 570, w: 170, h: 90, color: "danger", title: "고정 문구 폴백", lines: ["template-fallback", "\"연결이 원활하지", "않아요...\""] },
    { id: "n9", x: mainX, y: 690, w: mainW, h: 50, color: "accent", title: "assistant 응답 확정" },
    { id: "n10", x: mainX, y: 770, w: mainW, h: 60, color: "db", title: "assistant 메시지 저장", lines: ["addDiscussionMessage (updated_at 갱신)"] },
    { id: "n11", x: mainX, y: 860, w: mainW, h: 60, color: "web", title: "응답 반환", lines: ["채팅창에 말풍선 렌더"] }
  ];

  const edges = [
    { from: "n1", to: "n2", color: "gray" },
    { from: "n2", to: "n3", color: "blue" },
    { from: "n3", to: "n4", color: "blue" },
    { from: "n4", to: "n5", color: "blue" },
    { from: "n5", to: "n6", color: "orange" },
    { from: "n6", to: "n7", color: "default" },
    { from: "n7", to: "n8", fromSide: "right", toSide: "left", color: "red", label: "3회 실패" },
    { from: "n7", to: "n9", color: "green", label: "검증 통과" },
    { from: "n9", to: "n10", color: "green", toPoint: [370, 770] },
    {
      from: "n8",
      to: "n10",
      fromSide: "bottom",
      color: "default",
      points: [
        [695, 730],
        [450, 730]
      ],
      toPoint: [450, 770],
      label: "폴백 응답도 이력 저장"
    },
    { from: "n10", to: "n11", color: "blue" }
  ];

  return {
    width,
    height,
    title: "AI 독서토론 처리 흐름",
    subtitle: "POST /api/discussions/:sessionId/messages 요청 처리 시퀀스",
    nodes,
    edges
  };
}

module.exports = { buildDiscussionFlowDiagram };
