# Chengdu Lens · 成都漫游

> 帮第一次来成都的国际自由行游客，按自己的时间和安排，得到一段能执行的路线——两小时随便走走，或今天加明天的完整行程。
>
> A bilingual travel concierge prototype for first-time international visitors to Sichuan.

**[体验 Demo / Open the demo](https://chengdulens.lovable.app)** · **[中文产品案例](docs/product-case-study-cn.md)** · **[English case study](docs/product-case-study-en.md)**

## 两分钟体验 / Two-minute walkthrough

1. 首页选「随便走走」：告诉它你在哪、什么心情，得到一条 1–3 小时的惊喜路线。
2. 或选「定制行程」：一句话或点选说明时间、出发地、今晚和明天——没说的不会被替你决定。
3. 自己一步步挑景点、晚餐、住宿，或「全部听 AI 的」；明天想去九寨沟时再加一天。
4. 在总览打开当天的预订，试一次「模拟付款成功但订房失败」和退款。站内不发起真实付款或预约。

Pick "Just wander" for a surprise walk from where you are, or "Plan my trip" to state your time, start, tonight and tomorrow — nothing is assumed. Choose stops yourself or let AI fill them, add a Jiuzhaigou day only if you want it, then try the simulated booking failure and refund.

## 产品取舍 / Product decisions

| 决策 / Decision | 本版体验 / Current experience | 演进方向 / Evolution |
| --- | --- | --- |
| 先解决决策，再介入交易 / Decisions before transactions | 双模式入口、明确需求、分步选择、晴雨路线；今天与明天共用草稿 | 实时地图路线、库存和自动购票 |
| 事实与建议分开 / Separate facts from advice | 人工维护地点记录和核对入口；不编造可用性 | 来源维护与核对日期、证据检索 |
| 付款不等于预订成功 / Payment ≠ confirmation | 按目的地展示选项，本地模拟确认与退款 | 经核实的供应商接口与可回看的确认流程 |

## 文档 / Documentation

按「产品判断 → 可开发需求 → 可度量质量」阅读。当前体验、产品演进和验证方案分别标注；目标值是规划目标，观察结果在实际执行后独立记录。

Read from product judgment to implementable requirements and measurable quality. Current experience, evolution and validation protocols are labeled separately; targets are proposed, and observed results are recorded after execution.

- **[产品规格说明（中文）](docs/product-spec-cn.md)** / **[Product specification](docs/product-spec-en.md)** — 用户场景、原则、信息架构、功能需求、指标与验收标准。
- **[完整产品蓝图（中文）](docs/product-roadmap-cn.md)** / **[Product strategy and roadmap](docs/product-roadmap-en.md)** — 目标用户、产品边界、阶段规划、指标与验证门槛。
- [产品案例](docs/product-case-study-cn.md) / [Case study](docs/product-case-study-en.md) — 产品判断与个人职责。
- [演示验收](docs/demo-spec-cn.md) / [Demo acceptance](docs/demo-spec-en.md) — 可复现的关键路径、异常和双语检查。
- [Agent 设计](docs/agent-system-design-cn.md) / [Agent design](docs/agent-system-design-en.md) — 长期设计，不代表已全部实现。
- [研究与证据](docs/research-evidence-appendix-cn.md) / [Research & evidence](docs/research-evidence-appendix-en.md) · [Agent 评估](docs/agent-evaluation-cases-cn.md) / [Evaluation cases](docs/agent-evaluation-cases-en.md) — 假设与测试设计，不是上线成效。

## Local development

```sh
bun install
bun run dev
bun test
```

Built with TanStack Start, React, TypeScript and Tailwind CSS. The guided journey and simulated checkout need no credentials; live chat requires a server-side `LOVABLE_API_KEY`.
