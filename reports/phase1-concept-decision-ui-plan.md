# Phase 1 ConceptPage 工程决策章节实现预案

> 日期：2026-06-24  
> 范围：DEV-02「知识点详情页决策章节」实现预案  
> 边界：本报告仅新增 `reports/phase1-concept-decision-ui-plan.md`，不得修改 `src/*`。  
> 依据：`docs/ai-engineering-leader-enhancement-p0-specs.md` SPEC-01、`docs/ai-engineering-leader-enhancement-tasks.md` DEV-02、`docs/ai-engineering-leader-enhancement-progress.md` 当前 P1 状态、现有 `ConceptPage` / `ConceptSection` / token 样式。

## 1. 当前输入状态

- `SCHEMA-01`、`SCHEMA-02`、`DEV-01` 已完成；当前进度文件显示后续可启动 `DEV-02/03/04`。
- `DecisionGuide` schema 已在 `src/types/index.ts` 定义，字段为：
  - `applicableScenarios`
  - `nonApplicableScenarios`
  - `decisionSignals`
  - `tradeoffs`
  - `reviewQuestions`
  - `implementationChecklist`
  - `executiveExplanation`
- `src/data/decisionGuides.ts` 已提供首批 12 条 reviewed `decisionGuide`，并由 `src/data/concepts.ts` 合并进正式 `concepts`。
- `scripts/validate-content.ts` 已校验 Phase 1 至少 12 个 `decisionGuide`，并校验各子项最小数量、必填字段、阶段枚举、维度枚举和子项 `id` 唯一性。
- `content/reviewed/decision-guide-phase1a-first-12-reviewed.md` 显示 12 / 12 通过 SPEC-01，且本轮只覆盖 Phase 1A 首批 12 讲。

## 2. SPEC-01 对页面的硬要求

`工程决策` 章节必须满足：

- 标题固定为 `工程决策`。
- 展示位置固定在知识点详情页 `enterpriseCase` 之后、`pitfalls` 之前。
- Phase 1 交互只支持复制 `reviewQuestions` 与 `implementationChecklist`，不做 Markdown 导出。
- 无 `decisionGuide` 的知识点不显示空壳章节。

`DEV-02` 验收必须覆盖：

- 有 `decisionGuide` 的知识点显示完整。
- 无 `decisionGuide` 的知识点不出现空壳。
- 移动端无溢出。

## 3. 现有 ConceptPage 结构约束

当前 `ConceptPage` 渲染顺序为：

1. 返回模块链接
2. `ConceptHeader`
3. 一句话定义
4. 机制短片 callout
5. `ConceptSection` 01 为什么重要
6. `ConceptSection` 02 心智模型
7. `ConceptSection` 03 机制讲解
8. `ConceptSection` 04 动画演示
9. `ConceptSection` 05 企业案例
10. `ConceptSection` 06 常见误区
11. `ConceptSection` 07 诊断题
12. `ConceptSection` 08 核心结论
13. `ConceptSection` 09 关联知识点
14. footer 操作区

建议插入后顺序为：

1. 企业案例继续保留 `index={5}`。
2. 若 `concept.decisionGuide` 存在，插入 `ConceptSection index={6} title="工程决策"`。
3. 后续章节编号动态偏移：
   - 有 `decisionGuide`：常见误区 07、诊断题 08、核心结论 09、关联知识点 10。
   - 无 `decisionGuide`：保持现状常见误区 06、诊断题 07、核心结论 08、关联知识点 09。

这样能同时满足 SPEC-01 的位置要求和“无数据不出现空壳”要求，也避免无 `decisionGuide` 页面出现编号跳号。

## 4. 推荐组件结构

新增独立展示组件，避免把大量决策手册 UI 堆进 `ConceptPage`。

建议文件：

- `src/components/concept/DecisionGuideSection.tsx`
- `src/components/concept/DecisionGuideSection.module.css`

组件签名：

```ts
interface DecisionGuideSectionProps {
  guide: DecisionGuide;
}
```

`ConceptPage` 中只负责：

```tsx
const hasDecisionGuide = Boolean(concept.decisionGuide);
const offset = hasDecisionGuide ? 1 : 0;
```

并在企业案例之后插入：

```tsx
{concept.decisionGuide && (
  <ConceptSection index={6} title="工程决策">
    <DecisionGuideSection guide={concept.decisionGuide} />
  </ConceptSection>
)}
```

后续章节用 `6 + offset`、`7 + offset`、`8 + offset`、`9 + offset` 计算编号。

### 子组件拆分

`DecisionGuideSection` 内部可先使用文件内小组件，不必过早拆文件：

- `ScenarioGrid`：渲染适用 / 不适用场景。
- `SignalList`：渲染决策信号。
- `TradeoffList`：渲染架构取舍。
- `CopyableReviewBlock`：渲染评审问题并复制。
- `CopyableChecklistBlock`：渲染落地清单并复制。
- `ExecutiveBrief`：渲染管理层解释。

拆分原则：只拆到能让 JSX 可读即可；不要引入全局状态、路由状态或新的数据转换层。

## 5. 展示顺序与信息架构

推荐在 `工程决策` 章节内按“先判断是否适用，再判断怎么上线”排序：

1. `executiveExplanation`：管理层摘要先行。
   - 标题：`负责人摘要`
   - 展示：四段短项 `summary`、`businessValue`、`mainRisk`、`riskControl`
   - 理由：进入章节先给负责人一个决策框架，避免直接落入长清单。
2. `applicableScenarios` / `nonApplicableScenarios`：双列对照。
   - 标题：`适合采用` / `不宜优先采用`
   - 每条展示 `title`、`description`、`signals`
   - 理由：SPEC-01 强调适用与不适用都要给出可观察信号。
3. `decisionSignals`：工程信号。
   - 每条展示 `metricOrFact`、可选 `threshold`、`interpretation`、`evidenceSource`
   - 理由：把“看什么数据”放在架构取舍之前。
4. `tradeoffs`：架构取舍。
   - 每条展示维度标签、`gain`、`cost`、`watchOut`
   - 维度中文映射建议：
     - `cost` 成本
     - `latency` 延迟
     - `quality` 质量
     - `reliability` 可靠性
     - `observability` 可观测性
     - `security` 安全
     - `operability` 运维
5. `reviewQuestions`：评审问题。
   - 每条展示 `question`、`whyAsk`、`goodAnswerSignals`
   - 顶部提供复制按钮。
6. `implementationChecklist`：落地清单。
   - 按 `phase` 分组展示：`beforeBuild` 设计前、`beforeLaunch` 上线前、`running` 运行中。
   - 每条展示 `item`、`passSignal`
   - 顶部提供复制按钮。

## 6. 复制交互设计

### 复制范围

SPEC-01 要求复制 `reviewQuestions` 与 `implementationChecklist`。建议做两个独立按钮：

- `复制评审问题`
- `复制落地清单`

不建议 Phase 1 做“复制全部工程决策”，以免变成未授权的 Markdown 导出变体。

### 复制内容格式

复制内容应为纯文本，便于粘到评审会议纪要、Issue 或 IM：

```text
评审问题：<concept title>

1. <question>
   为什么问：<whyAsk>
   好答案信号：<signal1>；<signal2>

2. ...
```

```text
落地清单：<concept title>

[设计前]
1. <item>
   通过信号：<passSignal>

[上线前]
...

[运行中]
...
```

为生成标题，`DecisionGuideSection` 可额外接收 `conceptTitle`：

```ts
interface DecisionGuideSectionProps {
  guide: DecisionGuide;
  conceptTitle: string;
}
```

若为了保持组件输入最小，也可复制时只写 `评审问题` / `落地清单`，但从真实使用看带概念标题更稳。

### 浏览器 API 与降级

首选 `navigator.clipboard.writeText(text)`。

交互状态建议：

- idle：按钮显示 `复制评审问题` / `复制落地清单`
- success：按钮短暂显示 `已复制`
- error：按钮短暂显示 `复制失败，请手动选择`

实现建议：

- 使用组件内 `useState<'idle' | 'copied' | 'failed'>`，评审问题和落地清单各自独立状态。
- `setTimeout` 约 1600ms 恢复 idle。
- 不写入 Zustand，不做持久化。
- 不依赖外部 toast 系统，避免引入新全局 UI。

### 可访问性

- 复制按钮使用 `<button type="button">`。
- 成功 / 失败状态用按钮文案表达；可加一个 `aria-live="polite"` 的短状态文本。
- 按钮不应只靠颜色表达状态。

## 7. 空数据行为

页面级空数据：

- `concept.decisionGuide` 不存在时，完全不渲染 `工程决策` 的 `ConceptSection`。
- 不使用 `EmptySectionHint`。
- 后续章节编号保持现有顺序，不出现跳号。

字段级空数据：

- 根据 validator，存在 `decisionGuide` 时字段都应满足最低数量和必填要求。
- UI 可不为内部字段设计大面积 fallback，避免掩盖数据质量问题。
- 若为了运行时稳健，可对数组渲染使用 `guide.reviewQuestions.map` 等自然空数组处理；但不应显示“暂无评审问题”这类内容，因为那代表数据入库门禁失效，应该由 `validate:content` 发现。

## 8. 样式约束

必须沿用现有视觉 token：

- 背景：`var(--color-bg)`、`var(--color-surface)`、`var(--color-surface-soft)`
- 主色：`var(--color-primary)`、`var(--color-primary-soft)`、`var(--color-primary-border)`
- 进度 / 正向信号：`var(--color-progress)`、`var(--color-progress-soft)`，只克制使用
- 文本：`var(--color-title)`、`var(--color-text)`、`var(--color-muted)`
- 边框：`var(--color-border)`、`var(--color-border-strong)`
- 字体：标题 serif、正文 sans、标签 / 指标 mono
- 圆角：`var(--radius)` 或 `var(--radius-lg)`，不超过现有 6-8px 风格

建议视觉形态：

- `DecisionGuideSection` 作为 `ConceptSection` body 内部内容，不再嵌套大卡片容器。
- 对照场景可用两列 grid，每列一个轻量 panel；移动端变单列。
- 决策信号和取舍适合列表化，不做复杂表格，避免移动端横向滚动。
- 阶段清单用小标签或分组标题表达 `beforeBuild` / `beforeLaunch` / `running`。
- 复制按钮使用现有按钮风格：浅底、边框、蓝色文字；不要做新的强阴影或大面积强调。

## 9. 移动端验收点

建议至少在 390px 宽度验证以下页面：

- 一个有 `decisionGuide` 的知识点，例如 `multi-model-routing`、`kv-cache`、`agent-loop`。
- 一个无 `decisionGuide` 的知识点，例如 Phase 1A 未覆盖的候选或其他普通讲，按实际数据选择。

验收点：

- 页面整体无水平滚动，`document.documentElement.scrollWidth <= window.innerWidth`。
- `工程决策` 章节在企业案例之后、常见误区之前。
- 有 `decisionGuide` 页面显示六组内容：负责人摘要、适用 / 不适用、决策信号、架构取舍、评审问题、落地清单。
- 复制按钮在窄屏下不挤压正文；按钮可换行或占满一行。
- 长指标、Trace 字段、P95、Token、KV Cache 等英文 / 数字文本不撑破容器；必要时使用 `overflow-wrap: anywhere`。
- 双列区域在移动端降为单列。
- 阶段清单不使用必须横向滚动的表格。
- 点击 `复制评审问题` 后按钮状态变为 `已复制`；点击 `复制落地清单` 同理。
- 无 `decisionGuide` 页面不显示 `工程决策` 标题，也没有空白分隔线或编号跳号。

## 10. 推荐实施步骤

1. 新增 `DecisionGuideSection.tsx` 和 CSS module。
2. 在 `ConceptPage.tsx` 引入组件，在企业案例后按 `concept.decisionGuide` 条件渲染。
3. 将常见误区、诊断题、核心结论、关联知识点编号改为基于 `hasDecisionGuide` 的动态偏移。
4. 实现纯文本复制函数和两个独立复制按钮状态。
5. 为 `phase`、`dimension` 增加组件内中文映射。
6. 跑 `npm run typecheck`、`npm run lint`、`npm run validate:content`。
7. 用浏览器或 Playwright 抽查桌面和 390px 移动端：
   - 有 `decisionGuide` 页面完整显示和复制。
   - 无 `decisionGuide` 页面不显示空壳。
   - 移动端无横向溢出。

## 11. 风险与取舍

- 不建议修改 `ConceptSection` 的公共 API。当前 `ConceptSection` 已足够承载新章节；复制交互和复杂布局应留在 `DecisionGuideSection` 内。
- 不建议把 `decisionGuide` 渲染写成表格。内容包含较长中文、英文指标和证据来源，表格在 390px 下容易溢出。
- 不建议新增全局 toast 或 store 状态。复制反馈是局部瞬态交互，组件内状态即可。
- 不建议为无 `decisionGuide` 内容显示“待补充”。SPEC-01 明确要求不显示空壳章节。
- 不建议在 Phase 1 做 Markdown 导出、复制完整决策手册或下载能力；这会越过 SPEC-01 当前交互边界。

## 12. 可交付定义

DEV-02 完成时应能证明：

- `ConceptPage` 展示顺序符合 SPEC-01。
- 首批 12 个有 `decisionGuide` 的知识点均能看到完整 `工程决策`。
- 未覆盖 `decisionGuide` 的知识点完全不出现该章节。
- 两个复制按钮分别可复制评审问题和落地清单。
- 移动端无水平溢出，长文本可换行。
- `validate:content`、`typecheck`、`lint` 通过。
