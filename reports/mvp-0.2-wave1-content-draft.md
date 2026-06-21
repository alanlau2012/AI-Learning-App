# MVP 0.2 Wave 1 内容草稿报告

## 草稿文件清单
- `content/drafts/wave1/semantic-space.md`
- `content/drafts/wave1/transformer.md`
- `content/drafts/wave1/positional-encoding.md`
- `content/drafts/wave1/autoregressive.md`
- `content/drafts/wave1/sampling.md`
- `content/drafts/wave1/instruction-tuning.md`
- `content/drafts/wave1/hallucination.md`

## 每讲摘要
- semantic-space：把文本映射为可度量语义坐标，重点解释向量召回与业务边界。
- transformer：解释多层注意力加工上下文，强调长上下文不是无成本万能方案。
- positional-encoding：解释顺序和位置如何影响上下文利用，强调关键约束稳定位置。
- autoregressive：解释逐 token 生成、输出长度、流式体验和错误扩散。
- sampling：解释 temperature/top-p 等采样策略与任务风险分层。
- instruction-tuning：解释指令微调和偏好优化如何塑造模型行为。
- hallucination：解释幻觉的证据链、RAG、Agent 和评测治理。

## 企业案例工程信号
- semantic-space：规模、指标、系统边界、验证结果。
- transformer：规模、指标、系统边界、错误路径、验证结果。
- positional-encoding：指标、系统边界、约束条件、验证结果。
- autoregressive：规模、指标、错误路径、约束条件、验证结果。
- sampling：规模、指标、错误路径、约束条件、验证结果。
- instruction-tuning：规模、指标、约束条件、错误路径、验证结果。
- hallucination：规模、错误路径、约束条件、指标、验证结果。

## 诊断题答案
- semantic-space：A
- transformer：B
- positional-encoding：C
- autoregressive：D
- sampling：A
- instruction-tuning：B
- hallucination：C

## Wave 1 诊断题答案分布
- A：2
- B：2
- C：2
- D：1

结论：覆盖 A/B/C/D，任一选项最多 2 次，满足 7 题批次分布要求。强干扰题至少 5 道：semantic-space、transformer、autoregressive、sampling、instruction-tuning、hallucination 均含“看似合理但非第一步”的干扰项。

## 动画配置建议
- autoregressive：复用 `token-flow`，highlightTargets 使用 `input-text`、`tokens`、`prefill`、`decode`、`output-tokens`、`cost`。
- semantic-space、transformer、positional-encoding、sampling、instruction-tuning、hallucination：本轮纯文本，不接动画。

## 自检风险
- Transformer 内容容易百科化，草稿已用长上下文、证据组织、TTFT 和命中率等工程信号约束。
- Instruction tuning 容易写成训练概念，草稿已落到偏好目标、合规拒答和回归评测。
- Hallucination 容易泛泛讲“不要编造”，草稿已落到证据引用、版本校验和升级路径。
- Autoregressive 使用 `token-flow` 时需保证 highlightTargets 与现有画布 key 对齐，入库阶段需复核。
