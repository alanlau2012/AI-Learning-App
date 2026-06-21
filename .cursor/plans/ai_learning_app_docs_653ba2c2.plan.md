---
name: AI Learning App Docs
overview: 基于 PRD、56 讲内容素材、design.md 三份资料，产出 6 份架构与规格文档（不写业务代码），锁定项目边界、稳定数据 schema、可拆分开发任务。
todos:
  - id: agents-md
    content: 编写仓库根 AGENTS.md：定位、技术栈、目录结构、硬边界、schema/视觉不可破约定、命令与 docs 索引
    status: completed
  - id: product-spec
    content: 编写 docs/product-spec.md：定位/范围/7 页面规格/56 讲信息架构/路由/优先级与内容门槛
    status: completed
  - id: architecture
    content: 编写 docs/architecture.md：分层与数据流图、组件清单、状态与持久化、搜索、响应式、可拆分开发阶段
    status: completed
  - id: content-schema
    content: 编写 docs/content-schema.md：权威 TS 接口、字段约束、模板映射表、6 模块+56 知识点登记表、完整样例
    status: completed
  - id: animation-spec
    content: 编写 docs/animation-spec.md：动画类型枚举、首版 8 组件映射、Player 契约、视觉约束、三个基准脚本
    status: completed
  - id: acceptance
    content: 编写 docs/acceptance-checklist.md：功能/内容/视觉/工程四类可勾选验收，视觉项按 design.md 并标注覆盖华为红
    status: completed
isProject: false
---

# AI 应用工程学习 APP — 架构与规格文档集

## 已锁定的三条权威决策（贯穿所有文档）

- 知识点清单以 **56 讲 PDF 详细清单**为准，模块构成 `10 / 10 / 8 / 16 / 6 / 6`（共 56）。覆盖 PRD/原型的 `10/10/8/12/6/10`。
- 内容数据字段以 **PRD 的 TypeScript 接口**命名为唯一标准（`definition / pitfalls / animation / relatedConceptIds` 等）。56 讲模板字段（`oneSentence / commonPitfalls / animationBrief / relatedConcepts`）作为"写作层"，在 content-schema 里给出映射。
- 视觉以 **design.md** 为唯一准绳（暖纸色 `#FAF9F6` + 蓝 `#1F40D8` + 绿，IBM Plex 字体）。**覆盖 PRD §12 与验收 §16.3 的"华为红"**，所有文档统一标注此覆盖。

## 权威知识点清单（56 讲，写入 product-spec 与 content-schema）

- M1 模型怎么工作(10)：Token, 词向量与语义空间, Transformer, 注意力机制, 位置编码, 自回归生成, 采样策略, 指令微调与偏好优化, 幻觉, 推理能力边界
- M2 模型怎么跑得又快又稳(10)：Prefill, Decode, TTFT, TPOT, KV Cache, Session 亲和, Batch 调度, P-D 分离, 投机解码, 量化
- M3 模型怎么变成企业平台(8)：MaaS, 模型网关, 多模型路由, 成本路由, 能力路由, 缓存体系, 限流熔断, SLA 保障
- M4 模型怎么变成 Agent(16)：Prompt 与 Context, 系统提示词, 上下文窗口, 上下文压缩, 上下文污染, 分层会话, AGENTS.md, 仓库上下文, 规格驱动开发, Agent Loop, 工具调用, Skill, Subagent, 记忆, Human-in-the-loop, 多 Agent 协作
- M5 Agent 怎么改变软件工程(6)：Code Review Agent, Issue Fix Agent, 需求拆解 Agent, 测试生成 Agent, 运维诊断 Agent, 价值复盘 Agent
- M6 企业怎么治理 AI(6)：Eval, Trace, Observability, Token ROI, 权限治理, AI 原生组织阵型

## 要交付的 6 份文档

### 1. `AGENTS.md`（仓库根）
写给后续开发 Agent 的仓库说明书与边界约定：
- 项目一句话定位、技术栈（React 18 + Vite + TS + Zustand + React Router + CSS Modules，纯前端、LocalStorage）。
- 目录结构（采用 PRD §9 推荐结构，`src/{app,pages,components,data,store,types,utils,styles}`）。
- 硬边界（首版不做）：无后端/登录/付费/真实大模型 API/原生端；内容全部数据驱动、动画全部配置驱动。
- 不可破坏的约定：数据 schema 在 `src/types/index.ts` 唯一定义；内容只进 `src/data/*`；视觉 token 只在 `styles/tokens.css`；视觉以 design.md 为准（禁华为红/深色大面积/渐变/阴影堆叠）。
- 启动/构建/校验命令占位（dev/build/typecheck/lint）。
- 指向 `docs/` 各规格文档的索引。

### 2. `docs/product-spec.md`
产品规格（PRD 提炼 + design.md 信息密度规则 + 56 讲清单）：
- 定位、目标用户、首版范围（必须做/不做）。
- 7 个页面规格：首页、模块列表页、知识点详情页、动画组件、诊断题组件、搜索、我的学习（+术语索引列为二期或首版可选，按 PRD 标注）。每页列出第一屏信息、核心动作、交互。
- 信息架构 = 上面 56 讲权威清单 + 4 条推荐学习路径。
- 路由表（PRD §10）。
- MVP 页面与视觉优先级、内容门槛（首版至少 12 讲精做、≥8 诊断题、≥4 类动画）。

### 3. `docs/architecture.md`
技术架构：
- 分层：数据层(`data/`)→ 状态层(Zustand `progressStore`)→ 页面/组件层 → 样式层。含一张 mermaid 数据流图。
- 组件清单与职责（AppShell/Header/Sidebar、ConceptCard/Section、AnimationPlayer + 各动画、DiagnosticQuestion、Progress、Search）。
- 状态管理与 LocalStorage 持久化（`STORAGE_KEY='ai-learning-app-progress-v1'`、`version` 字段、清空记录）。
- 本地搜索方案与排序规则（标题完全>标题包含>标签>正文）。
- 响应式策略（桌面左侧栏 256px + 主区 760–1120px；移动端抽屉/底部导航、单列）。
- 开发可拆分任务：对齐 PRD 里程碑，拆成 7 个阶段(P0 初始化 → P6 打磨)，每阶段列出产出与验收，标注依赖顺序。

### 4. `docs/content-schema.md`（数据 schema 稳定的核心）
- 权威 TypeScript 接口（逐字采用 PRD §8）：`KnowledgePoint / LearningModule / AnimationConfig / AnimationStep / EnterpriseCase / DiagnosticQuestion / DiagnosticOption / UserProgress`。
- 字段级约束（id/slug 命名规范、order、difficulty 枚举、tags、relatedConceptIds 必须指向已存在 id）。
- "56 讲写作模板字段 → 权威 schema 字段"映射表：`oneSentence→definition`、`commonPitfalls→pitfalls`、`relatedConcepts(标题)→relatedConceptIds(id)`、`animationBrief→animation:AnimationConfig`。
- 6 个 `LearningModule` 与 56 个 `KnowledgePoint` 的 id/slug/moduleId/order/difficulty/estimatedMinutes/hasAnimation 登记表（内容正文留待后续按模板填充）。
- 一个完整样例（Token 或 KV Cache）展示填满后的 JSON 形态。

### 5. `docs/animation-spec.md`
- 权威 `AnimationType` 枚举（采用 56 讲 17 值枚举，统一 kebab-case；标注与 PRD 8 值枚举的命名对应，如 `attention-map`↔PRD`attention`、`model-router`↔`model-routing`）。
- 首版 8 个动画组件：`token-flow, attention-map, context-window, prefill-decode, kv-cache, model-router, agent-loop, issue-fix-flow`，及其覆盖的知识点映射。
- AnimationPlayer 统一契约：步骤数据结构、播放/暂停/上一步/下一步/重置/步骤计数、每步只解释当前状态、由数据驱动注册。
- 视觉约束（来自 design.md）：深色机制画布面积克制、外层仍为浅色阅读页、控制区从简、不加监控面板。
- 给出 kv-cache / token-flow / agent-loop 三个已在原型验证的步骤脚本作为基准范例。

### 6. `docs/acceptance-checklist.md`
按 PRD §16 重构为可勾选清单，**视觉项以 design.md 为准并标注覆盖华为红**：
- 功能验收（6 模块可浏览、详情页、≥4 类动画、诊断题闭环、完成/收藏、刷新不丢、搜索、响应式）。
- 内容验收（≥12 完整讲、结构齐全、≥8 诊断题、≥6 动画配置）。
- 视觉验收（暖纸底 + 蓝/绿强调、无渐变、无大面积深色、边框优先于阴影、信息密度低噪音、移动端无横向滚动）。
- 工程验收（TS 无类型错误、lint、构建成功、路由刷新正常、数据与组件分离、状态集中、README）。
- 每条标注对应文档来源，便于回溯。

## 不做的事
- 不写任何业务代码 / 组件 / 数据内容正文。
- 不创建 `src/` 代码骨架（仅在文档中描述）。
- 不改动既有 `design.md` 与两份 PDF。