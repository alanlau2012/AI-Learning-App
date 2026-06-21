# MVP 0.1 统一修复计划

## 1. 总体结论

**结论：原结论要求 Owner 先决策；Owner 已完成决策，现可进入修复回合 1 派发。**

原因：两份复盘对问题方向高度一致，修复边界也清楚；Owner 已将 P0 的 stub 展示策略、扩展节奏、诊断题门禁和动画投入顺序定稿。后续不重新定级，直接按 §3.5 执行。

## 2. 输入报告

- 产品体验复盘报告：`reviews/ux-review-mvp-0.1.md`
- 内容样板复盘报告：`reviews/content-template-review-mvp-0.1.md`
- 端到端验证报告：`reports/e2e-verification-12-lessons.md`
- MVP 封版报告：`reports/mvp-0.1-summary.md`

本次还只读复核了：`AGENTS.md`、`README.md`、`design.md`、`docs/product-spec.md`、`docs/architecture.md`、`docs/content-schema.md`、`docs/animation-spec.md`、`docs/acceptance-checklist.md`、`docs/project-board.md`，以及相关代码落点。

## 3. 合并后的关键判断

- 当前 12 讲是否可以作为 56 讲样板：**有条件可以**。正文质量、工程口径、诊断题方向、页面骨架成立；但不能把当前答案分布、固定条数、固定句式、通用动画 key 泄漏、stub 自然跳转原样复制到后续 44 讲。
- 是否可以立即扩展 44 讲：**不建议立即扩展**。按 Owner 决策，先完成 MVP 0.1 修复回合 1 的 P0 和最高优先级 P1，端到端复验通过后再扩展。
- 是否必须先修 P0：**是**。P0 不多，但都和“44 讲会不会批量复制错误”直接相关。
- 哪些 P1 需要在扩展前处理：详情页内部状态泄漏、通用动画 raw key 泄漏、`kv-cache` 重复数据来源、诊断题干扰项增强规则、内容审核偏差检查。
- 最大风险：**把 MVP 0.1 的临时样板误当成最终生产模板**，导致 44 讲批量复制 stub 入口、套路化诊断题、固定条数/句式和低解释力动画。

## 3.5 Owner 决策记录

> 本节为 Owner 在统一修复计划形成后的定稿决策，不改变原 P0/P1/P2 分级，只把待决策项固化为后续 Agent 的执行口径。

1. **stub 展示策略**：MVP 演示期保留 56 讲完整课程地图；44 个 stub 可以在模块页、搜索页中可见，但必须弱化、置灰或标记“即将上线”。主学习路径只允许进入已上线 12 讲，stub 不能通过“下一讲”“继续学习”“搜索结果主路径”自然进入空内容页。新用户、老用户、误访问过 stub 的用户，继续学习时都必须回到已上线内容。
2. **扩展节奏**：当前不扩展剩余 44 讲。先完成 MVP 0.1 修复回合 1 的 P0 和最高优先级 P1，端到端复验通过后，再进入 44 讲扩展。
3. **诊断题质量门禁**：正式纳入内容生产门禁。单选答案必须覆盖 A/B/C/D，任一选项占比不超过 40%；至少 30% 题目必须具备强干扰项；解析必须说明为什么其他选项不是第一步或不是最佳判断。
4. **动画投入顺序**：本轮只做两个高复用动画真实画布：`prefill-decode` 与 `agent-loop`。其他动画暂不展开重做，只处理 raw key 泄漏和 fallback 可读性问题。

## 4. 问题去重与合并表

| 编号 | 合并后问题 | 来源 | 原始严重级别 | 重新定级 | 主责 Agent | 是否阻塞扩展 44 讲 |
|---|---|---|---|---|---|---|
| UFP-01 | 已上线学习链路会自然进入 stub：下一讲、继续学习、模块页、搜索都可能把用户送到空内容页 | UX 复盘 / E2E 报告均提到 stub 噪声 | UX P0；E2E P2 | P0 | 主开发 Agent + Owner | 是 |
| UFP-02 | 诊断题答案分布严重失衡，干扰项偏弱，容易被套路化选择 | 两者均提到 | UX P1；内容 P0 | P0 | 内容 Agent | 是 |
| UFP-03 | 12 讲结构过度整齐，固定机制 6 条、误区 5 条、结论 5 条、心智模型句式重复 | 两者均提到 | UX P2；内容 P0 | P0 | 内容 Agent | 是 |
| UFP-04 | 7 类动画实际为通用画布，解释力不足，并暴露 `config.type` / `highlightTargets` raw key | UX 复盘 / 内容复盘均提到 | UX P1；内容 P1 | P1 | 动画工程师 Agent + 主开发 Agent | 部分阻塞，高复用动画扩展前需处理 |
| UFP-05 | 详情页头部展示 `contentStatus`，把 `mvp/stub` 这类内部状态泄漏给用户 | UX 复盘 | UX P1 | P1 | 主开发 Agent | 否，但应在样板定稿前修 |
| UFP-06 | `kv-cache` 在 `src/data/concepts.ts` 与 `src/data/demoConcepts.ts` 存在重复来源，内联 demo 版成为死数据 | 两者均提到 | UX P1；内容 P1 | P1 | 主开发 Agent | 否，但扩展前应清 |
| UFP-07 | 企业案例可信但颗粒度不足，后续需补指标、约束、错误路径和验证结果 | 内容复盘 | 内容 P1 | P1 | 内容 Agent | 否，但影响 44 讲质量 |
| UFP-08 | 内容审核只校验字段完整不够，需要加入样板偏差检查 | 内容复盘 | 内容 P1 | P1 | 内容审核 Agent + 内容 Agent | 是，作为流程门禁阻塞批量扩展 |
| UFP-09 | 缺少显式 12 讲学习路径和上一讲，当前主线依赖全量 56 讲顺序 | UX 复盘 / 内容复盘 | UX P2；内容 P2 | P2 | 主开发 Agent | 否 |
| UFP-10 | Google Fonts 外链在受限网络下报错 | E2E 报告 / 封版报告 / UX 复盘 | E2E P1；UX P2 | P2 | 主开发 Agent | 否 |
| UFP-11 | reduced-motion 提示、KV Cache 动画配色和静态态可继续打磨 | UX 复盘 | UX P2 | P2 | 动画工程师 Agent | 否 |
| UFP-12 | 尚未配置 `npm run test` 或轻量 smoke 脚本 | E2E 报告 / 封版报告 | E2E P2 | P2 | 主开发 Agent / E2E 验证 Agent | 否 |

## 5. 冲突意见处理

### 冲突-01：是否可以立即扩展 44 讲

- 冲突描述：E2E 报告认为可以开始扩展，UX 复盘认为先修 P0-01，内容复盘认为先修 P0-01/P0-02 的内容规则。
- 涉及报告：E2E 验证报告、UX 复盘、内容复盘。
- 影响：如果按 E2E 结论立即扩展，会把“能跑”的状态误当成“样板可复制”的状态。
- 推荐处理：以 UX 与内容复盘为准，先处理 P0，再扩展 44 讲。Owner 已确认当前不扩展 44 讲。
- 是否需要 Owner 决策：否，已决策。

### 冲突-02：动画问题是否阻塞扩展

- 冲突描述：E2E 认为动画可播放且通过；UX 认为 7 类动画是包装过的 fallback；内容复盘认为脚本文字可用但需补画面意图。
- 涉及报告：E2E 验证报告、UX 复盘、内容复盘。
- 影响：动画不影响 12 讲可运行，但会影响“交互式教材”的差异化质量。
- 推荐处理：定为 P1，不作为全局 P0；本轮只完成 `prefill-decode` 与 `agent-loop` 两个高复用真实画布，其他动画只收口 raw key 泄漏和 fallback 可读性。
- 是否需要 Owner 决策：否，已决策。

### 冲突-03：诊断题答案 B 的数量

- 冲突描述：UX 复盘写 11 道单选中 8 道答案为 B；内容复盘写 9 道为 B。
- 涉及报告：UX 复盘、内容复盘。
- 影响：不改变“答案分布失衡”的结论，但会影响回修验收数字。
- 推荐处理：以后续内容 Agent 的脚本统计为准。本次只读运行当前数据，结果为 12 题、11 单选、1 多选，单选正确答案分布 `A=2, B=9, C=0, D=0`。
- 是否需要 Owner 决策：不需要。

### 冲突-04：stub 是隐藏还是保留入口

- 冲突描述：UX 复盘给出两条可行路：隐藏/禁跳 stub，或保留入口但明显占位；当前规格又要求 56 讲信息架构完整。
- 涉及报告：UX 复盘、产品规格、内容 schema。
- 影响：决定主开发如何改模块页、搜索页、详情页下一讲和继续学习。
- 推荐处理：Owner 已选择 MVP 演示期“保留 56 讲地图、主路径禁跳 stub、stub 可见但弱化/置灰/标记即将上线”的策略。
- 是否需要 Owner 决策：否，已决策。

## 6. P0 必须修复项

### P0-01：已上线优先的学习链路与 stub 展示策略

- 问题：详情页“下一个”按 56 讲全量顺序跳转，首页继续学习会回到 lastVisited stub，模块页和搜索页也能直接进入 44 个 stub 空页。
- 来源：UX 复盘；E2E 报告也记录搜索会命中 stub。
- 影响：12 讲自然学习闭环会漏，演示和样板判断都会被“空房间”打断。
- 为什么是 P0：不修复会让后续 44 讲扩展前的样板体验不成立，也会把 stub 入口策略批量复制。
- 主责 Agent：主开发 Agent。
- 协作 Agent：Owner 决策；E2E 验证 Agent 复验。
- 涉及文件 / 页面：`src/pages/ConceptPage.tsx`、`src/utils/progress.ts`、`src/pages/HomePage.tsx`、`src/pages/ModulePage.tsx`、`src/pages/SearchPage.tsx`、`src/utils/search.ts`。
- 建议修复方向：MVP 演示期保留 56 讲完整课程地图，但主路径禁跳 stub。`下一讲`、`继续学习`、推荐入口和搜索结果主路径只进入 `contentStatus ∈ {demo,mvp}` 的已上线内容；44 个 stub 在模块页、搜索页中可见，但必须弱化、置灰或标记“即将上线”，不得自然进入空内容页。
- 完成标准：新用户、老用户、误访问过 stub 的用户点击“继续学习”都进入已上线内容；12 讲中“下一个”不进入 stub；搜索结果可展示 stub 但主路径不进入空内容页；模块页保留 56 讲地图且 stub 有明确弱化态；不改 schema。
- 是否需要 Owner 确认：否，Owner 已决策。

### P0-02：诊断题样板规则与当前 12 讲答案分布回修

- 问题：当前 11 道单选中 `B=9`，`C/D=0`，且不少干扰项是明显幼稚方案。
- 来源：内容复盘；UX 复盘。
- 影响：诊断题会从工程判断训练退化为套路选择，44 讲复制后返工成本高。
- 为什么是 P0：诊断题是产品差异化核心之一；错误样板会直接污染后续内容生产。
- 主责 Agent：内容 Agent。
- 协作 Agent：内容审核 Agent；主开发 Agent 只在审核通过后合入数据。
- 涉及文件 / 页面：内容草稿与审核文件；最终由主开发映射到 `src/data/demoConcepts.ts` 或后续正式数据文件。
- 建议修复方向：回修当前 12 讲诊断题答案位置；增强 `q-skill-1`、`q-model-gateway-1`、`q-multi-model-routing-1` 等弱干扰题；每批 12 题检查答案分布。
- 完成标准：单选正确答案覆盖 A/B/C/D；任一选项占比不超过 40%；至少 30% 题目有“看似合理但优先级不对”的强干扰项；解析解释为什么其他项不是第一步。
- 是否需要 Owner 确认：否，Owner 已确认诊断题质量门禁正式纳入内容流水线。

### P0-03：明确“可复制的是结构，不是固定条数/固定句式”

- 问题：12 讲全部是 6 条机制、5 条误区、5 条结论，11/12 讲心智模型以“可以把 X 理解为……”开头。
- 来源：内容复盘；UX 复盘也提到模板化痕迹。
- 影响：44 讲会出现明显批量生产感，削弱工程教材质感。
- 为什么是 P0：这是内容生产方法问题，不先修会被批量复制。
- 主责 Agent：内容 Agent。
- 协作 Agent：内容审核 Agent；主开发 Agent 可把审核后的规则沉淀到看板或后续检查清单。
- 涉及文件 / 页面：`content/drafts/`、`content/reviewed/`、内容生产检查清单，不直接改 `src/data/*`。
- 建议修复方向：约束机制 4-7 条、误区 3-6 条、结论 3-5 条；心智模型可用类比、反例、边界、角色视角，不固定句式。
- 完成标准：形成可给后续 44 讲内容 Agent 使用的检查清单；当前 12 讲至少完成轻量抽样回修，证明规则可执行。
- 是否需要 Owner 确认：不强制，但建议确认作为扩展前门禁。

## 7. P1 高优先级修复项

### 扩展 44 讲前必须处理的 P1

#### P1-01：内部状态与调试标识泄漏到用户界面

- 问题：详情页头部显示 `contentStatus`，通用动画显示 `config.type` 与 raw `highlightTargets`。
- 来源：UX 复盘。
- 影响：中文工程教材界面出现后台/调试感，样板质感下降。
- 主责 Agent：主开发 Agent。
- 协作 Agent：动画工程师 Agent。
- 涉及文件 / 页面：`src/components/concept/ConceptHeader.tsx`、`src/components/animation/GenericMechanismAnimation.tsx`。
- 建议修复方向：详情页移除 `mvp/stub` 标签；通用动画不直接展示 raw key，与播放器 caption 去重。
- 完成标准：用户界面不出现 `mvp`、`stub`、`token-flow`、`input-text`、`human-review` 等内部标识；动画说明不重复展示。
- 是否需要 Owner 确认：不需要。

#### P1-02：`kv-cache` 重复数据来源清理

- 问题：`src/data/concepts.ts` 里有一份旧 `kv-cache` demo 长对象，实际被 `demoConcepts.ts` 的 mvp 版覆盖。
- 来源：两者均提到。
- 影响：后续维护者可能误改死数据，破坏内容单一来源。
- 主责 Agent：主开发 Agent。
- 协作 Agent：内容审核 Agent 只确认最终正文未丢失。
- 涉及文件 / 页面：`src/data/concepts.ts`、`src/data/demoConcepts.ts`。
- 建议修复方向：把 `concepts.ts` 中旧长对象改回结构登记 stub，正式正文只保留在正式内容数据中。
- 完成标准：`kv-cache` 只有一个生效正文来源；`npm run validate:content` 通过；页面内容不回退。
- 是否需要 Owner 确认：不需要。

#### P1-03：内容审核加入样板偏差检查

- 问题：只校验字段完整，无法防止答案位置失衡、弱干扰项、泛案例、固定句式。
- 来源：内容复盘。
- 影响：44 讲生产质量会漂移。
- 主责 Agent：内容审核 Agent。
- 协作 Agent：内容 Agent。
- 涉及文件 / 页面：`content/reviewed/` 审核结论；后续可由主开发沉淀到 `docs/project-board.md` 或检查清单。
- 建议修复方向：审核项增加是否百科味、是否有工程指标、是否答案位置失衡、是否干扰项太弱、是否固定句式。
- 完成标准：后续每讲 reviewed 文件都有偏差检查结论；未通过不得进入 `src/data/*`。
- 是否需要 Owner 确认：建议确认。

### 可以在扩展过程中处理的 P1

#### P1-04：高复用动画真实画布补齐

- 问题：除 KV Cache 外，其余 7 类动画都是通用画布，机制解释力不足。
- 来源：UX 复盘；内容复盘。
- 影响：动画不构成产品差异化，且会在多个概念中复用。
- 主责 Agent：动画工程师 Agent。
- 协作 Agent：主开发 Agent 负责 registry / Player 集成边界；内容 Agent 补画面意图。
- 涉及文件 / 页面：动画组件目录；`content/drafts/` 中的动画脚本草稿；不改 `AnimationConfig` 协议。
- 建议修复方向：本轮只做 `prefill-decode` 时间轴和 `agent-loop` 环形循环两个真实画布；`token-flow`、`attention-map`、`model-router`、`issue-fix-flow` 暂不展开重做，只处理 raw key 泄漏和 fallback 可读性问题。
- 完成标准：`prefill-decode` 与 `agent-loop` 专用画布把 key 映射为可视状态；其他动画不再暴露 raw key，fallback 文案可读；不改动画协议。
- 是否需要 Owner 确认：否，Owner 已确认本轮动画投入顺序。

#### P1-05：企业案例升级为可复盘案例

- 问题：案例方向可信，但部分仍是“某企业/某平台”的泛例，缺少指标、约束、错误路径和验证结果。
- 来源：内容复盘。
- 影响：56 讲规模下可信度会下降。
- 主责 Agent：内容 Agent。
- 协作 Agent：内容审核 Agent。
- 涉及文件 / 页面：`content/drafts/`、`content/reviewed/`。
- 建议修复方向：每讲至少补 2 类信号：指标、规模、系统边界、错误路径、约束条件、验证结果。
- 完成标准：回修 3-4 个样例作为示范；后续 44 讲 reviewed 时逐讲检查。
- 是否需要 Owner 确认：不需要。

### 可以后续体验增强处理的 P1

#### P1-06：模块页与搜索页的 stub 噪声细节打磨

- 问题：模块页被 stub 卡片淹没，搜索可命中 stub。
- 来源：UX 复盘；E2E 报告。
- 影响：不一定阻塞演示，但影响完成度观感。
- 主责 Agent：主开发 Agent。
- 协作 Agent：Owner 决策。
- 涉及文件 / 页面：`src/pages/ModulePage.tsx`、`src/pages/SearchPage.tsx`、`src/utils/search.ts`。
- 建议修复方向：按 Owner 决策保留 56 讲地图；模块页与搜索页允许展示 stub，但必须弱化、置灰或标记“即将上线”，并避免从搜索结果主路径自然进入空内容页。
- 完成标准：模块页仍体现 56 讲地图，但用户不会误以为 44 个 stub 是可学习正文。
- 是否需要 Owner 确认：是。

## 8. P2 后续优化项

- 增加“上一讲”和显式 12 讲推荐学习路径。
- Google Fonts 本地化或移除外部字体请求，避免受限网络 console 报错。
- reduced-motion 下补充提示文案。
- KV Cache 动画配色和静态态小修。
- 为 `Skill` 后续补 `skill-lifecycle` 动画脚本。
- 减少弱关联概念数量，只保留强相关，弱关系放 tags 或术语。
- 补轻量 `npm run test` 或 smoke / E2E 脚本。

## 9. 按 Agent 拆分的修复任务

### 9.1 给内容 Agent 的任务

```text
任务目标：
修订 12 讲内容样板规则，优先解决诊断题套路化和结构模板化，形成可复制到后续 44 讲的写作约束。

输入文件：
reviews/content-template-review-mvp-0.1.md
reviews/ux-review-mvp-0.1.md
docs/content-schema.md
docs/project-board.md
content/drafts/
content/reviewed/

允许修改：
content/drafts/ 下的修订草稿或内容生产检查清单草稿。

禁止修改：
src/data/*
src/types/*
docs/content-schema.md
页面组件、样式、路由、AnimationPlayer。

具体任务：
1. 回修当前 12 讲诊断题的答案位置和干扰项强度。
2. 形成“答案分布 + 强干扰项 + 结构去模板化 + 案例信号”的内容生产约束。
3. 为动画脚本草稿补“画面意图”，解释 highlightTargets 的视觉含义。
4. 挑选 3-4 讲企业案例补指标、约束、错误路径或验证结果，作为样例。

完成标准：
单选答案覆盖 A/B/C/D，任一选项占比不超过 40%；至少 30% 题目有强干扰项；机制/误区/结论条数不再机械固定；草稿不引入 schema 别名字段。

停止点：
需要改 src/data/*、src/types/*、docs/content-schema.md，或需要调整 56 讲目录时停止，交由主开发或 Owner 决策。
```

### 9.2 给主开发 Agent 的任务

```text
任务目标：
修复 MVP 0.1 的学习链路和内部标识泄漏，不开发新功能、不扩展 44 讲、不改 schema。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reviews/ux-review-mvp-0.1.md
reports/e2e-verification-12-lessons.md
docs/content-schema.md
docs/animation-spec.md

允许修改：
src/pages/ConceptPage.tsx
src/pages/HomePage.tsx
src/pages/ModulePage.tsx
src/pages/SearchPage.tsx
src/utils/progress.ts
src/utils/search.ts
src/components/concept/ConceptHeader.tsx
src/components/animation/GenericMechanismAnimation.tsx
src/data/concepts.ts
必要的局部 CSS

禁止修改：
src/types/index.ts
docs/content-schema.md
AnimationConfig 协议
课程正文大段重写
新增 44 讲内容
引入 UI 框架或重构页面结构。

具体任务：
1. 按 Owner 选定策略实现已上线优先链路，避免下一讲和继续学习进入 stub。
2. 模块页/搜索页对 stub 做弱化、降权或禁跳。
3. 移除详情页 `contentStatus` 用户可见标签。
4. 清理 `kv-cache` 重复数据来源，保持内容生效来源唯一。
5. 通用动画不展示 raw `config.type` 和 `highlightTargets`，并减少重复说明。

完成标准：
12 讲自然点击闭环不进入 stub；用户界面不泄漏内部状态或 raw key；`npm run validate:content`、`npm run typecheck`、`npm run lint`、`npm run build` 通过。

停止点：
需要改 schema、重构 AnimationPlayer、改写课程内容、或无法在不破坏 56 讲地图的前提下处理 stub 时停止，交由 Owner 决策。
```

### 9.3 给动画工程师 Agent 的任务

```text
任务目标：
只优化动画表现层，让高复用动画从通用 fallback 变成真正解释机制的画布。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reviews/ux-review-mvp-0.1.md
docs/animation-spec.md
src/components/animation/
content/drafts/ 中的动画画面意图草稿。

允许修改：
具体 animation type 的表现层组件，或在 docs/animation-spec.md / content/drafts/ 中提交动画步骤草案，由主开发审核集成。

禁止修改：
AnimationConfig 协议
AnimationPlayer 总体架构
ConceptPage
src/types/*
大段课程正文
44 讲扩展内容。

具体任务：
1. 第一优先：`prefill-decode` 时间轴画布，覆盖 Prefill / Decode / TTFT。
2. 第二优先：`agent-loop` 环形循环画布，覆盖 Observe / Plan / Act / Check / Continue/Stop 和人审分支。
3. 后续补 `token-flow`、`attention-map`、`model-router`、`issue-fix-flow`。
4. 把 highlightTargets 映射为可视元素，不直接展示 key。

完成标准：
动画每一步都有清晰状态变化；不依赖 raw key 文本解释；深色机制画布面积克制，符合 design.md；reduced-motion 下可静态理解。

停止点：
需要新增动画协议、改 Player、改详情页布局、或引入 3D/视频/远程资源时停止。
```

本轮建议动画工程师介入，但不要求一次性重做 7 类动画。先派发 `prefill-decode` 与 `agent-loop`。

### 9.4 给 Owner 的决策项

Owner 已完成本轮关键决策，见 §3.5。后续只在执行中出现以下情况时再升级 Owner：

1. 主路径禁跳 stub 与保留 56 讲地图发生不可兼容冲突。
2. 诊断题门禁导致现有 12 讲无法在不改写正文的情况下通过。
3. `prefill-decode` 或 `agent-loop` 需要改动动画协议、页面结构或新增超出首版边界的复杂度。

## 10. 推荐修复顺序

最小闭环路径：

```text
第 1 步：按 Owner 决策冻结本轮范围：保留 56 讲地图、主路径禁跳 stub、暂不扩展 44 讲。
第 2 步：内容 Agent 修 P0-02/P0-03，形成诊断题与写作样板约束，并回修 12 讲关键草稿。
第 3 步：主开发 Agent 修 P0-01，保证 12 讲自然学习闭环不进入 stub。
第 4 步：主开发 Agent 修 P1-01/P1-02，清理内部标识泄漏和 kv-cache 重复来源。
第 5 步：动画工程师 Agent 先补 prefill-decode 与 agent-loop 两个高复用真实画布。
第 6 步：主开发合入审核通过的内容修订，跑 validate:content / typecheck / lint / build。
第 7 步：E2E 验证 Agent 复验首页 → 12 讲路径 → 动画 → 诊断题 → Profile。
第 8 步：通过后再进入 44 讲扩展。
```

依赖说明：页面导航按 Owner 已定策略修；诊断题和内容结构修订必须先由内容 Agent 走 draft/review，主开发不得直接重写正文入库。动画工程师本轮只做 `prefill-decode` 与 `agent-loop`，其他动画只处理 raw key 泄漏和 fallback 可读性。

## 11. 本轮不建议做的事

- 不要扩展剩余 44 讲。
- 不要重构整个页面结构。
- 不要大改 `src/types/index.ts` 或 `docs/content-schema.md`。
- 不要重写 AnimationPlayer 协议。
- 不要引入 UI 框架、后端、登录、真实 LLM API、Service Worker。
- 不要把 P2 全部修完再推进 P0。
- 不要由内容 Agent 直接改 `src/data/*`。
- 不要由动画工程师改 ConceptPage 或内容 schema。

## 12. 给后续修复 Agent 的提示词草稿

### A. 给内容 Agent 的修复提示词

```text
角色：
你是本项目的内容 Agent，只修内容样板与内容生产约束，不改应用代码。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reviews/content-template-review-mvp-0.1.md
reviews/ux-review-mvp-0.1.md
docs/content-schema.md
content/drafts/
content/reviewed/

本轮任务：
只处理内容类 P0 和最高优先级 P1：
1. 回修 12 讲诊断题答案分布和弱干扰项。
2. 将 Owner 确认的诊断题质量门禁写入内容生产约束：单选答案覆盖 A/B/C/D，任一选项占比不超过 40%，至少 30% 题目具备强干扰项，解析说明为什么其他选项不是第一步或不是最佳判断。
3. 明确“可复制结构，不复制固定条数/固定句式”的写作约束。
4. 为动画脚本补画面意图说明。
5. 抽样升级 3-4 个企业案例的指标、约束、错误路径或验证结果。

允许修改范围：
content/drafts/，必要时在 content/reviewed/ 提交审核说明。

禁止事项：
不要改 src/data/*、src/types/*、docs/content-schema.md。
不要新增 44 讲正式内容。
不要改路由、组件、样式、AnimationPlayer。
不要引入 oneSentence/commonPitfalls 等写作模板字段到权威数据。

完成标准：
单选答案覆盖 A/B/C/D，任一选项占比不超过 40%；
至少 30% 诊断题有强干扰项；
解析必须说明为什么其他选项不是第一步或不是最佳判断；
机制 4-7 条、误区 3-6 条、结论 3-5 条按内容自然决定；
心智模型句式不再机械重复；
每个动画草稿说明画面变化和 key 的视觉含义。

停止点：
需要修改 src/data/*、schema、56 讲目录，或需要 Owner 决策内容定位时停止。
```

### B. 给主开发 Agent 的修复提示词

```text
角色：
你是本项目的主开发 Agent，只修工程体验类 P0 和最高优先级 P1，不开发新功能，不扩展课程内容。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reviews/ux-review-mvp-0.1.md
reports/e2e-verification-12-lessons.md
docs/content-schema.md
docs/animation-spec.md
AGENTS.md

本轮任务：
1. 按 Owner 决策实现“保留 56 讲地图，但主路径禁跳 stub”：下一讲、继续学习、推荐入口和搜索结果主路径只进入已上线 12 讲。
2. 模块页与搜索页允许显示 44 个 stub，但必须弱化、置灰或标记“即将上线”，不得自然进入空内容页。
3. 移除详情页头部的 contentStatus 标签。
4. 清理 kv-cache 重复死数据，保持正式内容来源唯一。
5. GenericMechanismAnimation 不展示 config.type 和 highlightTargets raw key，并去掉重复说明。

允许修改范围：
src/pages/ConceptPage.tsx
src/pages/HomePage.tsx
src/pages/ModulePage.tsx
src/pages/SearchPage.tsx
src/utils/progress.ts
src/utils/search.ts
src/components/concept/ConceptHeader.tsx
src/components/animation/GenericMechanismAnimation.tsx
src/data/concepts.ts
必要的局部 CSS。

禁止事项：
不要改 src/types/index.ts。
不要改 docs/content-schema.md。
不要重构 AnimationPlayer 协议。
不要重写课程正文。
不要新增 44 讲。
不要引入 UI 框架。

完成标准：
12 讲自然学习闭环不进入 stub；
新用户、老用户、误访问过 stub 的用户点击继续学习都回到已上线内容；
模块页/搜索页保留 56 讲地图且 stub 有明确弱化态；
用户界面不出现 mvp/stub/token-flow/input-text 等内部标识；
kv-cache 只有一个生效正文来源；
npm run validate:content、npm run typecheck、npm run lint、npm run build 全部通过。

停止点：
必须改 schema/课程内容才能完成，或“主路径禁跳 stub”与“保留 56 讲地图”发生不可兼容冲突时停止。
```

### C. 给动画工程师 Agent 的修复提示词

```text
角色：
你是本项目的动画工程师 Agent，只修动画表现层，不改动画协议和课程正文。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reviews/ux-review-mvp-0.1.md
docs/animation-spec.md
src/components/animation/
内容 Agent 提供的动画画面意图草稿。

本轮任务：
只处理最高复用的两个真实画布，其他动画暂不展开重做：
1. prefill-decode：做首字前/后时间轴拆分，能覆盖 Prefill、Decode、TTFT。
2. agent-loop：做 Observe/Plan/Act/Check/Continue-or-Stop 环形循环，含人审分支。
3. 对其他动画只处理 raw key 泄漏和 fallback 可读性问题，不做专用画布重做。

允许修改范围：
具体动画表现组件与必要局部样式；如需新增组件，遵守现有 registry 模式并由主开发审核集成。

禁止事项：
不要改 AnimationConfig 协议。
不要改 AnimationPlayer 总体架构。
不要改 ConceptPage。
不要改 src/types/*。
不要大改课程正文。
不要扩展 44 讲。
不要使用 3D、视频或远程资源。

完成标准：
prefill-decode 与 agent-loop 每一步都有可见状态变化；
这两个动画的 highlightTargets 被映射为画布元素，不作为文本标签展示；
其他动画不暴露 raw key，fallback 文案可读；
画布符合 design.md 的克制深色机制区；
reduced-motion 下仍可逐步理解。

停止点：
需要新增协议字段、重构 Player、改变页面结构，或需要重做 prefill-decode / agent-loop 之外的专用画布时停止。
```

### D. 给 E2E 验证 Agent 的修复提示词

```text
角色：
你是本项目的 E2E 验证 Agent，只做修复回合 1 的端到端复验和报告，不改业务代码、不改课程内容。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reports/mvp-0.1-owner-decision.md
reports/mvp-0.1-final-agent-prompts.md
reports/e2e-verification-12-lessons.md
docs/content-schema.md
docs/animation-spec.md

本轮任务：
验证 Owner 决策是否被实现：
1. 保留 56 讲完整课程地图。
2. 主学习路径只进入已上线 12 讲，下一讲/继续学习/推荐入口不进入 stub。
3. 新用户、老用户、误访问过 stub 的用户点击继续学习都回到已上线内容。
4. 模块页和搜索页可以看见 44 个 stub，但必须弱化、置灰或标记“即将上线”。
5. 搜索结果主路径不得自然进入 stub 空内容页。
6. 诊断题门禁结果可验证：单选答案覆盖 A/B/C/D，任一选项占比不超过 40%，至少 30% 题目有强干扰项，解析说明其他选项为什么不是第一步或最佳判断。
7. 动画本轮只验 prefill-decode 与 agent-loop 两个真实画布；其他动画只验 raw key 不泄漏、fallback 可读。

允许修改范围：
测试用例目录、验证报告、看板状态。

禁止事项：
不要改 src/*、content/*、docs/content-schema.md。
不要新增 44 讲。
不要修 bug。

完成标准：
npm run validate:content、npm run typecheck、npm run lint、npm run build 通过；
真实浏览器覆盖首页、模块页、搜索页、12 讲详情、继续学习、下一讲、诊断题、prefill-decode、agent-loop、Profile；
输出清晰复验报告，列明通过项、失败项和可复现步骤。

停止点：
发现 P0 未修复、主路径仍可进入 stub、或修复引入 schema/内容/动画协议回归时停止并报告。
```
