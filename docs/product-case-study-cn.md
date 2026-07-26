# Chengdu Lens 产品案例

## 1. Executive Summary

Chengdu Lens 是一个面向首次来成都的国际自由行游客的 AI 城市发现 Agent。它解决的不是“成都有什么景点”，而是“哪些地方适合我、为什么可信、能否在今天真实完成”。

首版产品聚焦一个闭环：

```text
Taste Profile -> 可信发现 -> 证据详情 -> 个人收藏 -> 半日路线 -> 局部重规划
```

文档中的用户场景是研究假设，地点数据用于 Demo 结构验证，不代表实时推荐结果或商业指标。

## 2. Problem Definition

成都旅游信息已经过载。对国际自由行游客来说，真正的难点不是缺少内容，而是决策成本高：

- 内容平台提供大量灵感，但真实体验、商业推广和个人匹配混在一起。
- 地图产品擅长导航，却很少解释一个地方为什么值得去。
- OTA 产品擅长交易和完整行程，但城市内的深度发现容易被标准化路线覆盖。
- 通用 AI 可以生成攻略，但常缺少来源、可执行性检查和不确定性说明。

因此产品机会不是“生成更多攻略”，而是把分散的地点、内容、地图和用户偏好转化为一组可解释、可收藏、可执行的城市选择。

## 3. Target User

首版目标用户是第一次来到成都、停留二到四天、主要使用英语、希望体验本地城市生活但不熟悉中文平台和现场规则的国际自由行游客。

产品不按国籍粗暴建模，而按以下变量判断：

- 中国旅行熟悉度
- 语言和中文应用使用能力
- 预约、支付、导航和现场沟通能力
- 旅行动机：文化、食物、城市空间、摄影、家庭、四川延伸
- 明确限制：时间、预算、饮食、步行能力、同行关系

国内首次游客、本地居民、亲子、摄影、购物、博物馆和行动能力有限等场景会作为压力测试，但不扩大首版目标用户。

## 4. Jobs to Be Done

当我来到一座陌生城市时，我希望发现少量真正符合我品味的好看、好吃、好玩、好拍的地方，理解推荐依据和风险，并把收藏组合成现实可行的半日体验，这样我不用在多个应用之间反复比较，也不必只依赖热门榜单。

## 5. Product Strategy

### Product Bet

用户愿意收藏并执行一个推荐，不只取决于地点本身是否热门，还取决于三个问题：

1. 这个地方为什么适合我？
2. 支持推荐的证据是否可信？
3. 今天是否真的能完成？

### MVP Includes

- Taste Profile 与自然语言请求
- 受控地点知识库与 RAG 检索
- Personal Fit 与 Evidence Confidence 双评分
- 地点证据详情和来源链接
- 个人 Collection
- Case Study：展示产品判断、AI Agent 逻辑和证据边界
- 半日路线与一次局部重规划

### MVP Excludes

- 酒店、机票、签证、支付和完整交易闭环
- 公开内容社区和UGC发布
- 组团、包车和导游撮合
- 多城市长线行程
- 未经授权的平台评论复制或评分聚合

## 6. Core Experience

用户先完成一个轻量 Taste Profile，例如安静街区或热门地标、传统文化或当代空间、慢游或高密度探索、美食或文化优先、室内或户外偏好。

示例请求：

> I have four hours this afternoon. I am staying near Taikoo Li, prefer quiet local neighborhoods, do not want spicy food, and would rather walk than spend time in traffic.

系统返回少量候选地点，每个地点都显示：

- Why this fits
- What to know
- Personal Fit
- Evidence Confidence
- International Relevance
- Local Relevance
- Operational Accessibility
- Source links
- Save / Not for me

用户收藏三到四个地点后，Agent 才生成半日路线。若用户输入“开始下雨了”或“太累了”，系统只替换受影响地点，保留用户明确确认的选择。

## 7. AI Agent Design

Chengdu Lens 使用单一编排 Agent，而不是为了展示复杂度拆成多个虚拟 Agent。Agent 的职责是把模糊意图转化为可观察的任务状态，并在推荐前完成检索、约束验证和证据检查。

Agent 工作流：

```text
解析请求 -> 建立任务状态 -> 检索候选 -> 检查证据
-> 验证硬约束 -> 排序与解释 -> 收藏 -> 路线 -> 局部重规划
```

Agent 使用工具：

- Place Knowledge Base / RAG
- Evidence Index
- Map Adapter
- Weather Adapter
- Opening Status Checker
- International Access Checker
- Preference Memory
- Collection State

LLM 负责意图理解、标签归一和解释文案；确定性规则负责硬约束、排除、评分边界和路线可行性。Demo 不展示隐藏思维链，只展示结构化决策摘要。

完整系统设计见 [AI Agent 系统设计](agent-system-design-cn.md)。

## 8. Data and Trust Model

推荐不是一个总热度分，而是四类分离判断：

- **Personal Fit**：是否适合当前用户和当前场景。
- **Evidence Confidence**：证据是否可靠、新鲜、完整。
- **International Relevance**：是否被国际游客理解或认为有独特价值。
- **Operational Accessibility**：语言、预约、支付、导航和现场规则是否可执行。

硬性约束先作为 Gate，不参与加权抵消。饮食过敏、安全、营业状态、返程时间或预约不可行等冲突会导致排除或待确认，而不是被高匹配分覆盖。

数据来源策略：

- 官方来源用于营业时间、预约、门票、规则等事实。
- 国际游客来源用于理解跨文化兴趣和摩擦点。
- 中国平台链接用于发现本地相关性和长尾地点，但不复制评论、头像、用户名或未经授权评分。
- 无法确认的信息必须标记为待确认。

研究与证据细节见 [研究与证据附录](research-evidence-appendix-cn.md)。

## 9. Metrics and Evaluation

### Product Metrics

- Activation：完成 Taste Profile 并提交请求。
- Discovery Success：查看证据详情后收藏至少一个地点。
- Trust Engagement：打开来源、查看风险或阅读不适合条件。
- Collection Conversion：收藏三到四个地点后生成路线。
- Replan Success：条件变化后接受局部替换。

### Agent Evaluation

- Constraint pass rate：是否正确排除硬冲突地点。
- Evidence grounding rate：推荐理由是否能追溯到资料字段。
- Clarification quality：是否只在缺少关键硬约束时提问。
- Replanning stability：是否保留已确认选择，只替换受影响部分。
- Red-line failure rate：是否出现无法证明的实时状态、虚构来源或不合规数据使用。

## 10. Execution Plan

| 阶段 | 目标 | 交付物 |
|---|---|---|
| Phase 1 | 验证产品判断 | 文档、场景、数据契约、Demo 规格 |
| Phase 2 | 构建可演示 Demo | 单页官网、本地数据、8 个地点、Ask AI、Case Study |
| Phase 3 | 补充真实证据 | 轻量访谈、可用性测试、地点来源登记 |
| Phase 4 | 探索业务化 | 策展 Collection、合作商家、四川延伸路线 |

## 11. Key Trade-Offs

- 选择国际游客而不是所有游客：避免画像泛化，突出国际化产品判断。
- 选择发现和收藏而不是交易：先验证决策价值，再考虑供给与商业闭环。
- 选择单 Agent 编排而不是多 Agent：保持职责可解释、可评估、可演示。
- 选择链接来源而不是复制平台内容：降低合规风险，提高作品集可信度。

## 12. Limitations

- 当前用户场景是可验证假设，而非真实访谈数据。
- 地点数据尚未完成公开级来源登记。
- 地图、天气和实时营业状态在 Demo 中使用模拟适配器。
- 产品价值还没有通过真实激活率、收藏率和路线转化率验证。
