# MVP 0.1 内容修复回合 1 工作摘要

## 1. 完成情况

本轮已完成。内容修复只落在允许范围内，没有修改 `src/data/*`、`src/types/*`、`docs/content-schema.md`、页面组件、样式、路由或动画实现。

已新增文件：

- `content/reviewed/mvp-0.1-content-fix-round1.md`
- `reports/mvp-0.1-content-fix-round1.md`

未修改正式入库数据。`src/data/demoConcepts.ts` 仅作为只读依据，后续需由主开发按 reviewed 文件合入。

## 2. 做了什么

- 读取并遵守 `reports/mvp-0.1-unified-fix-plan.md`、`reports/mvp-0.1-owner-decision.md`、`reports/mvp-0.1-final-agent-prompts.md`、两份复盘报告、`docs/content-schema.md`、`src/data/demoConcepts.ts` 和 12 个 `content/drafts/*.json`。
- 回修 12 讲诊断题方案，逐题给出修订前到修订后的 options、correctOptionIds、explanation、troubleshootingPath。
- 将 11 道单选答案从基线 `A=2, B=9, C=0, D=0` 调整为 `A=3, B=2, C=3, D=3`。
- 增强弱干扰项，优先覆盖 `q-skill-1`、`q-model-gateway-1`、`q-multi-model-routing-1`。
- 补充诊断题质量门禁、去模板化写作约束和内容审核偏差检查。
- 抽样升级 4 个企业案例：`model-gateway`、`multi-model-routing`、`skill`、`agent-loop`。
- 为 `prefill-decode` 和 `agent-loop` 提供动画画面意图初稿，只描述语义和画面状态，不写前端实现。
- 补做 P0-03 去模板化抽样回修（见 reviewed 文件 §9），把写作约束从“规则”落成“可合入修订”。

## 3. 达成标准证据

修订后 11 道单选答案分布：

| 选项 | 数量 | 占比 |
|---|---:|---:|
| A | 3 | 27.3% |
| B | 2 | 18.2% |
| C | 3 | 27.3% |
| D | 3 | 27.3% |

门禁结果：

- A/B/C/D 都出现：通过。
- 任一选项占比不超过 40%：通过，最高 27.3%。
- 至少 30% 题目有强干扰项：通过，10/12 = 83.3%。
- 解析说明其他选项为什么不是第一步或不是最佳判断：通过，逐题已补充。
- 单选 `correctOptionIds` 长度恒为 1，多选 `q-ttft-1` 保持 `["a", "b", "c"]`：通过。
- 机制 4-7 条、误区 3-6 条、结论 3-5 条按内容自然决定：已写入内容生产约束。
- 心智模型不固定“可以把 X 理解为……”：已写入去模板化约束并给出替代句式。
- 不引入 schema 外字段：通过。案例升级样例只使用 `enterpriseCase` 现有字段；诊断题修订只使用现有 `diagnosticQuestion` 字段。

P0-03 去模板化抽样回修证据（见 reviewed 文件 §9）：

- 心智模型句式去重：覆盖 11 讲（token、attention、prefill、ttft、kv-cache、model-gateway、multi-model-routing、context-window、agent-loop、skill、issue-fix-agent），11 个开头互不相同，均不再以「可以把 X 理解为」起句；`decode` 本就用不同句式，无需改写。
- 条数去模板化：覆盖 5 讲，打散“机制 6 / 误区 5 / 结论 5”统一结构。
  - token：mechanism 6 → 5（合并）。
  - ttft：keyTakeaways 5 → 4（合并）。
  - model-gateway：pitfalls 5 → 4（合并）。
  - kv-cache：keyTakeaways 5 → 4（合并）。
  - multi-model-routing：mechanism 6 → 7（拆分过粗项）。
- 入库校验底线：5 讲修订字段全部满足 mechanism ≥3、pitfalls ≥2、keyTakeaways ≥2，且落在机制 4-7 / 误区 3-6 / 结论 3-5 区间内。
- 仍只使用现有 schema 字段，可无损映射到 `src/data/demoConcepts.ts`。

## 4. 遗留项

- 本轮没有把修订内容写入 `src/data/demoConcepts.ts`，这是硬边界。需要主开发在审核通过后合入。
- 诊断题质量门禁和去模板化约束还未回写到 `docs/project-board.md` 或流程看板，需总控统一处理。
- `prefill-decode` 和 `agent-loop` 仍只是画面意图草稿，需要动画意图/动画工程 Agent 继续转成实现方案。
- 12 讲正文的去模板化已完成可合入抽样回修：11 讲心智模型句式已改写、5 讲条数已打散（见 reviewed 文件 §9）。这些修订仍未写入 `src/data/demoConcepts.ts`（硬边界），需主开发审核后合入；其余未抽样到的字段保持原样属正常，本轮目标是“证明规则可执行”，非全量重写。

## 5. 停止点

未触发需要停止的越界项。本轮没有遇到必须修改 schema、56 讲目录、`src/data/*` 或需要 Owner 重新决策内容定位的情况。

后续若要把本轮题目修订正式生效，停止点是：必须由主开发按 reviewed 文件修改 `src/data/demoConcepts.ts` 并运行内容校验，而不是由内容 Agent 直接改入库数据。
