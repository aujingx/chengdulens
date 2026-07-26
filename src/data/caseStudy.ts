import type { Lang } from "@/data/i18n";

type CaseDoc = {
  id: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  points: Record<Lang, string[]>;
};

type BriefItem = {
  id: string;
  label: Record<Lang, string>;
  value: Record<Lang, string>;
};

export const caseStudyBrief: BriefItem[] = [
  {
    id: "target",
    label: { en: "Target", zh: "目标用户" },
    value: {
      en: "First-time international visitors in Chengdu with limited familiarity with Chinese travel apps.",
      zh: "首次到成都、对中国旅行应用不熟悉的国际自由行游客。",
    },
  },
  {
    id: "problem",
    label: { en: "Problem", zh: "问题" },
    value: {
      en: "Plenty of content, but no quick way to judge personal fit, source quality, and what is practical today.",
      zh: "内容很多，但很难快速判断是否适合自己、信息是否可信、今天是否可执行。",
    },
  },
  {
    id: "bet",
    label: { en: "Product bet", zh: "产品假设" },
    value: {
      en: "A recommendation is more likely to be saved when fit, evidence, and feasibility are visible.",
      zh: "当适配原因、来源证据和可执行性清楚可见时，推荐更可能转化为收藏与行动。",
    },
  },
  {
    id: "role",
    label: { en: "My role", zh: "我的职责" },
    value: {
      en: "Product strategy, user scenarios, Agent and RAG design, UX, and bilingual demo delivery.",
      zh: "产品策略、用户场景、Agent 与 RAG 设计、交互设计及双语 Demo 交付。",
    },
  },
  {
    id: "shipped",
    label: { en: "Shipped", zh: "已完成" },
    value: {
      en: "Taste profile, 8 source-linked places, saves, half-day route, rain replan, and a scoped AI concierge.",
      zh: "偏好画像、8 个带来源地点、收藏、半日路线、雨天重规划和限定范围的 AI 向导。",
    },
  },
  {
    id: "next",
    label: { en: "Next gate", zh: "下一步门槛" },
    value: {
      en: "5 usability tests and an offline Agent evaluation set before expanding to another city.",
      zh: "完成 5 次可用性测试和 Agent 离线评估后，再决定是否扩展到下一座城市。",
    },
  },
];

export const caseStudyDecisions: Record<Lang, string[]> = {
  en: [
    "Chengdu first",
    "Discovery before booking",
    "One orchestrating Agent",
    "Hard constraints before scoring",
  ],
  zh: ["先做成都", "先验证发现再做交易", "使用单一编排 Agent", "硬约束先于评分"],
};

export const caseStudyDocs: CaseDoc[] = [
  {
    id: "strategy",
    title: {
      en: "Strategy & Scope",
      zh: "策略与范围",
    },
    summary: {
      en: "A narrow first loop for trusted city discovery.",
      zh: "以可信城市发现为核心的首个闭环。",
    },
    points: {
      en: [
        "MVP loop: Taste Profile -> trusted discovery -> evidence detail -> saves -> half-day route -> local replan.",
        "Segment by China-travel familiarity, language, booking, payment, navigation, motivation, and explicit constraints.",
        "Exclude hotels, flights, transactions, public UGC, group tours, and multi-city planning.",
      ],
      zh: [
        "MVP 闭环：偏好画像 -> 可信发现 -> 证据详情 -> 收藏 -> 半日路线 -> 局部重规划。",
        "按中国旅行熟悉度、语言、预约、支付、导航、动机和明确限制细分用户。",
        "不做酒店、机票、交易、公开 UGC、组团和多城市规划。",
      ],
    },
  },
  {
    id: "agent-design",
    title: {
      en: "Agent & RAG",
      zh: "Agent 与 RAG",
    },
    summary: {
      en: "One orchestrator with explicit task state and bounded tools.",
      zh: "一个编排 Agent、明确的任务状态和有边界的工具。",
    },
    points: {
      en: [
        "RAG retrieves place facts, experience signals, source records, and operational constraints.",
        "The LLM handles intent and explanation; rules handle exclusions, route feasibility, and fallback states.",
        "Visible trace: Understood -> Retrieved -> Checked -> Excluded -> Recommended -> Next action.",
      ],
      zh: [
        "RAG 检索地点事实、体验信号、来源记录和执行约束。",
        "LLM 负责意图与解释；规则负责排除、路线可行性和异常状态。",
        "可见决策轨迹：理解 -> 检索 -> 核查 -> 排除 -> 推荐 -> 下一步。",
      ],
    },
  },
  {
    id: "trust-evaluation",
    title: {
      en: "Trust & Evaluation",
      zh: "信任与评估",
    },
    summary: {
      en: "Recommendation quality is measured beyond response fluency.",
      zh: "推荐质量不以文案流畅度作为唯一标准。",
    },
    points: {
      en: [
        "Keep Personal Fit and Evidence Confidence separate; run hard constraints as a gate.",
        "Track activation, evidence opens, saves, route generation, and replan acceptance.",
        "Red lines: fabricated sources, copied reviews, unsupported real-time claims, and silent removal of confirmed stops.",
      ],
      zh: [
        "Personal Fit 与 Evidence Confidence 分开；硬约束先过门槛。",
        "跟踪激活、来源查看、收藏、路线生成和重规划接受率。",
        "红线：伪造来源、复制评论、无依据的实时信息、静默删除已确认地点。",
      ],
    },
  },
  {
    id: "execution",
    title: {
      en: "Execution & Roadmap",
      zh: "交付与路线图",
    },
    summary: {
      en: "Validate the Chengdu loop before adding breadth.",
      zh: "先验证成都闭环，再增加覆盖范围。",
    },
    points: {
      en: [
        "Current: bilingual interactive demo, controlled data for 8 places, route and rain-replan flow.",
        "Next: source registration, 5 usability tests, and an offline Agent evaluation set.",
        "Later: test Shanghai and Xi'an as different city archetypes before broader expansion.",
      ],
      zh: [
        "当前：双语交互 Demo、8 个地点的受控数据、路线和雨天重规划流程。",
        "下一步：来源登记、5 次可用性测试和 Agent 离线评估集。",
        "之后：用上海和西安测试不同城市类型，再决定是否扩大覆盖。",
      ],
    },
  },
];
