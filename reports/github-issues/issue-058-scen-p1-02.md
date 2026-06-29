## 元信息
- **本地 ID**：SCEN-P1-02
- **优先级**：P1
- **角度**：内容·场景
- **来源报告**：reports/issue-tickets-content-scenarios-20260628.md §3
- **GitHub**：#58
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

token-cost-spike 场景 retry-cache-storm 建议把权限边界写入 prefix（同 #20）。

## 2. 影响与风险

误导 cache 架构决策。

## 3. 复现步骤

1. 同 #20

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| prefix（口径） | 命名空间隔离 | 权限进 prefix |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `scenarioId: token-cost-spike`
  > 同 CONTENT-P1-06

## 6. 根因定位

场景 nextStepRecommendations 口径

## 7. 最小修复方向

同 #20

## 8. 验收标准

- [ ] 同 #20

## 9. 关联 issue

- 同源 / 相关：#20

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
