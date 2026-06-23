# MVP 0.2 Wave 2 内容自审报告

## 结论：PASS

7 讲草稿全部通过内容生产门禁，可进入主开发合入阶段。

## 1. 诊断题门禁
- Wave 2 答案分布：A=1，B=2，C=2，D=2。
- 覆盖 A/B/C/D，任一选项最多 2 次。
- Wave 1 + Wave 2 整轮分布：A=3，B=4，C=4，D=3，任一选项占比不超过 40%。
- 7/7 为单选工程判断题，不考百科记忆。
- 7/7 含强干扰项，强干扰比例高于 30%。
- 7/7 解析说明了其他选项为何不是第一步或不是最佳判断。

## 2. 结构门禁
- 7/7 包含定义、为什么重要、心智模型、机制、动画说明、企业案例、误区、诊断题、核心结论、关联知识点。
- 机制条数：5-6 条。
- 误区条数：4-5 条。
- 核心结论条数：4 条。
- 心智模型未批量使用固定“可以把 X 理解为……”句式。

## 3. 企业案例门禁
- 7/7 案例均包含五段：场景、问题、分析、方案、结论。
- 7/7 至少包含 2 类工程信号。
- 高难度讲补足平台指标、失败路径、工程约束和排查方法。

## 4. 动画门禁
- `tpot` 复用 `prefill-decode`，不新增动画协议、组件或 Player 逻辑。
- `session-affinity` 复用 `kv-cache`，不新增动画协议、组件或 Player 逻辑。
- 其他 5 讲纯文本。
- 未使用未注册的 `batch-scheduler` 或 `pd-separation` 动画类型。

## 5. schema 门禁
- 不修改 `docs/content-schema.md`。
- 不修改 `src/types/index.ts`。
- 不引入 schema 外字段。
- 关联知识点均为已登记 id。
- 入库阶段只需更新 `src/data/demoConcepts.ts`，通过 `concepts.ts` 的 `demoById` 覆盖 stub。

## 6. 合入清单与注意事项
- 7 讲均升级为 `contentStatus: "mvp"`。
- 不改 `id / slug / order / moduleId`。
- `tpot`: `hasAnimation: true`, `animation.type: "prefill-decode"`。
- `session-affinity`: `hasAnimation: true`, `animation.type: "kv-cache"`。
- `reasoning-limit`, `batch-scheduling`, `pd-separation`, `speculative-decoding`, `quantization`: `hasAnimation: false`，无 `animation` 字段。
- 不修改已封板 12 讲，不修改 Wave 1 已上线 7 讲正文。

