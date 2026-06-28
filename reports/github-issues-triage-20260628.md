# GitHub Issues Triage（2026-06-28）

> 数据源：`gh issue list --repo alanlau2012/AI-Learning-App --state open --limit 100 --json number,title,labels,createdAt,updatedAt,url,body`
> 拉取时间：2026-06-28
> 当前分支：`codex/ai-leader-phase2-profile-enhancements`
> 本报告只做 triage，不修改业务代码。

## 1. 结论先行

- GitHub 当前 open issue 不是 30 多个，而是 **61 个**。
- 其中包含 **3 个审计/跟踪类 issue**、**1 个 P0**、**24 个 P1**、**21 个 P2**、**12 个 P3**。
- 当前下一步不应继续新功能开发；应进入 **Stabilization R0：issue 基线确认 + P0/P1 清零**。
- 真正阻断移动端发布的是 **#44 BottomNav 与 main 横排争宽**。
- #3 / #4 在当前分支历史中已有 `2226391 fix(content): close expert audit p1 findings` 修复证据，但 GitHub 仍 open，应走“复核后关闭”，不要重复开发。
- #20 与 #58 是同一类 `token-cost-spike` prefix/权限口径问题，应合并处理，修复后关闭重复项。

执行更新：

- 2026-06-28：已对 #3 / #4 补充验证评论并关闭，GitHub open issue 从 61 降为 59。
- 2026-06-28：Stabilization R0 第一批已修复 #44、#9、#10/#12/#13、#14-#20、#45-#47、#54/#55、#57/#58、#61/#62，待提交落地后批量关闭。

## 2. Open Issue 统计

| 维度 | 数量 |
|---|---:|
| Audit / Tracking | 3 |
| P0 | 1 |
| P1 | 24 |
| P2 | 21 |
| P3 | 12 |
| **合计** | **61** |

按领域：

| 领域 | 数量 |
|---|---:|
| Content | 27 |
| UI | 11 |
| UX | 10 |
| Architecture | 10 |
| Audit / Tracking | 3 |

## 3. P0 / P1 队列

### P0

| Issue | 结论 | 建议 |
|---|---|---|
| #44 `[P0][UX] MO-01: BottomNav 与 main 横排争宽，移动端布局缺陷` | 唯一 P0，移动端发布阻断 | 第一优先级修复并做 390x844 浏览器复验 |

### P1：应先验真再进入修复

| Issue | 类型 | Triage |
|---|---|---|
| #3 Trace/Tool Calling 敏感数据最小化 | 历史 P1 | 当前分支已有修复证据，复核后关闭 |
| #4 Session 亲和与上下文连续性 | 历史 P1 | 当前分支已有修复证据，复核后关闭 |
| #9 Header 面包屑未覆盖 `/scenarios` | 架构/UX | 小修，进入第一批 |
| #10 warning-soft token 缺失 | UI | 与 #12/#13/#21/#22 合并修 |
| #11 动画画布硬编码 | UI | 体量大，建议降为 R1 polish，不进首批发布阻断 |
| #12 Profile danger 棕色文本 | UI | 并入 token 批次 |
| #13 ScenarioPage metricCard 状态色 | UI | 并入 token 批次 |
| #14 12 道诊断题最长选项即正确 | 内容 | 第一批内容修复，需内容复核 |
| #15 cost-routing 干扰项荒谬 | 内容 | 并入诊断题修复批 |
| #16 maas 干扰项荒谬 | 内容 | 并入诊断题修复批 |
| #17 sla 双重结构泄漏 | 内容 | 并入诊断题修复批 |
| #18 permission-governance 双重泄漏 | 内容 | 并入诊断题修复批 |
| #19 ttft 多选题干直接映射 | 内容 | 并入诊断题修复批 |
| #20 token-cost-spike prefix 口径 | 内容/场景 | 与 #58 合并修 |
| #45 ScenariosPage 筛选零结果无空态 | UX | 小修，进入第一批 |
| #46 全站缺 `:focus-visible` | A11Y | 小修，进入第一批 |
| #47 ExplanationPanel 无 `aria-live` | A11Y | 小修，进入第一批 |
| #54 multi-agent 决策手册混入仓库协作用语 | 内容 | 第一批内容修复 |
| #55 agent-loop 摘要循环顺序错误 | 内容 | 小修，进入第一批 |
| #57 rag-answer-quality 指标不一致 | 内容/场景 | 第一批内容修复 |
| #58 token-cost-spike prefix 与权限边界混写 | 内容/场景 | 与 #20 重复/同根，合并 |
| #61 agents-md definition 被截断 | 内容 | 第一批内容修复 |
| #62 positional-encoding pitfalls 第4条重复 | 内容 | 第一批内容修复 |
| #63 Glossary 三条术语无同名讲 | 内容/IA | 需要产品口径，先不强改 |

## 4. 去重与状态判断

| Issue | 判断 | 处理 |
|---|---|---|
| #3 / #4 | 当前分支已有 `2226391` 修复，且 `reports/content-p1-repair-review-20260628.md` 标注已关闭 | 复跑校验后在 GitHub 评论证据并关闭 |
| #20 / #58 | 同根问题：`token-cost-spike` 中 prefix 与权限/cache key 命名空间混写 | 合并为一次内容修改，关闭两个 issue 或关闭一个为 duplicate |
| #10 / #12 / #13 / #21 / #22 | 同根问题：warning/progress 状态色 token 缺口 | 合并为一次 UI token 修复 |
| #8 / #43 / #66 | 审计跟踪类，不是 bug | 保留为 tracking 或在基线完成后关闭 |

## 5. 推荐执行顺序

### Stabilization R0-A：基线验真（半天）

1. 确认 GitHub issue 全量列表与本地 `reports/issue-tickets-*.md` 一致。
2. 给 #3/#4 补验证评论并关闭。
3. 标记 #20/#58、#10/#12/#13/#21/#22 的合并关系。
4. 输出发布阻断清单：P0 + 确认仍有效的 P1。

### Stabilization R0-B：P0 + 低风险 P1 修复（1 天）

优先修可局部验证、低争议的问题：

1. #44 BottomNav 移动端布局。
2. #9 `/scenarios` 面包屑。
3. #45 筛选零结果空态。
4. #46 `:focus-visible`。
5. #47 `aria-live`。
6. #10/#12/#13/#21/#22 warning/progress token 最小收口。

### Stabilization R0-C：内容 P1 修复（1-2 天）

按内容流水线处理：

1. 诊断题批次：#14-#19。
2. 场景口径：#20/#58、#57。
3. 决策手册：#54/#55。
4. 56 讲正文：#61/#62。
5. #63 Glossary IA 先出方案，Owner 确认后再改。

### Stabilization R0-D：回归与关闭（半天）

必须跑：

```bash
cmd /c npm run validate:content
cmd /c npm run typecheck
cmd /c npm run lint
cmd /c npm run build
```

浏览器回归：

- `/`
- `/scenarios`
- 五个 `/scenarios/:id`
- `/profile`
- `/search`
- 移动端 `390x844`
- 诊断题正确/错误路径
- LocalStorage 迁移与清空记录

## 6. 不建议现在做的事

- 不做 Scenario R3。
- 不做完整 PWA。
- 不做桌面正式发行。
- 不做大规模动画 token 重构作为发布阻断；#11 可单独排 R1 polish。
- 不把全部 61 个 issue 都当本轮必须清零，P2/P3 应进入 backlog。

## 7. 本轮 Definition of Done

- P0 = 0。
- 经确认仍有效的 P1 全部修复或明确降级/延期。
- #3/#4 这类已修但未关闭 issue 完成 GitHub 状态收口。
- 四门禁全 PASS。
- 移动端核心路径完成真实浏览器复验。
- 新增 `reports/stabilization-r0-summary-20260628.md` 与浏览器回归报告。
