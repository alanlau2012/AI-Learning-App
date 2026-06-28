# 执行看板 · project-board

> 多 Agent 协作的**单一事实来源**。任何 Agent 开工前先读此看板与 [AGENTS.md](../AGENTS.md) §0 / §5.1。
> 状态枚举：`todo` / `in-progress` / `review` / `done` / `blocked`。每次推进任务须更新本表与“最后更新时间”。

**最后更新时间**：2026-06-28 · 维护人：主开发 Agent（Scenario Library R2 封板）

## 1. 当前里程碑

- **当前阶段**：**Scenario Library R2 已封板 / Web 可发布、桌面可内部试用分发**。56 讲全部 `contentRevision: v2`；已完成 17 条决策手册、56 讲能力域映射、4 条角色路径、ConceptPage 工程决策章节、Profile 能力概览/本周建议/场景复盘、Search/Glossary 能力域联动，以及场景演练库 R0+R1+R2。
- **当前上线内容**：**56 / 56 讲**；剩余 `stub`：**0**。地图无 stub。
- **模块上线进度**：M1 `10/10`，M2 `10/10`，M3 `8/8`，M4 `16/16`，M5 `6/6`，M6 `6/6`（全部满额）。
- **验证**：最新 Scenario Library R2 验证以 `reports/scenario-library-r2-summary-20260628.md`、`reports/scenario-library-r2-browser-qa-20260628.md`、`reports/scenario-library-r2-ux-qa-20260628.md`、`reports/scenario-library-r2-performance-20260628.md`、`reports/scenario-library-r2-release-gate-20260628.md` 为准；生产化验证以 `reports/release-readiness-20260628.md`、`reports/browser-regression-20260628.md`、`reports/security-readiness-20260628.md`、`reports/performance-budget-20260628.md`、`reports/desktop-release-20260628.md` 为准；历史 Phase 1/2/3 与场景库报告见 `reports/phase1-qa-report.md`、`reports/phase2-phase3-qa-summary.md`、`reports/scenario-library-r1-summary.md`。
- **下一轮建议（均需 Owner 确认）**：场景演练 R3（`multi-agent-stuck`、目录排序/搜索、更多入口露出完成状态）、完整 PWA 离线能力、桌面版图标/代码签名/自动更新、内容 P2/P3。
- 后续内容（如样板回改）仍走流水线：`content/drafts/` → 审核复核 → 主开发合入 `src/data/*` → `npm run validate:content`。

## 2. 阶段任务板

| 阶段 | 任务 | Owner | 状态 | 验收命令 / 标准 | 备注 |
|---|---|---|---|---|---|
| P0-P6 | MVP 0.1 应用骨架、页面、状态、动画、诊断题、搜索、术语、我的学习 | 主开发 | done | `typecheck` / `validate:content` / `lint` / `build` / E2E | 12 讲样板封板，见 `reports/mvp-0.1-fix-round1-owner-acceptance.md` |
| Content Waves | Wave 1 / 2 / 3 / 4 / Final Wave 全量 56 讲入库 | 主开发 | done | 四命令全绿 + E2E/抽查 | 见 `reports/final-wave-summary.md` |
| Backlog Polish | PWA manifest、字体外链移除、路由切包、M6 治理动画 | 主开发 | done | 四命令全绿 + 浏览器抽查 | 见 `reports/backlog-polish-summary.md` |
| Desktop MVP | Electron Windows 离线桌面壳、hash 路由、相对资源、安装包/portable 打包 | 主开发 | done | `build:desktop` + `smoke:desktop` PASS | 见 `reports/desktop-electron-mvp-summary.md` |
| GitHub P1 Content Repair | issue #3/#4：Trace/Tool Calling 敏感数据边界、Session 亲和 cache locality 口径 | 内容 Agent → 审核 Agent → 主开发 | done | `validate:content` + `typecheck` PASS | 见 `reports/github-p1-content-repair-summary.md` |
| AI Leader P2-P3 | Phase 1B decisionGuide、model-router 场景演练、Profile/Glossary/Search 深化 | Product Architect -> Content & Validation -> Implementation | done | `validate:content` / `typecheck` / `lint` / `build` + browser smoke PASS | 见 `reports/phase2-phase3-qa-summary.md` |
| AI Leader P0-P1 | PO/SPEC、12 条 `decisionGuide`、56 讲能力域、4 条角色路径、Concept/Profile/Search | Product Architect → Content & Validation → Implementation | done | `validate:content` / `typecheck` / `lint` / `build` + Chromium 抽查 PASS | 见 `reports/phase1-qa-report.md` |
| Scenario Library R0+R1 | 通用场景 schema 最小扩展、`token-cost-spike` / `rag-answer-quality` 入库、Concept/Search 入口 | 主开发 Agent | done | `validate:content` / `typecheck` / `lint` / `build` + browser smoke PASS | 见 `reports/scenario-library-r1-summary.md` |
| Scenario Library R2 | `/scenarios` 目录页、五场景闭环、Profile 场景复盘、LocalStorage v2 迁移、`agent-tool-failure` / `trace-not-diagnostic` 入库 | 多 Agent 编队 → 主开发合入 | done | `validate:content` / `typecheck` / `lint` / `build` + browser regression PASS | 见 `reports/scenario-library-r2-summary-20260628.md` |
| 2026-06-28 Content P1 Repair | 关闭内容专业审核 6 个 P1：Session Affinity、RAG 权限边界、Trace/路由记录、租户缓存隔离、诊断题形态泄漏 | 内容生产子 Agent → 主审 Agent | done | `validate:content` / `typecheck` / `git diff --check` PASS | 见 `reports/content-p1-repair-review-20260628.md` |
| Production Readiness | 发布卫生、CSP、Electron 外链 allowlist、首包拆分、Web/桌面验证、release readiness 报告 | 主开发 Agent + 专项 Agent | done | 五项命令 + browser regression + desktop build/smoke PASS | 见 `reports/release-readiness-20260628.md` |

## 3. 内容生产流水线（draft → review → 入库）

权威字段只能落入 `src/data/*`，但内容**不得**由内容 Agent 直接写入 `src/data/*`。统一走三段式：

```text
content/drafts/<concept-id>.md      ← 内容 Agent 按 56 讲写作模板产出（写作字段：oneSentence 等）
        │  (内容 Agent 自评通过后置 review)
        ▼
content/reviewed/<concept-id>.md    ← 审核 Agent 审核：结构完整性、口径、诊断题质量、关联正确性
        │  (审核通过)
        ▼
src/data/concepts.ts 或 demoConcepts.ts ← 主开发按 content-schema §3 映射表转换并合入（写作字段 → 权威字段）
```

### 流水线规则

- 内容 Agent：**只能写 `content/drafts/`**，不得改 `src/data/*`、`src/types/*`、`docs/content-schema.md`。
- 审核 Agent：在 `content/reviewed/` 标注通过/退回，不直接改 `src/data/*`。
- 主开发：唯一有权把 reviewed 内容按映射转换入 `src/data/*` 的角色；入库前必须跑 `npm run validate:content`。
- 入库门禁：未通过审核或未通过 `validate:content` 的内容**不得**进入 `src/data/*`，避免半成品与写作字段混入权威 schema。
- 目录约定：`content/drafts/`、`content/reviewed/` 为内容生命周期目录，不参与构建，不被应用直接 import。

### 内容质量门禁（扩展 44 讲必须执行）

权威清单见 `docs/content-production-gate.md`；审核 Agent 在每讲 reviewed 结论中必须逐项给出判定，未通过不得进入 `src/data/*`：

1. **诊断题答案分布**：每批（约 12 题）单选正确答案必须覆盖 A/B/C/D，任一选项占比不超过 40%；多选不得只用于凑分布。
2. **强干扰项**：至少 30% 题目具备「看似合理但优先级不对」的强干扰项。
3. **解析**：必须说明为什么其他选项不是第一步或不是最佳判断；`troubleshootingPath` 按真实排查顺序写。
4. **结构去模板化**：机制 4-7 条、误区 3-6 条、结论 3-5 条按内容自然决定（仍须满足 content-schema §6.2 入库底线）；心智模型不固定「可以把 X 理解为……」句式。
5. **企业案例可复盘性**：每讲案例至少补 2 类信号（指标 / 规模 / 系统边界 / 错误路径 / 约束 / 验证结果），避免只写「某企业」。
6. **样板偏差检查**：审核须额外检查是否百科味、是否缺工程指标、是否答案位置失衡、是否干扰项太弱、是否固定句式、是否引入 schema 外字段。

## 4. 封板文档刷新要求

每次阶段/Wave/修复回合封板，主开发必须同步刷新：

- `AGENTS.md` 当前状态快照。
- 本看板的当前里程碑、任务板、阻塞项。
- `docs/expansion-plan-44-lessons.md` 的进度追踪表。
- `README.md` 当前状态。
- 对应 `reports/*summary.md` 与 E2E 报告引用。

封板提交前必须复核 `git log --oneline --decorate -5` 与 `git status --short --branch`，禁止留下“代码已完成但看板仍停在旧阶段”的状态。

## 5. 阻塞项登记

| 编号 | 描述 | 影响阶段 | 状态 | 负责人 |
|---|---|---|---|---|
| P1-01 | Google Fonts 在受限网络下 console 报 `ERR_NETWORK_ACCESS_DENIED` | 演示观感 | done | 主开发 |
| DSK-01 | Electron Builder 在中文工作区直接输出 `release/` 时 rename `win-unpacked.tmp` 触发 `EPERM` | 桌面打包 | done：使用临时 ASCII 输出目录后复制回 `release/` | 主开发 |
| REL-01 | 已跟踪 `output/electron-user-data/*`、Electron `.err` 等运行时产物 | 发布卫生 | done：本轮从 Git 移除并补 `.gitignore` | 主开发 |
| REL-02 | 生产发布前缺少当前 HEAD 的浏览器/桌面验证证据 | 发布门禁 | done：`browser-regression-20260628.md`、`desktop-release-20260628.md`、`release-readiness-20260628.md` 已补齐 | 主开发 + QA/桌面 Agent |

## 6. 高风险文件（修改需遵守所有权，见 AGENTS.md §5.1）

- `src/types/index.ts`、`src/data/concepts.ts`、`src/data/demoConcepts.ts`、`src/styles/tokens.css`
- `src/components/animation/AnimationPlayer` 与动画 registry
- `docs/content-schema.md`、本看板 `docs/project-board.md`
