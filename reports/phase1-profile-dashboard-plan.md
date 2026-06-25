# Phase 1 Profile 能力域概览实现预案

日期：2026-06-24  
范围：DEV-03 Profile 能力域概览与角色路径完成度  
约束：本预案只设计实现，不修改 `src/*`。

## 1. 已读取依据

- `src/pages/ProfilePage.tsx`：当前 Profile 已展示总进度、模块进度、最近学习、收藏、错题、推荐复习、清空记录。页面通过 `useProgressStore` 读取 `completedConceptIds`、`favoriteConceptIds`、`wrongQuestionIds`、`lastVisitedConceptId`、`studyStreakDays`，并用 `overallProgress` / `moduleProgress` 派生展示。
- `src/pages/ProfilePage.module.css`：当前视觉是轻量文档式布局，`panel` 以顶部细分割线承载内容，`grid` 为桌面两列、移动单列，符合 design.md 的克制风格。
- `src/utils/progress.ts`：已有派生计算集中在 progress utils；`progressStore.ts` 明确派生值不冗余存储。DEV-03 的新计算应继续放在这里，Profile 只渲染结果。
- `src/types/index.ts`：已有 `CapabilityDomain`、`CapabilityDomainMapping`、`RolePath` / `RolePathPhase`、`UserProgress`。当前 `UserProgress` 只有错题集合，没有完整答题记录。
- `src/data/capabilityDomains.ts`：已有 `capabilityDomainLabels` 与 `capabilityDomainByConceptId`，7 个能力域不应在 UI 中重新维护中文常量。
- `src/data/rolePaths.ts`：已有 4 条本地角色路径：AI 工程负责人、平台工程师、应用架构师、治理负责人。
- `docs/ai-engineering-leader-enhancement-p0-specs.md` §2 SPEC-02：明确能力域完成度、诊断近似、冷启动 fallback、角色路径完成度与不硬编码规则。
- `docs/ai-engineering-leader-enhancement-tasks.md` DEV-03：要求 Profile 展示 7 个能力域完成度、角色路径完成度、下一步建议；能力域计算使用数据映射，角色路径来自数据配置。

## 2. 当前实现状态

Profile 当前是“学习记录页”，还不是“能力域概览页”。它已经具备三类可复用基础：

- 数据入口完整：`completedConceptIds` 与 `wrongQuestionIds` 已能支撑 Phase 1 的完成度和诊断近似。
- 视觉容器可复用：`panel`、`grid`、`linkCard`、`empty` 可以承接新增区块，不需要引入重型图表库。
- 派生计算边界清楚：`progress.ts` 已经承担 overall / module 计算，新能力域与角色路径计算应按同一模式新增。

主要缺口：

- 缺少 `CapabilityDomainScore` 派生函数。
- 缺少 `RolePathProgress` 派生函数。
- 推荐复习仍是“错题优先 / 最近访问 / Token 起步”，没有结合薄弱能力域和角色路径。
- Profile 首屏没有展示“我在哪些负责人能力域薄弱”和“按哪个角色路径继续”。

## 3. 能力域完成度计算设计

建议在 `src/utils/progress.ts` 新增纯函数，不写入 store：

```ts
export interface CapabilityDomainScore {
  domain: CapabilityDomain;
  label: string;
  completionScore: number;
  diagnosticScore?: number;
  finalScore: number;
  confidence: 'low' | 'medium' | 'high';
  completedWeightedCount: number;
  totalWeightedCount: number;
  diagnosticWeightedCount: number;
  wrongWeightedCount: number;
  nextConceptId?: string;
}

export function capabilityDomainProgress(
  completedConceptIds: string[],
  wrongQuestionIds: string[],
): CapabilityDomainScore[];
```

计算口径：

- 数据源以 `concepts` + `capabilityDomainByConceptId` 为准；不硬编码 56 讲或每域数量。
- 只统计已发布概念，建议复用 `isPublishedConcept(concept)`，避免未来重新出现 stub 时污染分母。
- 主域权重 `1.0`，次域权重 `0.5`；分子和分母都按同一权重累加。
- `completionScore = completedWeightedCount / totalWeightedCount`。
- 诊断近似只在“已完成且有 diagnosticQuestion 的概念”中计算：
  - `diagnosticWeightedCount`：该域内已完成且有诊断题的加权样本。
  - `wrongWeightedCount`：其中 `wrongQuestionIds` 命中的加权样本。
  - `diagnosticScore = (diagnosticWeightedCount - wrongWeightedCount) / diagnosticWeightedCount`。
- 若 `diagnosticWeightedCount === 0`，`diagnosticScore` 置空，`finalScore = completionScore`，UI 显示“诊断样本不足，当前按完成度估算”。
- 若有诊断样本，`finalScore = completionScore * 0.7 + diagnosticScore * 0.3`。
- 置信度：0 条诊断样本为 `low`，1-2 条为 `medium`，3 条及以上为 `high`。
- 每个能力域的 `nextConceptId` 取该域内第一个未完成的已发布概念，顺序沿用 `modules` 中的概念顺序。

当前映射分母规模可作为实现验收参考，但不得写死：

| 能力域 | 主域数 | 次域数 | 加权分母 |
|---|---:|---:|---:|
| 模型机制理解 | 10 | 1 | 10.5 |
| 推理性能与成本 | 9 | 6 | 12 |
| MaaS 与平台化 | 9 | 3 | 10.5 |
| RAG 与上下文工程 | 7 | 2 | 8 |
| Agent 工程 | 14 | 4 | 16 |
| 评估与可观测 | 4 | 8 | 8 |
| 安全治理与组织落地 | 3 | 12 | 9 |

## 4. 角色路径完成度计算设计

建议在 `src/utils/progress.ts` 新增：

```ts
export interface RolePathProgress {
  id: RolePath['id'];
  title: string;
  goal: string;
  done: number;
  total: number;
  percent: number;
  nextConceptId?: string;
  phases: Array<{
    id: string;
    title: string;
    outcome: string;
    done: number;
    total: number;
    percent: number;
    nextConceptId?: string;
  }>;
}

export function rolePathProgress(completedConceptIds: string[]): RolePathProgress[];
```

计算口径：

- 数据源只用 `rolePaths`，不得在 Profile 中复制推荐列表。
- `rolePathCompletion = completed concepts in recommendedConceptIds / recommendedConceptIds.length`。
- 同一 concept 出现在多条路径时不去重，每条路径独立计算。
- `nextConceptId` 取该路径 `recommendedConceptIds` 中第一个未完成概念。
- `phases` 逐段计算，帮助 UI 告诉用户“下一步补哪一段能力”，而不只是给一个总百分比。

当前 4 条路径的分母应来自数据配置：

- AI 工程负责人：12 讲。
- 平台工程师：14 讲。
- 应用架构师：12 讲。
- 治理负责人：12 讲。

## 5. 下一步行动规则

Profile 的“推荐复习”建议升级为“下一步行动”，但仍保持轻量，不引入个性化账号或团队状态。

优先级：

1. 若存在错题，优先推荐第一条错题对应概念：标题 `先修正判断偏差`，说明 `错题会影响能力域诊断估算`。
2. 否则找到 `finalScore` 最低且 `nextConceptId` 存在的能力域：标题 `补齐薄弱能力域`，跳转该域下一个未完成概念。
3. 若能力域全部完成，找到完成度最低且 `nextConceptId` 存在的角色路径：标题 `推进角色路径`，跳转该路径下一个未完成概念。
4. 若全部完成，推荐最近访问或第一讲复盘：标题 `进入复盘模式`。

辅助排序规则：

- 能力域排序默认按 `finalScore asc`，同分时优先 `confidence !== high`，再按 `totalWeightedCount desc`。
- 角色路径排序默认按 `percent asc`，同分时按 `total desc`。
- 推荐卡只展示一个主行动，旁边最多展示两个备选链接，避免 Profile 首屏变成复杂任务看板。

文案口径：

- 有诊断样本不足的能力域，显示 `诊断样本不足，当前按完成度估算`。
- 有诊断样本的能力域，显示 `完成度 X%，诊断估算 Y%，置信度 low/medium/high`。
- 不承诺“能力测评准确分”，使用“估算”“完成度”“判断偏差”等保守词。

## 6. 轻量 UI 布局

建议只调整 `ProfilePage.tsx` 和 `ProfilePage.module.css`，不新增一级导航、不新增复杂图表库。

页面顺序：

1. Header：标题从“我的学习”扩展为“我的学习与能力域”，副文案说明“进度、能力域、角色路径和下一步行动集中在这里”。
2. `StudyStats`：保留，作为稳定首屏指标。
3. 新增“下一步行动”panel：一条主推荐卡，含行动标题、原因、跳转按钮；可沿用 `linkCard` 风格。
4. 新增“能力域概览”panel：7 行条形进度，不做雷达图。每行展示中文名、最终分、完成加权数 / 总加权数、置信度、下一讲链接。
5. 新增“角色路径”panel：4 张轻量路径行或两列小卡，展示标题、目标短句、done / total、进度条、下一讲。
6. “各模块进度”下移保留，作为课程结构进度。
7. 最近学习、收藏、错题、推荐复习可合并或保留在下方两列网格；若新增“下一步行动”，原“推荐复习”可改名为“复习入口”或直接保留为错题列表旁的辅助入口。
8. 清空记录保持底部危险区，不与新增概览混排。

CSS 建议：

- 复用 `.panel` 顶部分割线，不新增卡片套卡片。
- 新增 `.domainList` / `.domainRow` / `.rolePathList` / `.rolePathCard` / `.actionPanel`。
- 条形进度使用 `ProgressBar` 或同风格细条；颜色沿用 `--color-progress` 和 `--color-primary`。
- 桌面：能力域单列更利于扫描，角色路径两列；移动端全部单列。
- 避免大面积图表、渐变、深色区块、强阴影，保持现有 Profile 的报告式阅读节奏。

## 7. 实施步骤

1. 在 `progress.ts` 增加 `capabilityDomainProgress`、`rolePathProgress` 和 `getNextProfileAction` 三类纯函数。
2. 在 `ProfilePage.tsx` 引入 `capabilityDomainLabels`、`rolePaths` 间接数据由 utils 消费，页面只拿派生结果渲染。
3. 更新 `ProfilePage.module.css`，添加能力域行、路径卡、行动区样式。
4. 保持 `progressStore.ts` 不变；本阶段不新增持久化字段，不触发 localStorage 版本迁移。
5. 验证 `npm run typecheck`、`npm run lint`、`npm run build`；如涉及内容结构，补跑 `npm run validate:content`。

## 8. 验收标准

- Profile 展示 7 个能力域，中文名来自 `capabilityDomainLabels`。
- 能力域分母来自 `capabilityDomainByConceptId` / `concepts`，不硬编码数量。
- 主域按 1.0、次域按 0.5 计算，完成度与诊断分都使用同一权重口径。
- 无诊断样本时不按 0 分惩罚，展示 SPEC-02 要求的估算文案。
- Profile 展示 4 条角色路径，推荐列表来自 `rolePaths`。
- 下一步行动在错题、薄弱能力域、角色路径之间有确定性优先级。
- 不修改 `progressStore` schema，不引入账号、团队、后端、协作或云同步。
- 移动端无横向滚动，文本不溢出，危险清空区仍在页面底部。

## 9. 风险与取舍

- 诊断得分是 Phase 1 近似：当前 store 只知道错题，不知道完整答题次数或后来是否答对。因此 UI 必须写“估算”，后续 DEV-09 / DEV-10 再升级答题记录 schema。
- 能力域次域会让加权分母出现小数，UI 可以展示百分比和 `已完成加权 / 总加权`，但不应把 `10.5` 讲写成“10.5 讲”。更自然的展示是 `完成度 62%`，详情小字写 `加权样本 6.5 / 10.5`。
- 若用户手动标记完成但没有答题，Phase 1 会把“已完成且未记录错题”视作诊断近似正确，这是 SPEC-02 允许的冷启动取舍，但不是长期测评模型。
- Profile 已有内容较多，新增区块应优先服务“下一步行动”和“能力诊断”，模块进度与收藏错题可以下移，避免首屏拥挤。
