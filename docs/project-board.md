# 执行看板 · project-board

> 多 Agent 协作的**单一事实来源**。任何 Agent 开工前先读此看板与 [AGENTS.md](../AGENTS.md) §0 / §5.1。
> 状态枚举：`todo` / `in-progress` / `review` / `done` / `blocked`。每次推进任务须更新本表与“最后更新时间”。

**最后更新时间**：2026-06-23 · 维护人：主开发 Agent（冗余文件清理 + v2 封板）

## 1. 当前里程碑

- **当前阶段**：**正文改版 v2 已完成**。44 讲已发布内容全部 `contentRevision: v2`（机制分组、术语表、字段深度、编辑排版语言）。
- **当前上线内容**：44 / 56 讲；剩余 `stub`：12 讲。
- **模块上线进度**：M1 `10/10`，M2 `10/10`，M3 `8/8`，M4 `15/16`，M5 `1/6`，M6 `0/6`。
- **改版验证**：`validate:content`（含 terminology）、`typecheck`、`lint`、`build` 均 PASS；见 `reports/content-revision-platform-summary.md`。
- **仓库清理（2026-06-23）**：已合入草稿 → `content/archive/merged/`；历史报告 → `reports/archive/`；MVP 0.1 复盘 → `reviews/archive/`；原始 PDF/zip → `materials/archive/`；过期文档 → `docs/archive/`；删除 src 死代码、`tmp_claude_design_019ee7/`、根目录 dev log；`.cursor/` 脱库。Final Wave 新草稿仍写 `content/drafts/`。
- **下一轮建议**：Final Wave — `multi-agent` + M5 剩余 + M6 全量；新内容直接按 `content-schema.md` §7 入库。
- 后续推进仍需遵守内容流水线：`content/drafts/` → 审核复核 → 主开发合入 `src/data/*` → `npm run validate:content`。

## 2. 阶段任务板

| 阶段 | 任务 | Owner | 状态 | 验收命令 / 标准 | 备注 |
|---|---|---|---|---|---|
| P0-P6 | MVP 0.1 应用骨架、页面、状态、动画、诊断题、搜索、术语、我的学习 | 主开发 | done | `typecheck` / `validate:content` / `lint` / `build` / E2E | 12 讲样板封板，见 `reports/mvp-0.1-fix-round1-owner-acceptance.md` |
| Animation Fix | `PrefillDecodeAnimation` 窄屏页面级横滚收敛至画布内 | 主开发 | done | 动画浏览器验收 + 后续 Wave 复用 | `561b6ad` |
| MVP 0.2 Wave 1 | M1 前 7 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E PASS | `09bfc13`，累计 19/56 |
| MVP 0.2 Wave 2 | M1 收口 + M2 收尾 7 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E PASS | `2fd0fb2`，累计 26/56 |
| MVP 0.2 Wave 3 | M3 收尾 6 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E 等价抽查 PASS | `be4472e`，累计 32/56 |
| MVP 0.3 Wave 4A | M4 上下文工程与 Agent 基础链路 6 讲入库 | 主开发 | done | 四命令全绿 + E2E 等价抽查 PASS | 累计 38/56，M4 9/16 |
| MVP 0.3 Wave 4B | M4 剩余主体链路 6 讲入库 | 主开发 | done | 四命令全绿 + E2E 等价抽查 PASS | 累计 44/56，M4 15/16 |
| Content Revision v2 | 44 讲正文改版 + 全站编辑排版语言 | 主开发 | done | validate:content（含 terminology）+ 四命令全绿 | 见 `reports/content-revision-*.md` |
| Final Wave | multi-agent + M5 剩余 + M6 全量入库 | 待启动 | todo | draft → review → merge → 四命令全绿 → E2E | 入库直接按 content-schema §7 |
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
| P1-01 | Google Fonts 在受限网络下 console 报 `ERR_NETWORK_ACCESS_DENIED` | 演示观感 | open（非阻塞） | 主开发 |

## 6. 高风险文件（修改需遵守所有权，见 AGENTS.md §5.1）

- `src/types/index.ts`、`src/data/concepts.ts`、`src/data/demoConcepts.ts`、`src/styles/tokens.css`
- `src/components/animation/AnimationPlayer` 与动画 registry
- `docs/content-schema.md`、本看板 `docs/project-board.md`
