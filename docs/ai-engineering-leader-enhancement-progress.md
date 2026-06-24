# AI 工程负责人增强共享进度

> 版本：v0.2  
> 日期：2026-06-24  
> 总控：Codex / Product Architect Agent  
> PRD：[ai-engineering-leader-enhancement-prd.md](ai-engineering-leader-enhancement-prd.md)  
> 任务拆解：[ai-engineering-leader-enhancement-tasks.md](ai-engineering-leader-enhancement-tasks.md)

## 0. 共享规则

每个 Agent 开工前必须先读：`AGENTS.md`、PRD、tasks、本文件、P0 规格输入 `docs/ai-engineering-leader-enhancement-p0-specs.md`。

状态枚举：`todo` / `claimed` / `in-progress` / `review` / `done` / `blocked`

更新要求：领取任务前登记文件锁；完成后写清产物路径和验证结果；内容草稿未审核前不得标为 `done`；遇到阻塞必须写入“阻塞项”；历史决策只追加不删除。

## 1. 当前总览

| 项目 | 当前值 |
|---|---|
| 当前阶段 | P1 schema 与数据入库完成 |
| 当前目标 | SCHEMA-01、SCHEMA-02、DEV-01 已完成；后续可启动 DEV-02/03/04 |
| 总任务数 | 32 |
| 已完成 | 14 |
| review / 进行中 | 3 |
| 阻塞 | 0 |
| 最近更新 | 2026-06-24 |
| 最近更新者 | Codex / Implementation |

## 2. 文件锁 / 任务锁

| 锁定对象 | 任务 ID | Agent | 状态 | 开始时间 | 预计释放 | 备注 |
|---|---|---|---|---|---|---|
| 无 | - | - | released | - | - | 当前无锁 |

## 3. 任务进度表

| ID | 状态 | 当前 Agent | 阶段 | 依赖 | 产物 / 文件 | 最近更新 | 备注 |
|---|---|---|---|---|---|---|---|
| ORCH-01 | done | Codex / Product Architect | P0 | 无 | `docs/ai-engineering-leader-enhancement-tasks.md`, `docs/ai-engineering-leader-enhancement-progress.md` | 2026-06-24 | 初版完成 |
| PO-01 | done | Codex / Product Architect | P0 | ORCH-01 | 本文件 §4、§8 | 2026-06-24 | PRD 5 个开放问题已关闭 |
| SPEC-01 | done | Codex / Product Architect | P0 | PO-01 | `docs/ai-engineering-leader-enhancement-p0-specs.md` §1 | 2026-06-24 | `decisionGuide` 内容标准完成 |
| SPEC-02 | done | Codex / Product Architect | P0 | PO-01 | `docs/ai-engineering-leader-enhancement-p0-specs.md` §2 | 2026-06-24 | 7 个能力域、计分、角色路径标准完成 |
| SPEC-03 | done | Codex / Product Architect | P0 | PO-01 | `docs/ai-engineering-leader-enhancement-p0-specs.md` §3 | 2026-06-24 | `model-router` 独立场景规格完成 |
| SCHEMA-01 | done | Codex / Implementation | P1 | SPEC-01 | `docs/content-schema.md`, `src/types/index.ts`, `scripts/validate-content.ts` | 2026-06-24 | `decisionGuide` schema/type/validator 已实现 |
| SCHEMA-02 | done | Codex / Implementation | P1 | SPEC-02 | `docs/content-schema.md`, `src/types/index.ts`, `scripts/validate-content.ts`, `src/data/rolePaths.ts` | 2026-06-24 | `capabilityDomains`、Glossary 可选能力域、角色路径 schema/type/validator 已实现 |
| SCHEMA-03 | todo | - | P2 | SPEC-03 | 场景演练 schema/type/validator | - | Phase 2 执行 |
| DATA-01 | done | Codex / Content & Validation | P1 | SPEC-01 | `content/drafts/decision-guide-phase1a-first-12.md` | 2026-06-24 | A 批 6 讲草稿完成并已审核通过 |
| DATA-02 | done | Codex / Content & Validation | P1 | SPEC-01 | `content/drafts/decision-guide-phase1a-first-12.md` | 2026-06-24 | B 批 5 讲草稿完成并已审核通过 |
| DATA-03 | review | Codex / Content & Validation | P1 | SPEC-01 | `content/drafts/decision-guide-phase1a-first-12.md` | 2026-06-24 | Phase 1A 只覆盖首批第 12 讲 `agent-loop`；C 批剩余 5 讲未在本轮范围内，不标 done |
| REVIEW-01 | done | Codex / Product Architect | P1 | DATA-01 | `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` | 2026-06-24 | A 批 6 讲 pass |
| REVIEW-02 | done | Codex / Product Architect | P1 | DATA-02 | `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` | 2026-06-24 | B 批 5 讲 pass |
| REVIEW-03 | review | Codex / Product Architect | P1 | DATA-03 | `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` | 2026-06-24 | Phase 1A `agent-loop` pass；`multi-agent`、`eval`、`observability`、`trace`、`permission-governance` 后续再审 |
| DATA-04 | review | Codex / Content & Validation | P1 | SPEC-02 | `content/drafts/capability-domain-mapping-56.md` | 2026-06-24 | 56 / 56 覆盖，空映射 0，非法枚举 0 |
| DATA-05 | review | Codex / Product Architect | P1 | SPEC-02 | `content/drafts/role-paths-phase1a.md` | 2026-06-24 | 4 条角色路径，每条 >= 8 个知识点 |
| DATA-06 | todo | - | P2 | SPEC-03 | `model-router` 模拟数据草稿 | - | Phase 2 范围 |
| DEV-01 | done | Codex / Implementation | P1 | SCHEMA-01, SCHEMA-02, REVIEW-01, REVIEW-02, REVIEW-03, DATA-04, DATA-05 | `src/data/concepts.ts`, `src/data/decisionGuides.ts`, `src/data/capabilityDomains.ts`, `src/data/rolePaths.ts` | 2026-06-24 | 12 条 reviewed decisionGuide 入库；56 / 56 能力域映射入库；4 条角色路径入库 |
| DEV-02 | todo | - | P1 | DEV-01 | 决策章节 UI | - | Concept detail，可启动 |
| DEV-03 | todo | - | P1 | DEV-01, DATA-05 | Profile 能力域概览 | - | Profile，可启动 |
| DEV-04 | todo | - | P1 | DEV-01 | 搜索能力域过滤 | - | Search，可启动 |
| QA-01 | todo | - | P1 | DEV-02, DEV-03, DEV-04 | Phase 1 QA report | - | 等 DEV-02/03/04 |
| QA-02 | todo | - | P2 | DEV-08 | Phase 2 QA report | - | 场景验收 |
| QA-03 | todo | - | P3 | DEV-09, DEV-10, DEV-11 | Phase 3 QA report | - | 驾驶舱验收 |
| REL-01 | todo | - | P-final | QA-01 / QA-02 / QA-03 | reports/docs refresh | - | 封板交接 |

## 4. 决策记录

| 日期 | 决策 ID | 结论 | 理由 | 影响任务 |
|---|---|---|---|---|
| 2026-06-24 | D-000 | 采用 tasks/progress 双文档协作机制 | tasks 保持稳定，progress 供多 Agent 高频更新 | ORCH-01 |
| 2026-06-24 | D-001 | Agent Team 收敛为 3 个角色：Product Architect、Implementation、Content & Validation | 降低调度成本，同时保留职责边界 | 全部任务 |
| 2026-06-24 | D-002 | 新增三条 Codex loop 的模型建议与启动提示词 | 后续可直接复制提示词启动三个 loop | 全部任务 |
| 2026-06-24 | D-003 | Phase 1 决策手册首批按 17 个候选知识点启动草稿，MVP 入库门槛为至少 12 个高质量通过项 | 17 个候选均贴近负责人高频决策；12 个入库门槛保留审核质量余量 | SPEC-01, DATA-01/02/03, REVIEW-01/02/03, DEV-01 |
| 2026-06-24 | D-004 | `model-router` 作为独立 `scenarioExercise` 数据类型设计 | 场景演练需要请求队列、策略、模型池、指标、事件、诊断和复盘结构 | SPEC-03, SCHEMA-03, DATA-06, DEV-05/07/08 |
| 2026-06-24 | D-005 | 能力域得分 Phase 1 同时计入完成度与诊断题表现，默认权重为完成度 70% / 诊断表现 30% | 驾驶舱需要反映判断质量；冷启动按完成度估算 | SPEC-02, SCHEMA-02, DEV-03, DEV-09 |
| 2026-06-24 | D-006 | Profile Markdown 导出不进入 Phase 1 / Phase 2 默认范围 | 当前优先验证决策内容和复盘入口 | SPEC-01, DEV-02, DEV-09, DEV-10 |
| 2026-06-24 | D-007 | 角色路径 Phase 1 固定为 4 条本地模板，不支持用户自定义 | 避免误扩成团队管理产品 | SPEC-02, DATA-05, DEV-03 |
| 2026-06-24 | D-008 | P0 三项 SPEC 合并沉淀到 `docs/ai-engineering-leader-enhancement-p0-specs.md` | 集中规格减少漏读 | SPEC-01/02/03, SCHEMA-01/02/03, DATA-01/02/03/04/05/06 |
| 2026-06-24 | D-009 | `decisionGuide`、能力域、角色路径、`scenarioExercise` 均先作为 schema 设计输入，不在 P0 直接写入 `src/*` | 避免越权和未审核内容入库 | SCHEMA-01/02/03, DEV-01, DEV-05 |
| 2026-06-24 | D-010 | Phase 1A 输入包只要求首批 12 个最高优先级 `decisionGuide` 通过审核 | 与 SPEC-01 的“前 12 个优先级最高”一致；C 批其余 5 个候选保留后续扩展，不阻塞 SCHEMA-01/02 和 DEV-01 的 MVP 输入 | DATA-03, REVIEW-03, DEV-01 |

## 5. 阻塞项

| 阻塞 ID | 状态 | 关联任务 | 描述 | 负责人 | 下一步 |
|---|---|---|---|---|---|
| - | - | - | Phase 1 schema 与数据入库无阻塞。SCHEMA-01、SCHEMA-02、DEV-01 已完成并通过 validate/typecheck/lint/build。 | - | 后续可启动 DEV-02、DEV-03、DEV-04；C 批剩余 5 个 decisionGuide 候选仍需另走 DATA-03 / REVIEW-03 后再入库。 |

## 6. 验证记录

| 日期 | 任务 | 命令 / 检查 | 结果 | 备注 |
|---|---|---|---|---|
| 2026-06-24 | ORCH-01 | 文档创建检查 | pass | 纯文档变更，未运行构建 |
| 2026-06-24 | PO-01 | 读取 `AGENTS.md`、PRD、tasks、progress；关闭 5 个开放问题 | pass | 纯文档决策更新，未运行构建 |
| 2026-06-24 | SPEC-01/02/03 | 读取 `AGENTS.md`、PRD、tasks、progress、`docs/content-schema.md`；新增 P0 specs；未修改 `src/*` | pass | 纯文档规格变更，未运行构建 |
| 2026-06-24 | DATA-01/02/03 | 读取 `AGENTS.md`、PRD、tasks、progress、P0 specs、56 讲清单；新增 `content/drafts/decision-guide-phase1a-first-12.md` | pass | 覆盖 Phase 1A 首批 12 讲；未修改 `src/data/*` / `src/types/*` |
| 2026-06-24 | REVIEW-01/02/03 | 按 SPEC-01 审核 12 讲草稿；新增 `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` | pass | 12 / 12 pass；退回项 0；C 批剩余 5 讲未在 Phase 1A 范围内 |
| 2026-06-24 | DATA-04 | 新增 `content/drafts/capability-domain-mapping-56.md`；人工核对 56 讲登记表与 SPEC-02 枚举 | pass | 56 / 56 覆盖；空映射 0；非法枚举 0 |
| 2026-06-24 | DATA-05 | 新增 `content/drafts/role-paths-phase1a.md`；人工核对每条路径知识点数 | pass | 4 条路径；每条 >= 8 个知识点 |

| 2026-06-24 | SCHEMA-01/02, DEV-01 | `cmd /c npm run validate:content`; `cmd /c npm run typecheck`; `cmd /c npm run lint`; `cmd /c npm run build` | pass | 新增 `decisionGuide`、`capabilityDomains`、`rolePaths` 类型/校验与数据入库；未实现 UI |

## 7. 产物索引

| 类型 | 路径 | 说明 |
|---|---|---|
| PRD | `docs/ai-engineering-leader-enhancement-prd.md` | 增强方向与产品规格 |
| Task list | `docs/ai-engineering-leader-enhancement-tasks.md` | 稳定任务拆解 |
| Progress | `docs/ai-engineering-leader-enhancement-progress.md` | 多 Agent 共享进度 |
| Loop prompts | `docs/ai-engineering-leader-enhancement-loop-prompts.md` | 三个 Codex loop 的模型建议与启动提示词 |
| P0 specs | `docs/ai-engineering-leader-enhancement-p0-specs.md` | SPEC-01 / SPEC-02 / SPEC-03 |
| Phase 1A decisionGuide draft | `content/drafts/decision-guide-phase1a-first-12.md` | 首批 12 讲决策手册草稿 |
| Phase 1A decisionGuide review | `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` | 首批 12 讲审核结论，12 / 12 pass |
| Capability mapping draft | `content/drafts/capability-domain-mapping-56.md` | 56 讲能力域映射草案 |
| Role paths draft | `content/drafts/role-paths-phase1a.md` | 4 条角色学习路径模板 |

| Phase 1 schema/types | `src/types/index.ts`, `docs/content-schema.md` | `decisionGuide`、`capabilityDomains`、`RolePath` schema/type |
| Phase 1 validators | `scripts/validate-content.ts` | 校验能力域、决策手册、角色路径结构 |
| Phase 1 data | `src/data/decisionGuides.ts`, `src/data/capabilityDomains.ts`, `src/data/rolePaths.ts` | reviewed 决策手册、56 讲能力域、4 条角色路径正式数据源 |
| Phase 1 data merge | `src/data/concepts.ts` | 最终导出的 56 讲合并能力域与 12 条 decisionGuide |

## 8. 下一步建议

SCHEMA-01、SCHEMA-02、DEV-01 已完成。建议后续顺序：

1. 启动 `DEV-02`：知识点详情页展示“工程决策”章节，并支持复制评审问题 / 落地清单。
2. 启动 `DEV-03`：Profile 能力域概览与角色路径完成度。
3. 启动 `DEV-04`：搜索能力域过滤，并让搜索可命中 decisionGuide 文本。
4. 如要补齐 17 个候选，需先追加 DATA-03 / REVIEW-03 的剩余 5 讲，再由 Implementation 入库。
