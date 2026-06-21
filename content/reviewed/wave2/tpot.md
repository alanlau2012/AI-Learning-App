# tpot 审核结论：PASS

## 1. 诊断题门禁
通过。正确答案 A；题目围绕首字稳定但首字后卡顿的 Decode 指标判断。B 为强干扰项，缩短提示词可能改善 Prefill 但不对应 TPOT；C/D 也已解释不是第一排查。

## 2. 结构门禁
通过。包含定义、重要性、心智模型、5 条机制、4 条误区、4 条核心结论。内容清楚区分 TTFT 与 TPOT。

## 3. 企业案例门禁
通过。包含指标、规模、系统边界、约束条件、验证结果，可复盘“模型升级 -> Decode 变慢 -> 分层路由和 TPOT 灰度”的链路。

## 4. 动画门禁
通过。复用 `prefill-decode`，不新增动画协议或组件。highlightTargets 建议为 `first-output-token`, `decode-loop`, `long-output`, `tpot`, `token-interval`, `total-latency`，均指向首 Token 后、Decode、输出序列和标尺类可视元素。

## 5. schema 门禁
通过。入库应设置 `hasAnimation: true` 且 `animation.type = "prefill-decode"`；关联 id 均已登记。

## 6. 合并注意事项
动画标题建议为“首 Token 后的 TPOT”；步骤不少于 5 步，聚焦 Decode 和 TPOT。
