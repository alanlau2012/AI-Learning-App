# 正文改版 · M2 批次摘要

**日期**：2026-06-23  
**范围**：m2 全部 10 讲（`contentRevision: v2`）

## 改动摘要

全部 10 讲：`prefill` / `decode` / `ttft` / `tpot` / `kv-cache` / `session-affinity` / `batch-scheduling` / `pd-separation` / `speculative-decoding` / `quantization`

- 机制：`string[]` → 2–3 组 `MechanismGroup[]`
- 术语：Token / Prefill / Decode / Embedding 全册锁定
- 字段深度：definition 50–90 字、whyItMatters 90–150 字、pitfalls/keyTakeaways 各 4 条

## 门禁

`validate:content` / `typecheck` / `lint` / `build` 均 PASS（与 M1 同批平台层一并验证）。

## 建议抽测

- `/concepts/kv-cache` — 分组机制 + 动画步骤术语
- `/concepts/prefill` — Prefill-Decode 动画与正文术语一致
