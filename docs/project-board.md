# 执行看板 · project-board

> 多 Agent 协作的**单一事实来源**。任何 Agent 开工前先读此看板与 [AGENTS.md](../AGENTS.md) §5.1 文件所有权。
> 状态枚举：`todo` / `in-progress` / `review` / `done` / `blocked`。每次推进任务须更新本表与“最后更新时间”。

**最后更新时间**：2026-06-21 · 维护人：主开发 Agent

## 1. 当前里程碑

- 当前阶段：**MVP 0.1 已封版：12 讲端到端验证通过，可作为演示版本**。
- 已完成范围：工程骨架、内容门禁、首页、模块页、知识点详情页、动画播放器、诊断题、搜索、术语索引、我的学习页，以及 12 讲正式内容入库。
- 封版验证：`npm run typecheck`、`npm run validate:structure`、`npm run build` 通过；完整回归见 [reports/e2e-verification-12-lessons.md](../reports/e2e-verification-12-lessons.md)。
- 后续推进仍需遵守内容流水线：`content/drafts/` → 审核复核 → 主开发合入 `src/data/*` → `npm run validate:content`。

## 2. 阶段任务板

| 阶段 | 任务 | Owner | 状态 | 依赖 | 验收命令 / 标准 | 阻塞项 |
|---|---|---|---|---|---|---|
| P0 | Vite+React+TS 骨架、路由、目录、tokens、mock 数据 | 主开发 | done | — | `npm install` `npm run dev` 首页可访问、路由可跳转 | — |
| P1 | 首页 + 模块页 + 知识点卡片 + 接入基础数据 | 主开发 | done | P0 | 看到 6 模块、进模块页、卡片状态正确 | — |
| P1.5 | 内容入库门禁：`scripts/validate-content.ts` + `validate:structure` | 主开发 | done | P1 | `validate:structure` 全绿（规则见 [content-schema.md](content-schema.md) §6.1） | — |
| P2 | 知识点详情页（定义/机制/案例/误区/结论 + 关联 + 完成/收藏） | 主开发 | done | P1 | 12 讲详情页可打开、结构完整、进度可保存 | — |
| P3 | AnimationPlayer + 首版动画组件（8 个）；启用 `validate:animation` | 主开发(框架) / 动画 Agent(草稿) | done | P2 | 可播放/暂停/切步/重置，步骤同步，移动端可用 | — |
| P4 | 诊断题组件（单选/多选/解析/错题） | 主开发 | done | P2 | 答题流程顺畅、判定准确、错题可记录 | — |
| P5 | 搜索 / 术语 / 我的学习 | 主开发 | done | P3,P4 | 搜索可用、术语可浏览、进度准确、清空可用 | — |
| P6 | 响应式、视觉统一、内容补齐、构建检查、README、部署 | 主开发 | in-progress | P5 | 桌面/移动端稳定、构建成功、可静态部署 | Google Fonts 受限网络 console 报错（非阻塞） |
| 内容 | 12 讲 MVP 0.1 正式内容入库 | 内容 Agent → 审核 Agent → 主开发合入 | done | P1.5,P2 | `validate:content` 校验 12 个 demo/mvp 内容 + E2E 通过 | — |

> 阶段依赖图见 [architecture.md](architecture.md) §6。**P1.5 只阻塞内容入库，不阻塞页面开发**（P2 只依赖 P1）；P3 与 P4 可在 P2 完成后并行；`validate:animation` 到 P3 才启用。

## 3. 内容生产流水线（draft → review → 入库）

权威字段只能落入 `src/data/*`，但内容**不得**由内容 Agent 直接写入 `src/data/*`。统一走三段式：

```text
content/drafts/<concept-id>.md      ← 内容 Agent 按 56 讲写作模板产出（写作字段：oneSentence 等）
        │  (内容 Agent 自评通过后置 review)
        ▼
content/reviewed/<concept-id>.md    ← 审核 Agent 审核：结构完整性、口径、诊断题质量、关联正确性
        │  (审核通过)
        ▼
src/data/concepts.ts                ← 主开发按 content-schema §3 映射表转换并合入（写作字段 → 权威字段）
```

### 流水线规则

- 内容 Agent：**只能写 `content/drafts/`**，不得改 `src/data/*`、`src/types/*`、`docs/content-schema.md`。
- 审核 Agent：在 `content/reviewed/` 标注通过/退回，不直接改 `src/data/*`。
- 主开发：唯一有权把 reviewed 内容按映射转换入 `src/data/*` 的角色；入库前必须跑 `npm run validate:content`。
- 入库门禁：未通过审核或未通过 `validate:content` 的内容**不得**进入 `src/data/*`，避免半成品与写作字段混入权威 schema。
- 目录约定：`content/drafts/`、`content/reviewed/` 为内容生命周期目录，不参与构建，不被应用直接 import。

## 4. 阻塞项登记

| 编号 | 描述 | 影响阶段 | 状态 | 负责人 |
|---|---|---|---|---|
| P1-01 | Google Fonts 在受限网络下 console 报 `ERR_NETWORK_ACCESS_DENIED` | 演示观感 | open（非阻塞） | 主开发 |

## 5. 高风险文件（修改需遵守所有权，见 AGENTS.md §5.1）

- `src/types/index.ts`、`src/data/concepts.ts`、`src/styles/tokens.css`
- `src/components/animation/AnimationPlayer` 与动画 registry
- `docs/content-schema.md`、本看板 `docs/project-board.md`
