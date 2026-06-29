## 元信息
- **本地 ID**：CONTENT-P1-06
- **优先级**：P1
- **角度**：内容·诊断题/场景
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §4
- **GitHub**：#20
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

token-cost-spike 场景 retry-cache-storm 的 nextStepRecommendations 写「按权限边界…标准化 prefix」，权限不应作为 prefix 组成部分。

## 2. 影响与风险

误导 cache 设计：权限变化会导致 prefix 失效、命中率反降。

## 3. 复现步骤

1. 打开 `src/data/scenarioExercises.ts`
2. 搜索 retry-cache-storm → nextStepRecommendations
3. 阅读 prefix / 权限边界表述

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| prefix（口径） | 权限作 cache key 命名空间，prefix 只承载稳定提示 | 权限边界写入 prefix 建议 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `scenarioId: token-cost-spike / event: retry-cache-storm`
  > nextStepRecommendations 含「权限边界」与 prefix 混写

## 6. 根因定位

场景复盘建议技术口径不严谨。

## 7. 最小修复方向

改为「租户/权限作 cache key 命名空间隔离，prefix 只承载稳定系统提示与任务模板」。

## 8. 验收标准

- [ ] nextStepRecommendations 不再把权限写进 prefix
- [ ] 与 #58 一并验收

## 9. 关联 issue

- 同源 / 相关：#58

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需 Grep scenarioExercises 复核原文。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
