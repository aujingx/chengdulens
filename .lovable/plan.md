
# Chengdu Lens · 旅行 AI Demo

一个面向首次来成都的国际独立旅行者的 AI 城市发现助手 Demo。整体走**明亮、放松、快乐的旅行调性**，而不是原 prompt 里那种冷峻的产品仪表盘 —— UIUX 优先，动线顺滑，一眼看懂。

## 视觉与体验基调

- **配色（明亮旅行感）**
  - 底：奶油米白 `#FBF7F0`
  - 主文字：深墨 `#1F2A24`
  - 强调色 1（暖橘珊瑚，主 CTA / 高光）：`#FF7A4D`
  - 强调色 2（清新草绿，标签 / 成功态）：`#4EA871`
  - 强调色 3（晴空蓝，Agent / 信息态）：`#2F80ED`
  - 柔和黄（点缀 / hover）：`#F4C95D`
- **字体**：Outfit（标题，圆润现代）+ Figtree（正文，清晰友好），通过 Google Fonts 在 `__root.tsx` 用 `<link>` 加载。
- **形态**：中等圆角（12–20px）、柔和阴影、卡片有呼吸感、留白舒展，不做仪表盘那种高密度堆叠。
- **布局**：顶部导航 + 全宽主内容 + 右下浮动 Agent 助手按钮（点开为侧抽屉，可最小化）。

## 信息架构（顶部导航 5 项）

1. Home（封面故事 + 大 CTA）
2. Discover（推荐卡片流）
3. My Collection（收藏）
4. Route（半日路线 + 雨天改线）
5. Case Study（PM 作品集案例）

右上角：语言切换（EN / 中）、"Use Demo Profile" 快捷入口。
右下角：浮动 Agent 助手气泡（在 Discover / Collection / Route 页可展开为侧抽屉）。

## 各页面设计

### 1. Home（城市封面故事 + 大 CTA）
- 全宽 hero：成都街景/公园图 + 覆盖式渐变，中央大标题 "See Chengdu the way you'd actually live it."，副标题一句话说明产品定位。
- 主 CTA：**Start with a Demo Profile**（一键载入默认场景：4 小时、太古里出发、不吃辣、偏安静、可能下雨）。
- 次 CTA：Build your own taste（进入 Taste Profile 表单）。
- 下方三段"这个产品做什么 / 不做什么 / 数据边界"横向卡片。
- 明确 Demo 标签："Demo scenario. Not based on completed user interviews."

### 2. Taste Profile（品味画像）
- 单页表单，分 4 步用进度条串起（但都在一屏内、可任意跳）：
  1. 场景（时间 / 出发点 / 结束时间）
  2. 品味标签（5 张可点选卡：quiet neighborhoods / local texture / photogenic / culture+food / creative & contemporary）
  3. 硬约束（预算、步行、饮食忌口、雨天备份）
  4. 自然语言补充（大文本框）
- 顶部醒目按钮："Use Demo Profile" 一键填好全部字段。
- 完成后进入 Discover。

### 3. Discover（发现）
- 顶部：当前画像摘要 chip 条 + 简单筛选（indoor / photogenic / low spice）。
- 主区：8 张 Chengdu 地点卡（数据全部内联 inline），每卡：
  - 真实照片（Wikimedia 图片，失败降级为渐变占位 + "Image unavailable"）
  - 名称（EN + 中文小字）+ 类型标签
  - Why this fits（一句话）
  - 两个圆环/条状指标：**Personal Fit** 与 **Evidence Confidence**（始终分开）
  - 风险一句话 + Source 链接
  - Save / Not for me 两个按钮
- 交互反馈：Save 后卡片微动效 + 右下 Agent 气泡显示"Added to your collection"。

### 4. Evidence Detail（详情弹层 / 抽屉）
- 从 Discover 卡点开为大抽屉（不切页面，减少断层）。
- 左：大图 + 图源标签；右：Personal Fit / Evidence Confidence 分开展示；下：International Relevance / Local Relevance / Operational Accessibility 三条评估、字段级来源、时间戳、需确认风险、Amap Demo 地图占位。

### 5. My Collection（收藏）
- 顶部：已收藏数 / 类型分布小图 / 预计总时长。
- 卡片网格 + 可拖拽排序（UX 亮点）。
- 至少 3 个收藏时高亮"Build my half-day route" CTA。

### 6. Route & Rain Replan
- 左：垂直时间轴（出发 → 各点 → 返回缓冲），每段显示步行/交通时间、停留、Agent 的一条 trade-off 说明。
- 右：Demo 地图占位（SVG，成都轮廓 + 编号 pin，连线）。
- 顶部大按钮 **"Rain just started"** → 触发改线：并排展示"保留 / 替换 / 原因 / 新风险"对比卡，替换项用户绿色标签，被替换项灰化划掉。

### 7. Agent Workspace（右下浮动 → 侧抽屉）
- 全站可召唤，不占主内容。
- 抽屉里显示 6 段固定阶段：Understood / Retrieved / Checked / Excluded / Recommended / Next Action。
- 每段用小图标 + 时间戳 + 简短句子（无隐藏思维链）。
- 至少 3 次工具调用、1 个被排除候选（附原因）、1 个国际旅客可达性核查、1 个雨天改线总结。

### 8. Case Study
- 单页可滚动，编辑感排版：问题 / 目标用户 / MVP 范围 / Agent 架构 / RAG 与证据模型 / 指标 / 局限。
- 每段配简单示意图（SVG）；不外链 md 文件，直接内联渲染。

## 技术方案

- 全在前端完成，**不启用 Lovable Cloud**。
- TanStack Start 现有文件路由：
  - `src/routes/index.tsx` → Home（**替换现有占位**）
  - `src/routes/discover.tsx`
  - `src/routes/collection.tsx`
  - `src/routes/route.tsx`
  - `src/routes/case-study.tsx`
  - Taste Profile 作为 modal / drawer 覆盖在 Home 或独立 `src/routes/profile.tsx`
- 每个路由自带 `head()`（唯一 title / description / og）。
- 全局状态用轻量 zustand + `localStorage` 持久化：profile / saves / rejects / route / replan / language / eventLog。
- 内联数据：`src/data/places.ts`（8 条 Chengdu 地点，字段照 prompt schema）+ `src/data/i18n.ts`（EN / 中 双语字典）+ `src/data/agent-script.ts`（Agent 阶段脚本）。
- UI：shadcn 组件（Button / Card / Dialog / Sheet / Tabs / Progress / Badge / Tooltip）+ Tailwind v4 语义 token。
- 设计 token 全部落到 `src/styles.css` 的 `@theme` + `:root`（oklch 格式），组件里绝不写 hex 或 `bg-white`。
- 字体在 `__root.tsx` head 用 `<link>` 引 Google Fonts（Outfit + Figtree）。
- Lucide 图标。
- 图片：Wikimedia URL 直连 + `onError` 降级为渐变 + 文案占位。
- 事件日志：写入 `localStorage.eventLog`，Case Study 页有一段"事件如何映射到指标"的说明。
- 语言切换：`useLanguage()` hook + 字典对象；单语言模式下不混合另一语言（除专有名词）。

## 验收（对齐 prompt §7）

- 一键 Demo Profile → 保存 3 个地点 → 生成路线 → 触发一次雨天改线，全程 ≤ 2 分钟。
- 展示至少 3 种地点类型；Personal Fit 与 Evidence Confidence 始终分离。
- 硬约束作为 Gate 不进入加权分。
- Agent 抽屉展示工具调用、排除原因、下一步。
- 无 API key、刷新后状态保留、单语言模式无中英混杂、不复制第三方评论/用户名/头像/评分。

## 构建顺序

1. 设计 token + 字体 + 双语字典 + 内联地点数据 + zustand store。
2. Home + Taste Profile。
3. Discover + Evidence Detail 抽屉。
4. Collection + Agent 浮动助手 & 侧抽屉。
5. Route + Rain Replan + 事件日志。
6. Case Study + 空态 / 图片降级 / 响应式 + 各路由 head。
