# 执行看板 · project-board

> 多 Agent 协作的**单一事实来源**。任何 Agent 开工前先读此看板与 [AGENTS.md](../AGENTS.md) §0 / §5.1。
> 状态枚举：`todo` / `in-progress` / `review` / `done` / `blocked`。每次推进任务须更新本表与“最后更新时间”。

**最后更新时间**：2026-06-22 · 维护人：主开发 Agent（MVP 0.2 Wave 3 封板状态同步）

## 1. 当前里程碑

- **当前代码基线**：当前 `HEAD`（`feat(content): add mvp 0.2 wave 3 lessons`；具体 hash 以 `git log -1` 为准）。
- **当前阶段**：**MVP 0.2 Wave 3 已封板**。M1「模型怎么工作」、M2「模型怎么跑得又快又稳」、M3「模型怎么变成企业平台」均已完整上线。
- **当前上线内容**：32 / 56 讲；剩余 `stub`：24 讲。
- **模块上线进度**：M1 `10/10`，M2 `10/10`，M3 `8/8`，M4 `3/16`，M5 `1/6`，M6 `0/6`。
- **Wave 1 已完成**：7 讲，详见 `reports/mvp-0.2-wave1-summary.md`。
- **Wave 2 已完成**：7 讲，详见 `reports/mvp-0.2-wave2-summary.md`。
- **Wave 3 已完成**：6 讲，`maas` / `cost-routing` / `capability-routing` / `cache-system` / `rate-limit-circuit-break` / `sla`；详见 `reports/mvp-0.2-wave3-summary.md`。
- **Wave 3 验证**：`npm run validate:content`、`npm run typecheck`、`npm run lint`、`npm run build` 均 PASS；E2E 等价抽查 PASS，见 `reports/e2e-verification-mvp-0.2-wave3.md`。
- **下一轮建议**：单独启动 **M4 主体扩展**，优先冻结上下文与 Agent 基础链路范围。不要再把 M3 收尾当作待开发范围。
- 后续推进仍需遵守内容流水线：`content/drafts/` → 审核复核 → 主开发合入 `src/data/*` → `npm run validate:content`。

## 2. 阶段任务板

| 阶段 | 任务 | Owner | 状态 | 验收命令 / 标准 | 备注 |
|---|---|---|---|---|---|
| P0-P6 | MVP 0.1 应用骨架、页面、状态、动画、诊断题、搜索、术语、我的学习 | 主开发 | done | `typecheck` / `validate:content` / `lint` / `build` / E2E | 12 讲样板封板，见 `reports/mvp-0.1-fix-round1-owner-acceptance.md` |
| Animation Fix | `PrefillDecodeAnimation` 窄屏页面级横滚收敛至画布内 | 主开发 | done | 动画浏览器验收 + 后续 Wave 复用 | `561b6ad` |
| MVP 0.2 Wave 1 | M1 前 7 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E PASS | `09bfc13`，累计 19/56 |
| MVP 0.2 Wave 2 | M1 收口 + M2 收尾 7 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E PASS | `2fd0fb2`，累计 26/56 |
| MVP 0.2 Wave 3 | M3 收尾 6 讲入库 | 内容 Agent → 审核 Agent → 主开发 | done | 四命令全绿 + E2E 等价抽查 PASS | 当前 `HEAD`，累计 32/56 |
| Next Wave | M4 主体扩展范围冻结与首批内容 | 待启动 | todo | draft → review → merge → 四命令全绿 → E2E | 建议先冻结范围，不并行写 `src/data/*` |
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
