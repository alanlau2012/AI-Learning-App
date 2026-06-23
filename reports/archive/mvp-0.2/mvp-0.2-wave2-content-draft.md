# MVP 0.2 Wave 2 内容草稿报告

## 草稿文件清单
- `content/drafts/wave2/reasoning-limit.md`
- `content/drafts/wave2/tpot.md`
- `content/drafts/wave2/session-affinity.md`
- `content/drafts/wave2/batch-scheduling.md`
- `content/drafts/wave2/pd-separation.md`
- `content/drafts/wave2/speculative-decoding.md`
- `content/drafts/wave2/quantization.md`

## 每讲摘要
- reasoning-limit：说明推理边界由上下文、任务拆解、工具、反馈和验证共同决定，强调复杂任务要可检查。
- tpot：区分 TTFT 与 TPOT，定位 Decode 阶段“首字后说得快不快”的体验指标。
- session-affinity：说明亲和的目标是 KV Cache 命中与会话连续，并平衡热点和容灾。
- batch-scheduling：解释 batch 在吞吐、延迟、公平性之间的调度权衡。
- pd-separation：解释 Prefill 与 Decode 资源特征不同，以及拆池后的收益与复杂度。
- speculative-decoding：解释草稿模型提议、目标模型验证，以及接受率对收益的决定作用。
- quantization：解释低精度表示带来的显存/吞吐收益和质量回归风险。

## 企业案例工程信号
- reasoning-limit：规模、指标、错误路径、约束条件、验证结果。
- tpot：指标、规模、系统边界、约束条件、验证结果。
- session-affinity：规模、指标、系统边界、错误路径、约束条件、验证结果。
- batch-scheduling：规模、指标、系统边界、错误路径、约束条件、验证结果。
- pd-separation：规模、指标、系统边界、错误路径、约束条件、验证结果。
- speculative-decoding：规模、指标、系统边界、约束条件、验证结果。
- quantization：指标、规模、系统边界、约束条件、验证结果。

## 诊断题答案
- reasoning-limit：D
- tpot：A
- session-affinity：B
- batch-scheduling：C
- pd-separation：B
- speculative-decoding：D
- quantization：C

## Wave 2 诊断题答案分布
- A：1
- B：2
- C：2
- D：2

结论：覆盖 A/B/C/D，任一选项最多 2 次。强干扰题至少 7 道，所有题均包含“方向看似合理但不是第一步”的选项。

## Wave 1 + Wave 2 整轮诊断题答案分布
- Wave 1：A=2，B=2，C=2，D=1
- Wave 2：A=1，B=2，C=2，D=2
- 合计：A=3，B=4，C=4，D=3

结论：14 题覆盖 A/B/C/D，任一选项占比不超过 40%。强干扰题比例高于 30%。

## 动画配置建议
- `tpot`：复用 `prefill-decode`，聚焦首 Token 后的 Decode 段；建议 highlightTargets：`first-output-token`, `decode-loop`, `long-output`, `tpot`, `token-interval`, `total-latency`。
- `session-affinity`：复用 `kv-cache`，聚焦同会话命中 vs 打散重算；建议 highlightTargets：`session`, `instance`, `kv-write`, `cache-hit`, `route-miss`, `cache-miss`, `memory`, `eviction`。
- `reasoning-limit`、`batch-scheduling`、`pd-separation`、`speculative-decoding`、`quantization`：本轮纯文本，不接动画。

## 自检风险
- reasoning-limit 容易口号化，草稿已落到任务拆解、工具、评测、人工复核和步骤级错误率。
- batch-scheduling / pd-separation 容易写成推理系统论文摘要，草稿已用队列、P99、SLA、长短任务混排和阶段指标约束。
- speculative-decoding 容易误写成“猜答案”，草稿明确目标模型验证与接受率。
- quantization 容易只写压缩，草稿补充质量回归、硬件适配和任务分层。
- tpot 与 session-affinity 需要在入库时复核动画 type 已注册且 highlightTargets 可映射。
