import type { Lang } from "@/data/i18n";

type CaseDoc = {
  id: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  points: Record<Lang, string[]>;
};

export const caseStudyDocs: CaseDoc[] = [
  {
    id: "product-case",
    title: {
      en: "Product Case Study",
      zh: "产品案例",
    },
    summary: {
      en: "Chengdu Lens focuses on trusted discovery for first-time international visitors: which places fit me, why they are trustworthy, and whether I can realistically do them today.",
      zh: "Chengdu Lens 聚焦首次来成都的国际游客：哪些地方适合我、为什么可信、今天是否真实可执行。",
    },
    points: {
      en: [
        "MVP loop: Taste Profile -> trusted discovery -> evidence detail -> saves -> half-day route -> local replan.",
        "The target user is not modeled by nationality, but by China travel familiarity, language, booking, payment, navigation, travel motivation, and explicit constraints.",
        "The demo intentionally excludes hotels, flights, visas, payments, group tours, car booking, public UGC, and multi-city long-trip planning.",
      ],
      zh: [
        "MVP 闭环：Taste Profile -> 可信发现 -> 证据详情 -> 收藏 -> 半日路线 -> 局部重规划。",
        "目标用户不按国籍建模，而按中国旅行熟悉度、语言、预约、支付、导航、旅行动机和明确限制判断。",
        "Demo 有意排除酒店、机票、签证、支付、组团、包车、公开 UGC 和多城市长线行程。",
      ],
    },
  },
  {
    id: "agent-design",
    title: {
      en: "AI Agent Design",
      zh: "AI Agent 设计",
    },
    summary: {
      en: "The product uses a single orchestrating Agent. The site simplifies the interface, while the product design defines how the Agent should parse, retrieve, check, exclude, recommend, and replan.",
      zh: "产品使用单一编排 Agent。网站简化了交互展示，但产品设计定义了 Agent 如何解析、检索、核查、排除、推荐和重规划。",
    },
    points: {
      en: [
        "LLM responsibilities: intent understanding, tag normalization, explanation, and user-facing response.",
        "Deterministic responsibilities: hard constraints, route feasibility, evidence boundaries, fallback states, and exclusion logic.",
        "Hidden chain-of-thought is not shown; the reviewer-facing logic is structured as Understood, Retrieved, Checked, Excluded, Recommended, and Next Action.",
      ],
      zh: [
        "LLM 负责意图理解、标签归一、解释文案和用户对话。",
        "确定性规则负责硬约束、路线可行性、证据边界、fallback 状态和排除逻辑。",
        "不展示隐藏思维链；面向评审展示的是 Understood、Retrieved、Checked、Excluded、Recommended、Next Action。",
      ],
    },
  },
  {
    id: "evidence-scope",
    title: {
      en: "Evidence & Scope",
      zh: "证据与边界",
    },
    summary: {
      en: "This is an interactive concept demo. Place content, ticket information, route timing, scores, and AI responses are for demonstration and require verification before production use.",
      zh: "这是一个交互式概念 Demo。地点内容、票务信息、路线时间、评分和 AI 回复均用于展示，真实上线前需要重新验证。",
    },
    points: {
      en: [
        "Verified secondary facts can support context and design constraints, but not product results.",
        "Research hypotheses can define scenarios and test tasks, but should not be written as completed user interviews.",
        "Third-party platform content should be linked, not copied. Reviews, usernames, avatars, and unauthorized ratings are excluded.",
      ],
      zh: [
        "已验证二手事实可支持背景和设计约束，但不能当作产品结果。",
        "研究假设可用于定义场景和测试任务，但不能写成已完成的用户访谈。",
        "第三方平台内容只能链接，不复制评论、用户名、头像或未经授权评分。",
      ],
    },
  },
  {
    id: "roadmap",
    title: {
      en: "Roadmap",
      zh: "未来规划",
    },
    summary: {
      en: "The next step is not global expansion. The credible path is to validate Chengdu first, then test a small multi-city framework with different city archetypes.",
      zh: "下一步不是直接扩到全球。更可信的路径是先验证成都，再用少量不同类型城市测试可复制框架。",
    },
    points: {
      en: [
        "Stage 1: improve Chengdu source registration, usability tests, and offline Agent evaluation.",
        "Stage 2: add 2-3 city archetypes, such as Chengdu, Shanghai, and Xi'an, to test city-specific discovery logic.",
        "Stage 3: expand to curated collections for major Chinese travel cities before considering global search.",
      ],
      zh: [
        "阶段 1：完善成都来源登记、可用性测试和 Agent 离线评估。",
        "阶段 2：加入 2-3 个城市类型，例如成都、上海、西安，用于测试城市差异化发现逻辑。",
        "阶段 3：先扩展到中国主要旅游城市的 curated collections，再考虑全球搜索。",
      ],
    },
  },
];
