# Chengdu Lens AI Agent 系统设计

## 1. Design Goal

Agent 的目标不是生成一篇成都攻略，而是把用户的模糊旅行意图转化为可解释、可验证、可调整的城市体验。

核心闭环：

```text
感知请求 -> 建立任务状态 -> 选择工具 -> 检索证据 -> 验证约束
-> 排序解释 -> 生成行动方案 -> 接收反馈 -> 局部重规划
```

首版使用一个编排 Agent。只有当任务需要不同权限、独立评估或并行执行时，才拆成多个 Agent。

## 2. Agent Task State

Agent 维护显式任务状态，避免每次对话都重新生成一份攻略。

```json
{
  "goal": "build a four-hour Chengdu city experience",
  "startArea": "Taikoo Li",
  "endBy": "18:30",
  "hardConstraints": ["no spicy food", "walking preferred", "indoor backup required if raining"],
  "softPreferences": ["quiet neighborhoods", "local texture", "photogenic spaces"],
  "travelerCapabilities": {
    "language": "English",
    "chinaTravelFamiliarity": "low",
    "canUseChineseApps": false,
    "paymentReadiness": "international card plus cash"
  },
  "confirmedPlaces": [],
  "rejectedPlaces": [],
  "unresolvedRisks": ["opening status must be confirmed before departure"],
  "planStatus": "discovering"
}
```

任务状态分为四类：

- **目标**：用户这次想完成什么。
- **硬性约束**：违反后必须排除或澄清。
- **软性偏好**：用于排序和解释。
- **能力与风险**：语言、预约、支付、导航、天气和现场规则。

## 3. Architecture

```text
Experience Layer
  ├─ Taste Profile
  ├─ Discover
  ├─ Place Evidence Detail
  ├─ My Collection
  ├─ Route / Replan
  └─ Agent Workspace
        ↓
Agent Orchestrator
  ├─ Request Parser
  ├─ Task State Manager
  ├─ Tool Router
  ├─ Constraint Gate
  ├─ Retriever / Ranker
  ├─ Explanation Composer
  └─ Evidence Guard
        ↓
Tools and Data
  ├─ Place Knowledge Base
  ├─ Evidence Index
  ├─ Map Adapter
  ├─ Weather Adapter
  ├─ Opening Status Checker
  ├─ International Access Checker
  ├─ Preference Memory
  └─ Collection State
```

LLM 用于自然语言理解、标签归一、候选解释和澄清问题生成。规则和工具用于硬性约束、事实字段、证据门槛、路线可行性和错误回退。

## 4. Tool Contracts

| 工具 | 用途 | 输出 | 回退 |
|---|---|---|---|
| `parse_request` | 解析目标、约束、偏好 | 结构化任务状态 | 要求用户补充关键硬约束 |
| `search_places` | 根据标签和区域召回候选 | 候选地点 ID 列表 | 返回受控 Demo 数据 |
| `get_place_evidence` | 获取字段级来源与更新时间 | Evidence cards | 降低置信度，不补事实 |
| `check_hard_constraints` | 过滤硬冲突 | pass / excluded / needs_confirmation | 显示澄清卡 |
| `check_route` | 验证时间、距离、顺序 | 时间矩阵和路线风险 | 使用标记清楚的 Demo 矩阵 |
| `check_weather_fit` | 判断室内外与天气冲突 | 风险和替代建议 | 使用 Demo 天气场景 |
| `check_international_access` | 检查英文信息、预约、支付、导航和规则 | accessibility status | 标记人工确认 |
| `read_preference_memory` | 读取用户确认偏好 | confirmed preferences | 无记忆时只用当前会话 |
| `write_preference_memory` | 写入明确反馈 | reversible update | 推断偏好不写入 |
| `read_collection` | 读取收藏、拒绝和同行备注 | collection state | 回退到本地状态 |

工具日志保存工具名、输入摘要、状态和时间，不保存模型隐藏思维链。

## 5. RAG Design

RAG 的检索单元不是整段攻略，而是可追踪的地点事实和体验信号。

每个地点包含：

- 稳定事实：名称、类型、地址、经纬度、街区。
- 易变事实：营业时间、票务、预约、价格、临时关闭。
- 体验信号：安静程度、拍摄条件、拥挤风险、适合人群。
- 国际信号：国际游客理解成本、跨文化兴趣、语言摩擦。
- 本地信号：中国平台相关性、长尾发现、近期讨论趋势。
- 可执行信号：英文信息、护照预约、支付、导航、现场规则。
- 来源记录：链接、来源类型、获取日期、允许使用范围。
- 编辑判断：纳入理由、冲突处理、仍待确认字段。

检索流程：

1. 解析请求为硬性约束、软性偏好和任务目标。
2. 按地点类型、区域、体验标签召回候选。
3. 读取候选的 Evidence cards。
4. 先执行 Constraint Gate。
5. 对通过 Gate 的候选计算 Personal Fit。
6. 单独计算 Evidence Confidence。
7. 生成推荐理由、风险和来源。

## 6. Constraint Gate and Scoring

硬性约束先过滤，不进入加权分数。

必须排除或澄清的情况：

- 饮食过敏、安全风险或明确不可接受条件。
- 到达时大概率关闭且无替代验证。
- 时间、距离或返程缓冲不可行。
- 预约、证件、支付或导航条件对国际游客不可执行。
- 来源不足以支撑关键事实。

通过 Gate 后才计算 Personal Fit：

```text
Personal Fit =
40% explicit taste match
+ 25% time and spatial fit
+ 15% desired experience/category fit
+ 10% pace and effort fit
+ 10% curator, companion, or similar-user signal
```

Evidence Confidence 独立计算：

```text
Evidence Confidence =
35% source authority
+ 25% freshness
+ 20% cross-source consistency
+ 20% field completeness
```

International Relevance、Local Relevance 和 Operational Accessibility 作为独立字段展示，不合并为总热度分。

## 7. Agent Workspace

Agent Workspace 让招聘者看见系统如何工作，但不暴露隐藏思维链。

固定结构：

1. **Understood**：目标、硬约束、软偏好。
2. **Retrieved**：召回候选数量和资料范围。
3. **Checked**：证据、地图、天气和可执行性检查。
4. **Excluded**：被排除候选及一行原因。
5. **Recommended**：最终推荐、评分和来源。
6. **Next Action**：收藏、补充信息、生成路线或重规划。

示例：

```text
Understood: 4 hours, Taikoo Li start, walking preferred, no spicy food.
Retrieved: 18 controlled Chengdu place records.
Checked: 6 have enough evidence; 2 require opening confirmation.
Excluded: 3 exceed route time; 1 has unresolved diet risk.
Recommended: save 3 places before building route.
```

## 8. Memory Design

| 层级 | 内容 | 策略 |
|---|---|---|
| 当前任务 | 日期、起点、时间、预算、临时限制 | 会话结束后删除或匿名化 |
| 明确偏好 | 收藏、拒绝、用户主动设置 | 需授权，可查看，可撤回 |
| 推断信号 | 本次排序中临时推断的标签 | 不直接写入长期记忆 |
| 敏感信息 | 精确位置历史、身份、健康信息 | 默认不保存 |

用户只有在明确点击收藏、拒绝或设置偏好后，系统才考虑写入长期偏好。Agent 不把一次停留时间或一次天气选择推断为长期偏好。

## 9. Replanning Logic

重规划不是重写完整攻略，而是局部替换。

流程：

1. 锁定用户明确保留的地点。
2. 识别变化条件：天气、疲劳、排队、提前结束。
3. 判断受影响节点。
4. 从同类或互补类别中召回替代候选。
5. 重新通过 Constraint Gate。
6. 输出保留项、替换项、原因和剩余风险。

验收条件：已确认地点不被静默删除；替换原因可追溯；新方案仍满足时间和可执行性约束。

## 10. Evaluation

离线评估集应覆盖：

- 硬约束冲突：不吃辣、雨天、时间不足、预约不可行。
- 模糊偏好：本地感、好拍、不要太游客化。
- 国际游客摩擦：英文信息不足、支付不确定、中文 App 依赖。
- 路线冲突：跨区折返、停留时间过长、返程缓冲不足。
- 重规划：下雨、疲劳、提前结束、同行者否决。

红线错误：

- 虚构来源或用户评价。
- 把模拟数据说成实时数据。
- 用高匹配分覆盖硬冲突。
- 复制第三方平台评论或评分。
- 在用户未确认时写入长期偏好。
