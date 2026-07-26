# Chengdu Lens Demo 规格

## 1. Demo Objective

网站需要在两分钟内证明一个产品闭环：

```text
建立品味 -> 查看可信推荐 -> 收藏地点 -> 生成路线 -> 局部重规划 -> 理解产品判断
```

目标不是展示所有旅游功能，而是让评审看到：

- 用户分层是否清楚。
- AI 辅助产品概念是否有明确边界。
- 推荐是否有证据与数据边界。
- MVP 取舍是否克制。

## 2. Current Website Structure

当前实现采用单页官网，而不是多个独立产品 tab：

1. Hero / Story
2. Your Taste
3. Discover
4. Your Trip
5. Ask AI
6. Case Study

这和早期六视图产品设计不同，但产品闭环一致。单页结构是为了让作品集阅读更顺。

## 3. Default Scenario

默认演示只使用一个稳定场景：

> First-time international visitor. Four hours this afternoon. Starting near Taikoo Li. Prefers quiet local neighborhoods, photogenic spaces, no spicy food, walking preferred, indoor backup needed if raining.

其他国际游客场景保留为研究假设和未来测试任务，不作为官网主流程。

## 4. Core Sections

### 1. Your Taste

- Demo Profile 按钮。
- 品味和约束字段。
- 时间、出发点、饮食、步行和雨天备选条件。
- 明确展示 demo 场景边界。

### 2. Discover

- 展示 8 个精选成都地点。
- 每张卡展示图片、名称、类型、区域、quick facts 和一句话 fit reason。
- 地点详情抽屉展示更深介绍、周边推荐、票务信息、交通提示和证据指标。
- 不复制第三方评论、用户名、头像或未经授权评分。

### 3. Your Trip

- 收藏形成轻量个人 Collection。
- 至少收藏三个地点后展示路线时间轴。
- 雨天重规划替换受影响的户外强依赖站点，同时保留整体路线形状。

### 4. Ask AI

- Lovable AI Gateway 可用时启用。
- AI 助手范围限定在 demo profile、已收藏地点和 8 条地点记录中。
- 应描述为 AI concierge demo，不应描述为生产级旅行助手。

### 5. Case Study

- 解释产品案例、AI Agent 设计、证据边界和路线图。
- 明确网站是交互式概念 Demo。
- 说明地点描述、票务信息、路线时间、评分和 AI 回复在真实上线前都需要验证。

## 5. Agent Logic

网站简化了可见 Agent Workspace，但产品设计仍遵循以下逻辑：

1. Understood
2. Retrieved
3. Checked
4. Excluded
5. Recommended
6. Next Action

硬性约束先作为 gate，再进入评分。即使卡片 UI 做了简化，Personal Fit 和 Evidence Confidence 在产品逻辑上仍然分离。

## 6. Data Scope

首版使用 8 条 inline 成都地点记录。数据仅用于界面验证和作品集叙事。

以下内容真实使用前都需要生产级验证：

- 营业时间
- 票务规则
- 预约链接
- 路线时间
- 周边推荐
- AI 回复
- 评分和热度信号

## 7. Event Tracking

Demo 阶段使用本地事件记录即可：

- `taste_profile_completed`
- `request_submitted`
- `place_viewed`
- `evidence_detail_viewed`
- `source_opened`
- `place_saved`
- `place_rejected`
- `route_generated`
- `replan_triggered`
- `place_replaced`
- `map_fallback_shown`

这些事件对应激活、信任参与、收藏转化、路线转化和重规划成功。

## 8. Acceptance Criteria

- 评审能在第一屏理解产品价值。
- 用户可以应用 demo profile 并浏览 8 个地点。
- 用户可以打开地点详情。
- 用户可以收藏至少三个地点并看到路线时间轴。
- 用户可以触发雨天重规划。
- 顶部导航可以进入 Case Study。
- Demo 和文档不暗示已完成真实验证、实时路线、实时营业状态或商业上线。
- 核心浏览和路线体验不依赖 AI key；Ask AI 依赖 Lovable AI Gateway 可用性。
- 中英文模式不混杂 UI 文案，必要产品术语除外。
