# 技术架构 · architecture

> 纯前端、内容数据驱动的 Web/PWA。技术栈与目录见 [AGENTS.md](../AGENTS.md)。数据 schema 见 [content-schema.md](content-schema.md)。

## 1. 分层架构

四层单向依赖，上层依赖下层，禁止反向依赖：

```text
样式层 styles/        ← tokens.css / global.css（仅被组件消费）
  ↑
页面与组件层 pages,components/
  ↑
状态层 store/         ← Zustand progressStore（唯一全局状态）
  ↑
数据层 data/          ← modules.ts / concepts.ts / glossary.ts（静态内容）
```

- 数据层：纯静态内容，符合 `src/types/index.ts` 的类型，无副作用。
- 状态层：只管“用户进度类”可变状态（完成、收藏、错题、最近访问、连续天数），并负责 LocalStorage 持久化。
- 页面/组件层：从数据层读内容、从状态层读/写进度，纯展示与交互。
- 样式层：设计变量集中，组件通过 CSS 变量/Module 消费。

### 数据流图

```mermaid
flowchart TD
  data["data/ 静态内容\nmodules · concepts · glossary"] --> pages["pages/ 路由页面"]
  store["store/progressStore\n(Zustand)"] --> pages
  store <-->|读写| ls["LocalStorage\nai-learning-app-progress-v1"]
  pages --> comps["components/ 展示与交互"]
  comps -->|"标记完成/收藏/答题"| store
  tokens["styles/tokens.css"] --> comps
  utils["utils/ search · progress"] --> pages
  utils --> comps
```

## 2. 组件清单与职责

| 分组 | 组件 | 职责 |
|---|---|---|
| layout | `AppShell` | 整体布局：桌面左侧栏 + 顶部条 + 主区；移动端底部导航 |
| layout | `Header` | breadcrumb、搜索入口、连续学习天数 |
| layout | `Sidebar` | 产品名、一级导航、六大模块列表、底部总进度 |
| layout | `BottomNav` | 移动端底部导航 |
| concept | `ConceptCard` | 模块页知识点卡片（标题/定义/难度/时长/动画/完成/收藏） |
| concept | `ConceptHeader` | 详情页标题区与元信息 |
| concept | `ConceptSection` | 详情页通用章节容器（为什么重要/机制/案例/误区/结论） |
| concept | `TakeawayBox` | 核心结论高亮块 |
| concept | `RelatedConcepts` | 关联知识点跳转 |
| animation | `AnimationPlayer` + 各动画 | 统一播放器与机制动画，见 [animation-spec.md](animation-spec.md) |
| quiz | `DiagnosticQuestion` / `OptionCard` / `ExplanationPanel` | 诊断题渲染、选项、解析与排查路径 |
| progress | `ProgressBar` / `ModuleProgress` / `StudyStats` | 进度条、模块进度、学习统计 |
| search | `SearchBox` / `SearchResults` | 搜索输入与结果列表 |

## 3. 状态管理与持久化

`store/progressStore.ts`（Zustand）管理 `UserProgress`：

```ts
interface UserProgress {
  completedConceptIds: string[];
  favoriteConceptIds: string[];
  wrongQuestionIds: string[];
  lastVisitedConceptId?: string;
  lastStudyDate?: string;
  studyStreakDays: number;
}
```

- 动作：标记/取消完成、收藏/取消收藏、记录错题、记录最近访问、计算模块完成度、清空记录。
- 持久化：key 固定 `ai-learning-app-progress-v1`，写入结构带 `version` 字段：`{ version: 1, progress }`。
- 要求：页面刷新进度不丢失；解析失败时回退到默认空进度（容错）；提供清空学习记录。
- 派生值（完成度百分比、模块 done/total、连续天数展示）在 selector/工具中计算，不冗余存储。

## 4. 本地搜索

`utils/search.ts` 在前端对 `concepts` 做本地检索。

- 搜索字段：title、definition、tags、mechanism、enterpriseCase、pitfalls。
- 排序规则：标题完全匹配 > 标题包含关键词 > 标签匹配 > 正文匹配。
- 结果类型：知识点（首版）；术语、诊断题为后续扩展项。
- 实时搜索、空查询提示、空结果提示；结果上限（如 12 条）避免长列表。

## 5. 响应式策略

- 桌面端：固定左侧栏约 256px + 顶部工具条（约 56px，半透明 + blur）+ 主阅读画布。首页主区最大宽约 1120px，详情页正文 760–860px，左右留白约 40px。
- 移动端（后续适配，保留同样阅读节奏）：左侧导航收为抽屉或底部导航；主内容单列；首页只保留继续学习、进度、推荐路径核心入口；详情页优先阅读舒适，不堆侧边信息；无横向滚动。

## 6. 可拆分开发阶段

对齐 PRD 里程碑，拆为 7 个阶段，每阶段结束项目必须可运行。依赖为线性顺序（P0→P6），P3 与 P4 可在 P2 完成后并行。

| 阶段 | 名称 | 产出 | 验收 |
|---|---|---|---|
| P0 | 项目初始化 | Vite+React+TS 骨架、路由、全局样式、目录结构、mock 数据 | `npm install` / `npm run dev` 成功，首页可访问，路由可跳转 |
| P1 | 首页 + 模块页 | 首页、模块卡片、模块详情页、知识点卡片、接入基础数据 | 看到 6 模块、能进模块页、看到知识点列表、卡片状态正确 |
| P2 | 知识点详情页 | 详情页渲染定义/机制/案例/误区/结论、关联知识点、完成/收藏按钮 | 任意知识点可打开、结构完整、完成与收藏状态可保存 |
| P3 | 动画组件 | AnimationPlayer + 首版动画组件（见 animation-spec） | 可播放/暂停/切步/重置，步骤说明同步，移动端可用 |
| P4 | 诊断题 | DiagnosticQuestion 单选/多选、提交、解析、错题记录 | 答题流程顺畅、判定准确、解析清晰、错题可记录 |
| P5 | 搜索/术语/我的学习 | 本地搜索、术语索引、Profile 进度统计、最近学习、清空记录 | 搜索可用、术语可浏览、进度与最近学习准确、清空可用 |
| P6 | 打磨与发布 | 响应式适配、视觉统一、内容补齐、构建检查、README、部署配置 | 桌面/移动端体验稳定、构建成功、可静态部署 |

### 阶段依赖图

```mermaid
flowchart LR
  P0 --> P1 --> P2
  P2 --> P3
  P2 --> P4
  P3 --> P5
  P4 --> P5
  P5 --> P6
```

## 7. 工程约束

- 数据与组件分离；动画步骤、诊断题配置化；状态集中。
- TypeScript 无类型错误；ESLint 无严重错误；构建成功；路由刷新不报错。
- 不引入重型 UI 框架与未使用的大型依赖。
