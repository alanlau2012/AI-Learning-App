## 元信息
- **本地 ID**：CONTENT-P2-04
- **优先级**：P2
- **角度**：内容·诊断题/场景
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §4
- **GitHub**：#33
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

trace-not-diagnostic 场景 hash 反查口径可能过弱（应使用带盐/不可逆指纹）。

## 2. 影响与风险

安全/隐私 teaching 口径不严谨。

## 3. 复现步骤

1. 阅读 trace-not-diagnostic 场景 events 中 hash 相关文案

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| hash（口径） | 不可逆指纹 | 可能 plain hash 反查 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `scenarioId: trace-not-diagnostic`
  > hash 反查表述

## 6. 根因定位

场景内容安全口径

## 7. 最小修复方向

改为带盐或不可逆指纹表述

## 8. 验收标准

- [ ] 文案符合敏感数据最小化

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需读 scenario 原文复核。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
