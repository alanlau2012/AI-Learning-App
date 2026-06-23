# MVP 0.2 Wave 1 内容自审报告

## 结论：PASS

7 讲草稿全部通过内容生产门禁，可进入主开发入库阶段。

## 1. 诊断题门禁
- 答案分布：A=2，B=2，C=2，D=1。
- 覆盖 A/B/C/D，任一选项最多 2 次。
- 单选题 7/7，均为工程判断题。
- 强干扰项不少于 3 道；实际 semantic-space、transformer、autoregressive、sampling、instruction-tuning、hallucination 均包含强干扰项。
- 每题解析均说明其他选项为什么不是第一步或不是最佳判断。

## 2. 结构门禁
- 7/7 包含定义、为什么重要、心智模型、机制、动画说明、企业案例、误区、诊断题、核心结论、关联知识点。
- 机制条数范围：4 到 6。
- 误区条数范围：3 到 5。
- 核心结论条数范围：3 到 5。
- 心智模型未批量使用固定“可以把 X 理解为”句式。

## 3. 企业案例门禁
- 7/7 五段完整：场景、问题、分析、方案、结论。
- 7/7 至少包含 2 类工程信号。
- 案例均避免“某公司使用大模型提升效率”式泛泛表述。

## 4. 动画门禁
- `autoregressive` 复用 `token-flow`，不新增动画协议、组件或 Player 修改。
- highlightTargets 可映射：`input-text`, `tokens`, `prefill`, `decode`, `output-tokens`, `cost`。
- 其余 6 讲明确纯文本。

## 5. schema 门禁
- 草稿阶段允许写作结构，入库阶段会映射为 `KnowledgePoint` 权威字段。
- 不修改 `docs/content-schema.md`、`src/types/index.ts`、AnimationConfig 或 56 讲目录。
- 关联知识点均为已登记 id。

## 6. 合并清单与注意事项
- 合并 7 讲到 `src/data/demoConcepts.ts`，均设为 `contentStatus: "mvp"`。
- 不修改 id、slug、order、moduleId。
- `autoregressive` 设置 `hasAnimation: true` 与 `animation.type: "token-flow"`。
- 其余 6 讲保持 `hasAnimation: false` 且无 animation 字段。
- 不进入 Wave 2。
