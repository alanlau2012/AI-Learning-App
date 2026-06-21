# MVP 0.1 修复回合 1 最终 Agent 派发提示词

> 本派发包基于 `reports/mvp-0.1-unified-fix-plan.md` 与 `reports/mvp-0.1-owner-decision.md`。禁止重新定级、扩展 44 讲、修改 schema、推翻统一修复计划主结论。

## A. 给内容 Agent 的修复提示词

```text
角色：
你是本项目的内容 Agent，只修内容样板与内容生产约束，不改应用代码。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reports/mvp-0.1-owner-decision.md
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

## B. 给主开发 Agent 的修复提示词

```text
角色：
你是本项目的主开发 Agent，只修工程体验类 P0 和最高优先级 P1，不开发新功能，不扩展课程内容。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reports/mvp-0.1-owner-decision.md
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

## C. 给动画工程师 Agent 的修复提示词

```text
角色：
你是本项目的动画工程师 Agent，只修动画表现层，不改动画协议和课程正文。

输入文件：
reports/mvp-0.1-unified-fix-plan.md
reports/mvp-0.1-owner-decision.md
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

## D. 给 E2E 验证 Agent 的修复提示词

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
