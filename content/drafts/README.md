# 12 讲课程样板内容草稿

本批次为 isolated draft，供内容审核 Agent 和主开发后续入库使用。草稿按 `docs/content-schema.md` 的 `KnowledgePoint` 字段名编写，不写入 `src/`，不参与当前应用构建。

## 文件列表

| 文件 | 课程 | schema 字段覆盖 | 动画脚本 | 诊断题 | 企业案例 |
|---|---|---|---|---|---|
| `token.json` | Token | 是 | 是，`token-flow` | 是 | 是 |
| `attention.json` | 注意力机制 | 是 | 是，`attention-map` | 是 | 是 |
| `prefill.json` | Prefill | 是 | 是，`prefill-decode` | 是 | 是 |
| `decode.json` | Decode | 是 | 是，`prefill-decode` | 是 | 是 |
| `ttft.json` | TTFT | 是 | 是，`prefill-decode` | 是 | 是 |
| `kv-cache.json` | KV Cache | 是 | 是，`kv-cache` | 是 | 是 |
| `model-gateway.json` | 模型网关 | 是 | 是，`model-router` | 是 | 是 |
| `multi-model-routing.json` | 多模型路由 | 是 | 是，`model-router` | 是 | 是 |
| `context-window.json` | 上下文窗口 | 是 | 是，`context-window` | 是 | 是 |
| `agent-loop.json` | Agent Loop | 是 | 是，`agent-loop` | 是 | 是 |
| `skill.json` | Skill | 是 | 否，首版登记无动画 | 是 | 是 |
| `issue-fix-agent.json` | Issue Fix Agent | 是 | 是，`issue-fix-flow` | 是 | 是 |

## 字段覆盖情况

每个 JSON 均包含以下 `KnowledgePoint` 字段：

- `id`
- `title`
- `slug`
- `moduleId`
- `order`
- `difficulty`
- `estimatedMinutes`
- `tags`
- `contentStatus`
- `hasAnimation`
- `definition`
- `whyItMatters`
- `mentalModel`
- `mechanism`
- `enterpriseCase`
- `pitfalls`
- `diagnosticQuestion`
- `keyTakeaways`
- `relatedConceptIds`

每讲内容均覆盖：

- 一句话定义：写入 `definition`
- 为什么重要：写入 `whyItMatters`
- 心智模型：写入 `mentalModel`
- 机制拆解：写入 `mechanism`
- 动画演示脚本：首版登记含动画的 11 讲写入 `animation`；`skill.json` 按权威登记表保持 `hasAnimation: false`，不写入 `animation`
- 企业案例：写入 `enterpriseCase`
- 常见误区：写入 `pitfalls`
- 诊断题：写入 `diagnosticQuestion`
- 核心结论：写入 `keyTakeaways`
- 关联知识点：写入 `relatedConceptIds`

说明：用户建议的动画步骤 `visual` 字段没有写入 JSON，因为当前 schema 的 `AnimationStep` 只定义 `id`、`title`、`description`、`highlightTargets`、`durationMs`。首版登记含动画的课程中，`description` 已尽量改为当前机制状态解释，具体画面映射由 `highlightTargets` 和动画组件承载。

## 评审后 P0 修订记录

- `attention.json`：已将 `rag-pipeline` 从 `relatedConceptIds` 和 `diagnosticQuestion.relatedConceptIds` 中移除，并保留为普通 `tags` 中的 `RAG` 语义标签，避免悬空课程 id。
- `skill.json`：已按权威登记表改为 `hasAnimation: false`，并移除 `skill-lifecycle` 动画配置，避免越权改变首版动画覆盖范围。

## 评审后 P1 修订记录

- 诊断题：已将明显荒谬的错误项替换为更真实的工程干扰项，例如换便宜模型、扩容、压缩输入、增加缓存、调大窗口、灰度切流、增加工具权限等，并在解析中说明优先级。
- 案例场景：已将 `token.json` 和 `prefill.json` 从重复的 RAG/首字慢案例中拉开，分别改为办公附件总结成本治理和审批 Agent 工具返回过长场景。
- 动画描述：已清理动画 `description` 中的“画面展示/导演说明”口吻，改为当前步骤的机制状态和工程含义。
- 概念边界：已补充注意力权重不能当作完整因果解释、KV Cache 跨请求复用依赖服务端能力、多模型路由应先满足质量门槛、Skill 不等同于所有平台通用插件、Issue Fix Agent 默认受限执行等边界。

## 需要人工审核的 5 个点

1. `skill.json` 当前已按首版登记保持无动画。若产品或主开发后续仍希望 Skill 具备 `skill-lifecycle` 动画，需要正式更新登记表、实现并注册动画组件后再补回 `animation`。
2. 所有草稿当前标记为 `contentStatus: "mvp"`，表示完整内容候选。审核 Agent 应确认每讲是否达到 MVP 内容质量，否则入库前应降为 `demo` 或保留为未入库草稿。
3. 诊断题已增强干扰项，但仍需审核选项是否存在歧义、正确答案是否唯一或多选充分、排查路径是否符合本项目目标用户的实际工作流。
4. 关联知识点已尽量使用 56 讲体系中的权威 id，但入库前仍需通过 `relatedConceptIds` 和 `diagnosticQuestion.relatedConceptIds` 的无悬空校验。
5. 企业案例未编造具体公司、产品或公开事件数据，但涉及 MaaS、RAG、Agent、Issue Fix 等场景的表述仍需由内容审核 Agent 检查是否过度确定或与团队口径不一致。

## 后续内容审核重点

- 检查每讲是否保持“企业 AI 应用工程教材”口径，而不是百科、论文综述、提示词技巧或营销文案。
- 检查每讲是否真正帮助用户完成定义、机制理解、工程现象识别、问题诊断和落地指导。
- 检查机制拆解是否控制在 4 到 7 步，且每步包含明确输入、处理、输出或工程影响。
- 检查动画脚本是否能被现有或规划动画组件实现，不引入复杂 3D、视频、监控大屏或独立 dashboard。
- 检查诊断题是否真实、可判定、可教学，避免变成定义题。
- 检查 `contentStatus`、`hasAnimation` 与后续入库阶段的 validate 规则是否一致。
- 审核通过后，应进入 `content/reviewed/`，再由主开发按流水线合入 `src/data/concepts.ts`，并运行 `validate:structure`、`validate:published-content`；P3 后还需运行 `validate:animation`。

## 自检结论

- 已生成 12 个课程 JSON 草稿。
- 首版登记含动画的 11 讲均包含动画脚本；`skill.json` 按登记表保持无动画。
- 每讲均包含诊断题、企业案例、常见误区和核心结论。
- 已完成一轮 P1 修订：诊断题干扰项、案例差异化、动画描述口径和关键概念边界均已更新。
- 未修改 `src/` 目录。
- 未修改 `docs/content-schema.md`。
- 未修改 `docs/animation-spec.md`。
- 未修改 `package.json`。
