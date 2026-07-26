
# Chengdu Lens · 重构方案

针对你指出的 4 个问题，做一次系统性重做。

## 一、导航重构：从 5 tab → 单页滚动 + 侧边锚点

**删除**：顶部多 tab 结构、Case Study 独立页、Collection 独立页。

**新结构**（单页 `/`，从上到下）：

```text
┌─────────────────────────────────────────────┐
│  Hero: 城市封面 + 一句话 + [开始探索] CTA      │
├─────────────────────────────────────────────┤
│  ① Your Taste — 一屏画像（默认已填 Demo）    │
├─────────────────────────────────────────────┤
│  ② Discover — 8 个景点卡片流                  │
├─────────────────────────────────────────────┤
│  ③ Your Trip — 收藏 + 半日路线时间轴          │
├─────────────────────────────────────────────┤
│  ④ Ask AI — AI 向导 Demo（inline，不浮动）   │
├─────────────────────────────────────────────┤
│  Footer: About this demo（原 Case Study 精简）│
└─────────────────────────────────────────────┘
```

- 左侧固定 **锚点导航条**（4 个圆点 + 标签，scroll-spy 高亮当前段落）。
- 顶部只保留 Logo + 语言切换。删除移动端横向 tab。
- Case Study 收进 footer 的可展开 "About this demo"。
- 用户浏览逻辑清晰：**看画像 → 挑景点 → 拼行程 → 问 AI**。

## 二、AI Agent Demo（Lovable AI Gateway）

- 启用 `LOVABLE_API_KEY`（不启用 Lovable Cloud，纯前端 + server function）。
- 新建 `src/routes/api/chat.ts` — TanStack server route，使用 `streamText` + `openai/gpt-5.5`。
- System prompt 注入：当前 Taste Profile、已收藏景点、8 个景点的详细数据（作为知识库）。
- Chat UI 用 AI Elements（`conversation`、`message`、`prompt-input`、`shimmer`），流式渲染 markdown。
- 建议问题预设 chip：「推荐一个雨天备份」「哪个最适合拍照」「安排我的下午路线」。
- **删除**右下浮动 AgentDock 和脚本化 baseAgentLog，避免静态脚本伪装为推理过程。

## 三、景点内容丰富化

`src/data/places.ts` 每条景点补充：

- `intro`：2–3 段深度介绍（历史/文化背景），中英双语。
- `nearby`：3–5 个周边好吃好玩，每个含名称、类型（food / cafe / shop / view）、一句话、步行分钟数。
- `ticket`：`{ price, currency, hours, booking_url, note }`（免费则标注 free）。
- `transit`：`{ metro: "Line 2 · Chunxi Road Exit D", walk_min, tips }`。
- `bestTime`：建议时段（避开人群/最佳光线）。

**Detail Sheet 抽屉重做**：从右侧全高抽屉滑出，分区展示：
Hero 图 → 快速信息条（票价 / 时长 / 地铁） → 深度介绍 → 周边推荐（横向卡片） → 门票预约按钮 → 评估指标（Personal Fit / Evidence 折叠在最下）。

## 四、视觉重做（等你选方向）

计划截取当前 Discover 页作为参考，生成 3 个 refined 视觉方向，锁定当前的暖橘/草绿/晴空蓝配色 + Outfit/Figtree 字体，让你挑一个再实施。三个方向的差异化：

- **A · Editorial Travel**：大图杂志感、留白舒展、Serif 强调标题句、卡片信息极简（图 + 名 + 一句话 fit reason + Save）。
- **B · Warm Concierge**：柔和圆角、暖阳阴影、每张卡片带一枚 emoji tag + 3 条 quick facts（🎫 免费 · 🚇 2min · 📸 photogenic）。
- **C · Bento Grid**：不等大方格、封面景点占大格、其余小格，密度高但节奏清晰，快速扫读。

## 五、卡片精简（现在文字太多）

**移除**：Evidence grade 徽章、双评分条、风险警告文案、Not for me 按钮、View detail 链接。

**保留 & 优化**：图片、名称（中英）、类型 + 区域、**一句话 why fits**、Save 按钮、3 个 quick fact 图标（票价/时长/室内外）。

评分和风险信息移入详情抽屉。

## 构建顺序（build 模式内执行）

1. 截取当前 Discover 页 → `design--create_directions` 生 3 方向 → 你挑一个。
2. 单页滚动结构 + 锚点导航（删除 `discover.tsx` / `collection.tsx` / `itinerary.tsx` / `case-study.tsx`，全部合入 `index.tsx` 分区组件）。
3. 扩充 `places.ts` 数据（intro / nearby / ticket / transit / bestTime）。
4. 重做 PlaceCard（精简）+ PlaceDetailSheet（内容丰富）。
5. 接入 `LOVABLE_API_KEY` + `/api/chat` + AI Elements chat UI，替换旧 AgentDock。
6. 事件收尾：删除废弃组件、更新 `__root.tsx` head、检查响应式。

## 技术细节

- 数据仍全部 inline，不启用 Lovable Cloud（只需 AI Gateway 的 `LOVABLE_API_KEY`）。
- AI Elements 通过 `bun x ai-elements@latest add conversation message prompt-input shimmer` 安装。
- 单页锚点用原生 `scrollIntoView({ behavior: 'smooth' })` + `IntersectionObserver` 做 scroll-spy。
- 门票链接用官方站（如武侯祠 wuhouci.net.cn），无官方预约的标注"On-site tickets only"。
