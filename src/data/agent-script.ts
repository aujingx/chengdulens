export type AgentEntry = {
  stage: "understood" | "retrieved" | "checked" | "excluded" | "recommended" | "next";
  time: string;
  en: string;
  zh: string;
};

export const baseAgentLog: AgentEntry[] = [
  {
    stage: "understood",
    time: "14:02",
    en: "4 hours from Taikoo Li · quiet, photogenic, no spicy food · indoor backup if rain.",
    zh: "太古里出发 4 小时 · 安静、适合拍照、不吃辣 · 需室内备份。",
  },
  {
    stage: "retrieved",
    time: "14:02",
    en: "Tool · place_search → 12 Chengdu candidates from curated dataset.",
    zh: "工具 · place_search → 从精选数据集中检索 12 个成都候选。",
  },
  {
    stage: "checked",
    time: "14:03",
    en: "Tool · constraint_gate → drop items violating diet (no spicy) and time budget.",
    zh: "工具 · constraint_gate → 剔除违反饮食（不辣）和时间预算的项。",
  },
  {
    stage: "excluded",
    time: "14:03",
    en: "Excluded Panda Base — 42 min each way conflicts with 4-hour central-city window.",
    zh: "已排除大熊猫基地 —— 单程 42 分钟，与 4 小时中心城区窗口冲突。",
  },
  {
    stage: "checked",
    time: "14:03",
    en: "Tool · international_feasibility → confirmed English signage & passport rules at museum.",
    zh: "工具 · international_feasibility → 核查博物馆英文标识与护照规则。",
  },
  {
    stage: "recommended",
    time: "14:04",
    en: "8 candidates surfaced. Personal Fit and Evidence Confidence shown separately.",
    zh: "呈现 8 个候选。Personal Fit 与 Evidence Confidence 分开展示。",
  },
  {
    stage: "next",
    time: "14:04",
    en: "Save 3+ places to unlock route building. Weather backup ready if rain starts.",
    zh: "收藏 3 个以上以解锁路线生成。雨天备份就绪。",
  },
];

export const rainReplanEntry: AgentEntry = {
  stage: "recommended",
  time: "15:12",
  en: "Rain detected. Swapped outdoor tea stop for Chengdu Museum — same 90 min, indoor, keeps route arc.",
  zh: "检测到降雨。用成都博物馆替换户外茶馆，同为 90 分钟，室内，保持路线弧线。",
};
