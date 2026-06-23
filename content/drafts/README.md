# 内容草稿目录

本目录供 **内容 Agent** 写入后续新讲、样板回改或专题补充草稿。草稿**不参与构建**，不得被 `src/` import。

## 已归档内容

MVP 0.1 十二讲 JSON 样板与 MVP 0.2–0.3 Wave 1–4B 全部 Markdown 草稿/审核稿已合入 [`src/data/demoConcepts.ts`](../../src/data/demoConcepts.ts)，移入：

```text
content/archive/merged/
├── drafts/     # 12 JSON + wave1–wave4b/
└── reviewed/   # wave1–wave4b 审核稿 + mvp-0.1 修复回合
```

如需查阅历史写作版本，请读 archive，**勿以 archive 为准写新稿**。

## 当前内容状态

Final Wave 已完成，56 / 56 讲全部入库，当前剩余 stub 为 0。后续若新增专题或回改样板，仍从本目录起草，审核通过后由主开发合入 `src/data/*`。

## 写作规范

- 字段与 v2 正文结构：[`docs/content-schema.md`](../../docs/content-schema.md) §7
- 入库门禁：[`docs/content-production-gate.md`](../../docs/content-production-gate.md)
- 流水线：`content/drafts/` → `content/reviewed/` → 主开发合入 `src/data/*` → `npm run validate:content`

审核通过后移入 `content/reviewed/`，由主开发按 schema §3 映射转换并合入。
