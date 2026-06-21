# MVP 0.1 修复回合 1 · 主开发修复报告

## 1. 结论

本轮工程体验类 P0 与最高优先级 P1 已完成。实现策略遵守 Owner 决策：保留 56 讲完整课程地图，但首页继续学习、详情页下一讲、首页推荐入口、搜索结果主路径只进入已上线内容（`contentStatus !== 'stub'`）。

未修改 schema，未新增 44 讲，未改 `demoConcepts.ts`，未改动画协议、registry 或 `AnimationPlayer` 架构。

## 2. 修改文件

- `src/utils/progress.ts`
- `src/utils/search.ts`
- `src/pages/ConceptPage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/HomePage.module.css`
- `src/pages/ModulePage.tsx`
- `src/pages/ModulePage.module.css`
- `src/pages/SearchPage.tsx`
- `src/pages/SearchPage.module.css`
- `src/components/concept/ConceptHeader.tsx`
- `src/components/animation/GenericMechanismAnimation.tsx`
- `src/components/animation/GenericMechanismAnimation.module.css`
- `src/data/concepts.ts`
- `reports/mvp-0.1-dev-fix-round1.md`

## 3. 任务实现说明

### 3.1 主路径禁跳 stub

- 在 `src/utils/progress.ts` 新增统一判断 `isPublishedConcept()`，并维护按模块顺序铺平的已上线知识点列表。
- `getContinueLearningConceptId()` 现在只接受已上线的 `lastVisitedConceptId`；如果历史记录指向未上线知识点，会跳过它，转向第一个未完成的已上线知识点；已上线内容全部完成时回到第一个已上线知识点。
- `src/pages/ConceptPage.tsx` 的“下一个”改为从已上线顺序里取下一讲，跳过 44 个未上线知识点；直接访问未上线详情时不会写入 `lastVisitedConceptId`。
- `src/pages/HomePage.tsx` 的推荐路径改为指向对应模块中第一个已上线知识点；没有已上线内容的路径显示“即将上线”，不提供跳转入口。

### 3.2 模块页与搜索页保留 56 讲地图

- `src/pages/ModulePage.tsx` 仍显示模块内全部知识点；已上线知识点继续使用原 `ConceptCard`，未上线知识点改为不可点击的低对比占位卡，并标记“即将上线”。
- `src/utils/search.ts` 保留未上线知识点的标题命中能力，但对未上线结果降权并在原因中标记“即将上线”。
- `src/pages/SearchPage.tsx` 改为页面内渲染搜索结果：已上线结果可点击进入详情，未上线结果不可点击，仅作为 56 讲地图占位展示。

### 3.3 移除内部标识泄漏

- `src/components/concept/ConceptHeader.tsx` 移除了详情页头部的内容成熟度标签，用户不再看到 `mvp` / `stub` 这类内部状态。
- `src/components/animation/GenericMechanismAnimation.tsx` 不再展示 `config.type`，不再把 `highlightTargets` raw key 渲染成文本标签。
- 通用动画画布内不再重复展示当前步骤标题和描述，只保留步骤进度；标题和描述由 `AnimationPlayer` caption 统一展示。

### 3.4 清理 kv-cache 重复死数据

- `src/data/concepts.ts` 中内联的旧 `kv-cache` 长对象已改回 `stub(...)` 登记。
- 正式正文仍由 `src/data/demoConcepts.ts` 的 `mvp` 版本通过 `demoById.get(id) ?? concept` 合并生效，`kv-cache` 不再有两份正文来源。

## 4. 命令验证结果

### `npm run validate:content`

结果：通过。

关键输出：

```text
validate:content — 子命令：all
  [published-content] 已校验 demo/mvp 内容 12 个。
  [animation] 已校验动画一致性、注册类型与步骤合法性。

通过：内容结构校验（56 登记 / 模块计数 10/10/8/16/6/6 / 唯一性 / 关联无悬空 / contentStatus / 诊断题结构）。
```

### `npm run typecheck`

结果：通过。

关键输出：

```text
> ai-learning-app@0.0.0 typecheck
> tsc -b
```

备注：首次运行时发现 `isPublishedConcept()` 类型谓词导致 false 分支被推断为 `never`；已改为普通布尔判断并复跑通过。

### `npm run lint`

结果：通过。

关键输出：

```text
> ai-learning-app@0.0.0 lint
> eslint .
```

### `npm run build`

结果：通过。

关键输出：

```text
> ai-learning-app@0.0.0 build
> tsc -b && vite build

vite v8.0.16 building client environment for production...
✓ 88 modules transformed.
dist/index.html                   1.05 kB │ gzip:   0.63 kB
dist/assets/index-DftVFJt9.css   29.73 kB │ gzip:   5.78 kB
dist/assets/index-C1rngkWV.js   401.74 kB │ gzip: 128.63 kB

✓ built in 512ms
```

## 5. 遗留项

- 本轮未处理内容类 P0（诊断题答案分布、强干扰项、内容样板去模板化），这些应继续走内容 Agent 的 draft → review → 主开发合入流程。
- 本轮未重做 `prefill-decode` 与 `agent-loop` 专用画布；主开发只收口了通用动画的 raw key 泄漏与说明重复问题，未改动画协议。
- 未改 `src/components/search/SearchResults.tsx`，搜索页已在允许范围内改为页面内渲染，以避免扩大修改范围。

## 6. 停止点

未触发停止点。本轮不需要修改 schema、课程正文、动画协议，也没有发现“主路径禁跳 stub”与“保留 56 讲地图”的不可兼容冲突。
