## 元信息
- **本地 ID**：IF-06
- **优先级**：P2
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3
- **GitHub**：#51
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenarioPage「恢复基线」为半破坏性操作，无 confirm 确认。

## 2. 影响与风险

误触丢失模拟进度。

## 3. 复现步骤

1. ScenarioPage 点击恢复基线
2. 观察是否弹 confirm

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| confirm（恢复） | confirm 对话框 | 直接执行 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `ScenarioPage.tsx:248-249`
  > 无 confirm

## 6. 根因定位

破坏性操作 UX

## 7. 最小修复方向

加 window.confirm 或统一 Confirm 组件

## 8. 验收标准

- [ ] 恢复前需确认

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
