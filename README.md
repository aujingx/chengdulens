# Chengdu Lens · 成都漫游

> 帮第一次来四川的国际自由行游客，把「今天去哪、明天怎么去」变成一段能执行的旅程。
>
> A bilingual travel concierge prototype for first-time international visitors to Sichuan.

**[体验 Demo / Open the demo](https://chengdulens.lovable.app)** · **[中文产品案例](docs/product-case-study-cn.md)** · **[English case study](docs/product-case-study-en.md)**

## 两分钟体验 / Two-minute walkthrough

1. 点「体验行程」，再点「开始行程演示」：从太古里出发，四小时、轻松走、不吃辣。
2. 点「看看今天的成都预订」：只出现成都订位演示，不会出现外地酒店。
3. 在同一段对话点「明天去九寨沟」：先看高铁、接驳、过夜与入园如何衔接，再打开当地预订。
4. 在酒店卡获取模拟报价，试一次「模拟付款成功但订房失败」和退款。官方外链只供自行核对；站内不发起付款或真实预约。

Start the guided trip, open today's Chengdu booking options, and choose Jiuzhaigou for tomorrow in the same conversation. Open the Jiuzhaigou options to simulate a hotel payment, supplier failure and refund. The preset walkthrough works without live AI; free-text travel questions use live AI when available.

## 产品取舍 / Product decisions

| 决策 / Decision | 本版交付 / Shipped | 尚未实现 / Not shipped |
| --- | --- | --- |
| 先解决决策，再介入交易 / Decisions before transactions | 双语地点资料、收藏、估算路线；按天延续的向导对话 | 实时地图路线、库存和自动购票 |
| 事实与建议分开 / Separate facts from advice | 人工维护地点记录和核对入口；不编造可用性 | 商业数据授权、自动检索与核验 |
| 付款不等于预订成功 / Payment ≠ confirmation | 按目的地展示选项，本地模拟确认与退款 | 真实扣款、供应商履约、售后与对账 |

## 文档 / Documentation

- **[完整产品蓝图（中文）](docs/product-roadmap-cn.md)** / **[Product strategy and roadmap](docs/product-roadmap-en.md)** — 目标用户、产品边界、阶段规划、指标、风险与上线门槛。
- [产品案例](docs/product-case-study-cn.md) / [Case study](docs/product-case-study-en.md) — 产品判断与个人职责。
- [演示验收](docs/demo-spec-cn.md) / [Demo acceptance](docs/demo-spec-en.md) — 可复现的关键路径、异常和双语检查。
- [Agent 设计](docs/agent-system-design-cn.md) / [Agent design](docs/agent-system-design-en.md) — 长期设计，不代表已全部实现。
- [研究与证据](docs/research-evidence-appendix-cn.md) / [Research & evidence](docs/research-evidence-appendix-en.md) · [Agent 评估](docs/agent-evaluation-cases-cn.md) / [Evaluation cases](docs/agent-evaluation-cases-en.md) — 假设与测试设计，不是上线成效。

## Local development

```sh
bun install
bun run dev
bun test src/lib/journey.test.ts
```

Built with TanStack Start, React, TypeScript and Tailwind CSS. The guided journey and simulated checkout need no credentials; live chat requires a server-side `LOVABLE_API_KEY`.
