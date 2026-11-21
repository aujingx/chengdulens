export type Bi = { zh: string; en: string };

export const northStar = {
  name: { zh: "可执行行程确认率", en: "Itinerary Execution Rate" } as Bi,
  def: {
    zh: "生成行程后，至少保存一条路线或核对一个官方来源的用户占比。衡量建议是否真的被采用，而不是聊了多少轮。",
    en: "Share of users who save a route or verify at least one official source after a plan is generated. Measures adoption, not chat volume.",
  } as Bi,
};

export const funnel: { step: Bi; metric: Bi }[] = [
  { step: { zh: "说出需求", en: "State the need" }, metric: { zh: "首屏需求提交率", en: "First-screen intent rate" } },
  { step: { zh: "选地点 / 托管", en: "Pick or delegate" }, metric: { zh: "偏好确认率", en: "Preference confirm rate" } },
  { step: { zh: "生成路线", en: "Generate route" }, metric: { zh: "可行路线生成率", en: "Feasible route rate" } },
  { step: { zh: "核对与预订", en: "Verify & book" }, metric: { zh: "官方核对 / 预订点击率", en: "Verify / booking click rate" } },
];

export const guardrails: { name: Bi; target: string }[] = [
  { name: { zh: "事实性错误（营业时间、票价）", en: "Factual errors (hours, prices)" }, target: "≤ 1%" },
  { name: { zh: "闭馆时段排入路线", en: "Closed venue scheduled" }, target: "0" },
  { name: { zh: "未选目的地出现预订项", en: "Booking for unselected destination" }, target: "0" },
  { name: { zh: "付款成功但订单失败未退款", en: "Paid but failed, not refunded" }, target: "0" },
];

export const layers: { name: Bi; owns: Bi }[] = [
  { name: { zh: "确定性规则层", en: "Deterministic rules" }, owns: { zh: "路线时长、晴雨替换、预订范围、付款状态", en: "Route time, rain swaps, booking scope, payment state" } },
  { name: { zh: "精选知识层", en: "Curated knowledge" }, owns: { zh: "景点、周边、官方链接，均有出处", en: "Places, nearby picks, official links with sources" } },
  { name: { zh: "AI 语言层", en: "AI language layer" }, owns: { zh: "理解需求、解释取舍、回答开放问题", en: "Understand intent, explain trade-offs, open Q&A" } },
];

export const evalCriteria: { name: Bi; check: Bi }[] = [
  { name: { zh: "准确", en: "Accuracy" }, check: { zh: "回答只引用知识库内事实，否则提示去官方核对", en: "Only cites curated facts; otherwise points to official check" } },
  { name: { zh: "可执行", en: "Feasibility" }, check: { zh: "路线时间总和不超过用户可用时间", en: "Total route time fits available time" } },
  { name: { zh: "边界", en: "Scope" }, check: { zh: "模型输出不能触发预订或付款", en: "Model output never triggers booking or payment" } },
  { name: { zh: "文化与饮食", en: "Culture & diet" }, check: { zh: "尊重不吃辣、素食等偏好", en: "Respects no-spice, vegetarian preferences" } },
];

export const decisions: { q: Bi; a: Bi }[] = [
  { q: { zh: "为什么规则先于 AI？", en: "Why rules before AI?" }, a: { zh: "时间和钱必须算得准，AI 只负责说清楚。", en: "Time and money must be exact; AI explains." } },
  { q: { zh: "为什么预订不放在对话里？", en: "Why keep booking out of chat?" }, a: { zh: "交易需要可回看的状态，对话只负责建议。", en: "Transactions need reviewable state; chat suggests." } },
  { q: { zh: "为什么付款是模拟的？", en: "Why simulated payment?" }, a: { zh: "演示可复现，同时完整展示失败与退款路径。", en: "Reproducible demo that still shows failure and refund." } },
];
