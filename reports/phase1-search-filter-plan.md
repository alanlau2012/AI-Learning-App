# Phase 1 Search 能力域过滤实现预案

> 日期：2026-06-24  
> 范围：仅做实现预案；本报告未修改 `src/*`。  
> 输入：`src/pages/SearchPage.tsx`、`src/components/search/SearchBox.tsx`、`src/utils/search.ts`、`docs/ai-engineering-leader-enhancement-p0-specs.md` §2 SPEC-02。  
> 目标：启动 `docs/ai-engineering-leader-enhancement-progress.md` 中 DEV-04：搜索能力域过滤，并让搜索可命中 `decisionGuide` 文本。

## 1. 当前实现基线

### 1.1 SearchPage

- `SearchPage` 当前只维护一个 `query` 状态。
- 结果由 `useMemo(() => searchConcepts(concepts, query), [query])` 计算。
- `Escape` 只清空 query。
- 未输入 query 时显示“输入关键词开始搜索。”，不会展示任何知识点。
- 有结果时，已发布知识点渲染为 `<Link>`，未发布知识点渲染为不可点击 `<article>`，继续保留“56 讲地图可见、stub 不进主路径”的既有约束。

### 1.2 SearchBox

- `SearchBox` 是一个受控 input，props 只有 `query` / `onQueryChange`。
- 没有能力域控件，也没有 filter 状态展示。

### 1.3 utils/search

当前 `searchConcepts(concepts, rawQuery, limit = 12)` 的规则：

- 空 query 返回 `[]`。
- 命中层级：标题完全匹配 `100` > 标题包含 `80` > 标签 `60` > 正文 `40`。
- 未发布内容 `availabilityScore = -35`，reason 加“即将上线”。
- 排序：`score desc`，同分按 `concept.order asc`。
- 正文范围包括 definition、mechanism、enterpriseCase、pitfalls、diagnosticQuestion scenario/question。
- 当前没有 `capabilityDomains` 过滤，也没有 `decisionGuide` 文本命中。

### 1.4 Phase 1 数据已就绪

- `src/data/capabilityDomains.ts` 已有 `capabilityDomainLabels` 与 56 讲 `capabilityDomainByConceptId`。
- `src/data/concepts.ts` 已将 `capabilityDomains` 与已审核 `decisionGuide` 合并到正式导出的 `concepts`。
- `src/types/index.ts` 已定义 `CapabilityDomain`、`CapabilityDomainMapping`、`DecisionGuide`。
- SPEC-02 固化 7 个能力域，并要求 Profile / Search / Glossary 共享同一枚举，不得各自维护中文字符串常量。

## 2. 产品行为设计

### 2.1 能力域过滤

Search 页新增一个能力域 segmented control，使用 `capabilityDomainLabels` 作为唯一中文标签来源：

- “全部”
- 模型机制理解
- 推理性能与成本
- MaaS 与平台化
- RAG 与上下文工程
- Agent 工程
- 评估与可观测
- 安全治理与组织落地

过滤规则：

- `selectedDomain = 'all'`：不按能力域过滤。
- 选择某能力域后，结果集只保留 `concept.capabilityDomains.primary === selectedDomain` 或 `concept.capabilityDomains.secondary === selectedDomain` 的知识点。
- 主域与次域都可命中，但 reason 应区分“主能力域匹配”和“次能力域匹配”。
- 不新增独立中文常量；UI 必须从 `capabilityDomainLabels` 渲染。

建议交互：

- query 为空、domain 为全部：保持轻量空态，提示输入关键词或选择能力域。
- query 为空、domain 已选择：展示该能力域下的知识点列表，按主域优先、次域其次、`order` 升序展示。这样能力域过滤可作为发现入口，而不是必须配合关键词。
- query 非空、domain 已选择：先按 domain 收窄，再按 query 命中排序。
- `Escape`：优先清空 query；若 query 已空且 domain 非全部，再重置为全部。这样不会一次性抹掉用户所有筛选上下文。

### 2.2 decisionGuide 文本命中

`decisionGuide` 应被纳入搜索文本，但不要把 UI 拼接文案作为数据源。建议在 `utils/search.ts` 增加纯函数：

```ts
function decisionGuideTexts(concept: KnowledgePoint): string[] {
  const guide = concept.decisionGuide;
  if (!guide) return [];

  return [
    ...guide.applicableScenarios.flatMap((item) => [item.title, item.description, ...item.signals]),
    ...guide.nonApplicableScenarios.flatMap((item) => [item.title, item.description, ...item.signals]),
    ...guide.decisionSignals.flatMap((item) => [
      item.metricOrFact,
      item.threshold ?? '',
      item.interpretation,
      item.evidenceSource,
    ]),
    ...guide.tradeoffs.flatMap((item) => [item.dimension, item.gain, item.cost, item.watchOut]),
    ...guide.reviewQuestions.flatMap((item) => [
      item.question,
      item.whyAsk,
      ...item.goodAnswerSignals,
    ]),
    ...guide.implementationChecklist.flatMap((item) => [
      item.phase,
      item.item,
      item.passSignal,
    ]),
    guide.executiveExplanation.summary,
    guide.executiveExplanation.businessValue,
    guide.executiveExplanation.mainRisk,
    guide.executiveExplanation.riskControl,
  ];
}
```

命中 reason 建议为“工程决策匹配”，避免显示内部字段名。

### 2.3 搜索 API 调整

建议保持 `searchConcepts` 为唯一入口，但将第三个参数升级为 options，同时兼容现有调用：

```ts
interface SearchConceptOptions {
  query: string;
  selectedDomain?: CapabilityDomain | 'all';
  limit?: number;
}

export function searchConcepts(
  concepts: KnowledgePoint[],
  optionsOrQuery: SearchConceptOptions | string,
  legacyLimit = 12,
): SearchResult[];
```

这样后续 Profile / Glossary 若复用搜索工具，不会被 SearchPage 的局部状态绑死。若团队更愿意一次性破坏式调整，也可改为 `searchConcepts(concepts, options)`，但需要同步全仓调用点。

`SearchResult` 建议扩展：

```ts
export interface SearchResult {
  concept: KnowledgePoint;
  score: number;
  reason: string;
  domainMatch?: 'primary' | 'secondary';
}
```

`domainMatch` 供 SearchPage 显示 badge 或辅助 reason，不必强制展示。

## 3. 排序规则

### 3.1 过滤先于排序

排序不应让非选中能力域内容“凭高文本分”混入结果。流程固定为：

1. 标准化 query。
2. 按 `selectedDomain` 过滤候选集合。
3. 对候选集合计算文本命中分。
4. query 为空时，返回 domain browse 列表。
5. query 非空时，返回命中项并排序。

### 3.2 query 非空时的建议分值

保留既有大体语义，新增 domain 与 decisionGuide：

| 命中类型 | 分值 | reason |
|---|---:|---|
| 标题完全匹配 | 100 | 标题完全匹配 |
| 标题包含 | 80 | 标题匹配 |
| 标签匹配 | 60 | 标签匹配 |
| 能力域中文名 / enum id 匹配 | 55 | 能力域匹配 |
| `decisionGuide` 文本匹配 | 50 | 工程决策匹配 |
| 普通正文匹配 | 40 | 正文匹配 |

能力域过滤加权：

- `selectedDomain !== 'all'` 且主域命中：`+6`
- `selectedDomain !== 'all'` 且次域命中：`+3`
- 未发布内容继续 `-35`

同分排序：

1. `score desc`
2. 已发布优先
3. 选中域为主域优先于次域
4. `concept.order asc`

说明：

- `decisionGuide` 分值放在标签之后、普通正文之前，因为它是工程评审文本，信噪比高于企业案例正文，但不应压过用户明确输入的标题 / 标签。
- 选中域加权只用于域内排序，不用于让域外内容进入结果。
- stub 降权与不可点击策略必须保留。

### 3.3 query 为空、domain 已选择时的浏览排序

无需制造假文本分，建议：

1. 主域概念在前。
2. 次域概念在后。
3. 已发布优先。
4. `concept.order asc`。

reason：

- 主域：`主能力域：{label}`
- 次域：`相关能力域：{label}`
- stub 继续附加 ` · 即将上线`。

## 4. UI 与空结果状态

### 4.1 SearchBox 改造建议

有两种实现方式：

方案 A：SearchBox 只负责 input，能力域控件放在 SearchPage。

- 优点：改动小，SearchBox 语义保持纯搜索输入。
- 缺点：筛选 UI 分散在页面。

方案 B：SearchBox 接收 domain props，并在 input 下方渲染能力域 segmented control。

- 优点：搜索输入与筛选状态聚合，组件更完整。
- 缺点：SearchBox props 增多。

建议选方案 B，因为当前 SearchBox 已是 Search 专属组件，且 Phase 1 搜索能力域过滤是搜索控件本身的核心能力。

建议 props：

```ts
interface SearchBoxProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedDomain: CapabilityDomain | 'all';
  onDomainChange: (domain: CapabilityDomain | 'all') => void;
}
```

无障碍要求：

- segmented control 使用 `<button type="button">`。
- 当前项设置 `aria-pressed="true"`。
- “全部”必须可一键清除 domain filter。

### 4.2 空状态文案

| 状态 | 文案建议 | 操作 |
|---|---|---|
| 无 query + 全部 | `输入关键词，或选择一个能力域开始浏览。` | 无 |
| 无 query + domain | 不显示空态；直接展示该域知识点 | 可显示结果统计 |
| 有 query + 全部 + 0 结果 | `没有找到匹配知识点。` | 无 |
| 有 query + domain + 0 结果 | `在「{domainLabel}」中没有找到匹配知识点。` | `清除能力域` button |
| domain 理论上无内容 | `该能力域暂未关联知识点。` | `查看全部` button |

结果区顶部可加一行轻量 meta：

- 全部：`找到 {count} 个结果`
- domain：`{domainLabel} · {count} 个结果`

### 4.3 样式边界

- 继续沿用 `SearchPage.module.css` 的线性列表，不做 dashboard 卡片。
- 能力域控件适合用紧凑 segmented/chip 样式：小字号、1px border、选中态使用 `--color-primary` 与浅蓝背景。
- 移动端允许横向换行，不要造成横向滚动。

## 5. 实施步骤

1. 在 `src/utils/search.ts` 引入 `CapabilityDomain` 类型与 `capabilityDomainLabels`。
2. 新增 `SearchConceptOptions`、`normalizeSearchArgs`、`matchesDomain`、`decisionGuideTexts`、`domainTexts` 等纯函数。
3. 调整 `searchConcepts`：支持 domain filter、domain browse、decisionGuide 命中、排序 tie-break。
4. 改造 `SearchBox.tsx` props，渲染 domain segmented control。
5. 改造 `SearchPage.tsx`：新增 `selectedDomain` state；调用 `searchConcepts(concepts, { query, selectedDomain })`；完善 Escape 行为、空态和结果 meta。
6. 更新 `SearchPage.module.css` / `SearchBox.module.css`：能力域控件、选中态、空结果操作按钮、移动端换行。
7. 跑工程门禁：`npm run typecheck`、`npm run lint`、`npm run build`。如要覆盖内容一致性，可加跑 `npm run validate:content`。
8. 做浏览器 smoke：`/search` 中分别验证空 query、能力域浏览、query + domain、decisionGuide 命中、空结果清除 domain。

## 6. 验收用例

### 6.1 数据与排序

1. 打开 `/search`，不输入 query、不选 domain：
   - 显示“输入关键词，或选择一个能力域开始浏览。”
   - 不渲染结果列表。

2. 选择“推理性能与成本”，query 为空：
   - 展示该能力域下所有主域或次域相关知识点。
   - `prefill`、`decode`、`ttft`、`tpot` 应出现。
   - `kv-cache` 作为主域应靠前；`session-affinity` 可作为次域出现但排在主域项之后。

3. 选择“MaaS 与平台化”，query 为空：
   - `maas`、`model-gateway`、`multi-model-routing`、`cost-routing` 应出现。
   - `kv-cache` 可作为次域出现。

4. 选择“Agent 工程”，搜索 `工具`：
   - `tool-calling` 应命中。
   - 若命中来自 `decisionGuide`，reason 显示“工程决策匹配”。
   - 域外概念不得混入。

5. 搜索 `命中率`，不选 domain：
   - 已有 `decisionGuide` 的缓存 / 路由类知识点应能命中。
   - reason 可显示“工程决策匹配”或更高优先级命中，不应只依赖普通正文。

6. 搜索 `Token`，不选 domain：
   - 标题完全匹配的 `token` 仍排在前面。
   - 其他标签 / 正文命中排在后面。
   - 排序不应因新增 `decisionGuide` 而破坏标题优先级。

7. 选择“安全治理与组织落地”，搜索 `权限`：
   - `permission-governance`、`tool-calling`、`model-gateway` 等主 / 次域相关项可出现。
   - 主域结果优先于仅次域相关结果。

8. 任意搜索命中未发布内容：
   - 未发布内容仍显示“即将上线”。
   - 仍不可点击进入详情页。
   - 仍应用 `-35` 降权。

### 6.2 空态与交互

9. 选择“模型机制理解”，搜索一个不存在的词：
   - 显示 `在「模型机制理解」中没有找到匹配知识点。`
   - 显示“清除能力域”操作。

10. 点击“清除能力域”：
    - domain 回到“全部”。
    - query 保留不变，重新显示全域搜索结果或全域空结果。

11. query 非空时按 `Escape`：
    - query 被清空。
    - selectedDomain 保留。
    - 页面回到该能力域浏览列表。

12. query 已空且 selectedDomain 非全部时按 `Escape`：
    - selectedDomain 回到全部。
    - 页面回到初始提示态。

### 6.3 工程门禁

13. `npm run typecheck` PASS。
14. `npm run lint` PASS。
15. `npm run build` PASS。
16. `npm run validate:content` PASS，确保新增 UI 没有绕开 Phase 1 schema / 数据约束。

## 7. 风险与注意事项

- `capabilityDomains` 在类型上仍是可选字段，但 Phase 1 正式导出的 56 讲已必填。实现时应容错：缺字段的概念在 domain filter 下不展示，在全域搜索中仍可参与文本搜索。
- 不要在 SearchPage 或 SearchBox 重新维护 7 个中文能力域标签；必须复用 `capabilityDomainLabels`。
- `decisionGuide` 搜索文本应从数据对象结构化展开，不要从页面展示文案反向拼接。
- 不要让 domain filter 改变 stub 主路径规则；stub 仍可见但不可点击。
- 不建议新增后端、索引库或 fuzzy search。本阶段数据量只有 56 讲，纯前端线性扫描足够。
- 若后续 Glossary 也要做能力域筛选，应复用同一 domain option 生成方式，避免第三套 filter 常量。

## 8. 建议改动清单

后续正式实现预计涉及：

- `src/utils/search.ts`
- `src/pages/SearchPage.tsx`
- `src/pages/SearchPage.module.css`
- `src/components/search/SearchBox.tsx`
- `src/components/search/SearchBox.module.css`

本预案不要求修改 schema、内容数据或验证脚本。
