# 正文改版 · M1 批次摘要

**日期**：2026-06-23  
**范围**：m1 全部 10 讲（`contentRevision: v2`）  
**样板**：`reviews/transformer-改版样板对比.html` 改后列；`transformer` 为金样 verbatim 落地。

## 改动摘要

| 讲 id | 机制分组 | 术语对齐 | 误区/结论 4 条 |
|-------|----------|----------|----------------|
| token | ✓ A/B/C | Token/Prefill/Decode | ✓ |
| semantic-space | ✓ | ✓ | ✓ |
| transformer | ✓ 金样 | ✓ | ✓ |
| attention | ✓ | ✓ | ✓ |
| positional-encoding | ✓ | ✓ | ✓ |
| autoregressive | ✓ | ✓ | ✓ |
| sampling | ✓ | ✓ | ✓ |
| instruction-tuning | ✓ | ✓ | ✓ |
| hallucination | ✓ | ✓ | ✓ |
| reasoning-limit | ✓ | ✓ | ✓ |

## 实现方式

- 运行时合并：`src/utils/applyV2Revisions.ts` 在 `demoConcepts` 导出时应用 v2 规则。
- 渲染：`MechanismContent` 分组 + `RichText` `**加粗**`；ConceptPage 编辑排版语言对齐样板。

## 门禁

```
npm run validate:content  PASS
npm run typecheck           PASS
npm run lint                PASS
npm run build               PASS
```

## 建议抽测

- `/concepts/transformer` — 机制 A/B/C 分组、定义左边线、误区破折号列表
- `/concepts/token` — 动画区不受影响、机制分组正常
- `/modules/m1` — ConceptCard ledger 行布局
