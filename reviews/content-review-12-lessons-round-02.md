# 12 讲样板课程内容复核报告（Round 02）

## 1. 复核结论

**通过：可作为 56 讲内容样板进入受控扩展。**

一句话判断：P0 已清零，P1 主要质量风险已明显收敛；这 12 讲现在可以作为后续 44 讲的内容生产模板，但入库仍需由主开发按流水线转换/合入并运行正式校验。

## 2. 本轮复核范围

复核对象仍为以下 12 个草稿：

- `content/drafts/token.json`
- `content/drafts/attention.json`
- `content/drafts/prefill.json`
- `content/drafts/decode.json`
- `content/drafts/ttft.json`
- `content/drafts/kv-cache.json`
- `content/drafts/model-gateway.json`
- `content/drafts/multi-model-routing.json`
- `content/drafts/context-window.json`
- `content/drafts/agent-loop.json`
- `content/drafts/skill.json`
- `content/drafts/issue-fix-agent.json`

未复核 56 讲全量内容，未修改 `src/`、schema、动画规格或依赖。

## 3. 结构校验复核

人工脚本复核结果：**NO STRUCTURAL ISSUES**。

已确认：

- 12 个 JSON 均可解析。
- 未发现写作字段混入正式 schema，例如 `oneSentence`、`commonPitfalls`、`animationBrief`、`relatedConcepts`、`answer`、`visual`。
- `relatedConceptIds` 与 `diagnosticQuestion.relatedConceptIds` 均来自 `docs/content-schema.md` 的 56 讲登记表。
- `hasAnimation === (animation != null)`。
- 除 `skill` 按权威登记保持无动画外，其余 11 讲动画类型均在首版 registry 覆盖范围内。
- 诊断题 `correctOptionIds` 均存在于对应 `options[].id`。
- 单选 / 多选结构合法。

## 4. P0 复核

### P0-01：`attention` 悬空 `rag-pipeline`

复核结果：**已修复**。

- `rag-pipeline` 已从 `relatedConceptIds` 移除。
- `rag-pipeline` 已从 `diagnosticQuestion.relatedConceptIds` 移除。
- RAG 语义保留在 `tags` 中，符合 schema 边界。

### P0-02：`skill` 动画登记冲突

复核结果：**已修复**。

- `skill.json` 已改为 `hasAnimation: false`。
- 未再包含 `animation` 字段。
- 与 `docs/content-schema.md` 登记表和首版 registry 一致。

## 5. P1 复核

### P1-01：诊断题干扰项偏弱

复核结果：**已基本修复**。

本轮修改后，错误项普遍变成真实工程中可能被误选的方案，例如：

- 切便宜模型、下调输出 Token、增加摘要缓存。
- 扩容 Decode、调流式缓冲、增加输出上限。
- 固定比例切流、低价优先、单模型收敛。
- 扩大搜索范围、补 PR 描述、先生成测试但不复现。

这些干扰项能训练“优先级判断”，比 Round 01 的明显错误项更适合作为样板。

### P1-02：案例场景重复

复核结果：**已改善**。

- `token.json` 已从 RAG 成本失控改为办公附件/邮件线程总结成本治理。
- `prefill.json` 已从 RAG 片段过长改为审批 Agent 工具返回过长。
- 性能链路课程仍有 TTFT / KV Cache 的自然重叠，但现在重复程度可接受。

### P1-03：动画 description 导演口吻

复核结果：**已修复**。

关键词检查未发现残留：

- `画面展示`
- `画面`
- `并排展示`
- `热力图`

动画步骤现在更像机制状态解释，`highlightTargets` 保留给组件做视觉映射。

### P1-04：概念边界不足

复核结果：**已改善**。

已补充的关键边界包括：

- 注意力权重不能当作完整因果解释。
- KV Cache 跨请求复用依赖服务端会话、前缀缓存和路由实现。
- 多模型路由应先满足质量门槛，再比较成本、时延和稳定性。
- Skill 不等同于所有平台通用插件。
- Issue Fix Agent 是默认受限执行的工程师助手。

### P1-05：全部 `contentStatus: "mvp"` 过早

复核结果：**仍需主开发入库时确认，但不再阻塞样板通过**。

从当前内容质量看，12 讲均可作为 `mvp` 候选；最终是否全部以 `mvp` 入库，应由主开发结合 MVP 1.0 内容节奏决定。

## 6. 更新后评分

- Schema 合规性：9.5 / 10
- 概念准确性：8.7 / 10
- 工程落地性：8.5 / 10
- 企业案例质量：8.1 / 10
- 诊断题质量：8.0 / 10
- 动画脚本质量：8.2 / 10
- 样板一致性：8.4 / 10
- 综合评分：8.5 / 10

## 7. 仍需注意的 P2

- 后续 44 讲不要机械复制“题干给指标、正确答案唯一对应本讲概念”的题型；可以增加多选、权衡题、排序题风格的单选表达。
- 性能类课程天然会共享 TTFT / Token / KV Cache 指标，写作时要保证每讲主诊断视角不同。
- `skill` 当前无动画，页面接入时应确保 ConceptPage 对 `hasAnimation:false` 的完整课程展示自然。
- 入库前仍需要正式 `npm run validate:content`，本轮只是草稿目录的审核复核，不等同于构建门禁。

## 8. 给主开发 Agent 的接入建议

- 可以将 12 讲作为 MVP 1.0 完整内容候选。
- 接入优先顺序建议：
  1. Token、TTFT、KV Cache、Agent Loop、Issue Fix Agent，形成 Demo 闭环。
  2. Prefill、Decode、模型网关、多模型路由、上下文窗口，补齐工程主线。
  3. 注意力机制、Skill，作为机制与能力复用补充。
- `skill` 无动画是预期状态，不需要 fallback。
- 其余 11 讲动画类型均可走首版 AnimationPlayer registry。
- DiagnosticQuestion 结构可直接支持现有单选/多选组件。

## 9. 给内容生产 Agent 的样板规则

后续 44 讲可以沿用这轮修订后的模板，但必须保持以下约束：

- 关联字段只写课程 id，不写动画类型或普通术语。
- 每道诊断题至少有两个真实但优先级错误的工程干扰项。
- 企业案例要换场景，不要所有问题都写成 RAG、TTFT 或高峰期。
- 动画 description 写机制状态，不写视觉导演说明。
- 概念边界要主动写清适用条件、观测证据和不能过度推断的地方。

## 10. 最终建议

- 是否可以进入内容修订阶段：本轮 P1 已完成，可以结束 Round 01 修订。
- 是否可以让主开发接入部分内容：可以。
- 是否可以基于这 12 讲扩展到剩余 44 讲：可以，但建议先把本报告第 9 节固化为内容生产检查清单。
