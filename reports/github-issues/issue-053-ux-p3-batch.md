## 元信息
- **本地 ID**：UX-P3-BATCH
- **优先级**：P3
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3 P3
- **GitHub**：#53
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

多条 UI 交互 polish 项合并为一批次 issue，原正文不可执行。

## 2. 影响与风险

backlog polish；不阻断发布。

## 3. 复现步骤

1. 逐项见 §5 checklist

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 批次（可执行性） | 子项可独立验收 | 原正文一句话 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `uiux-interaction §3 P3`
  > IF-04/07/08 等

### 5.3 批次子项 checklist

- [ ] **IF-04**
  - 复现：复制进度文案
  - 证据：uiux-interaction
  - 修复：copy 按钮加 live 播报

- [ ] **IF-07**
  - 复现：Profile 移除复盘
  - 证据：ProfilePage
  - 修复：破坏性操作加 confirm

- [ ] **IF-08**
  - 复现：Header 统计 nowrap
  - 证据：Header.module.css
  - 修复：progressStats 换行策略

- [ ] **ES-03**
  - 复现：场景卡片键盘
  - 证据：ScenariosPage
  - 修复：卡片 focus 顺序

- [ ] **MO-03**
  - 复现：safe-area
  - 证据：BottomNav
  - 修复：env(safe-area-inset-bottom)

- [ ] **MO-04**
  - 复现：横屏
  - 证据：390×844 landscape
  - 修复：横屏 BottomNav 复验

- [ ] **A11Y-08**
  - 复现：Skip link
  - 证据：AppShell
  - 修复：可选 skip to content

- [ ] **A11Y-09**
  - 复现：reduced-motion
  - 证据：animation
  - 修复：prefers-reduced-motion

- [ ] **SC-04**
  - 复现：Scenario 步骤
  - 证据：ScenarioPage
  - 修复：步骤区 heading 层级

- [ ] **SC-05**
  - 复现：复盘队列
  - 证据：ProfilePage
  - 修复：空态文案

- [ ] **SC-06**
  - 复现：完成 toast
  - 证据：ScenarioPage
  - 修复：完成反馈（可选）

## 6. 根因定位

批量 create issue 压缩过多子项

## 7. 最小修复方向

按 checklist 逐项 polish

## 8. 验收标准

- [ ] 各子项 checkbox 可独立关闭

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（polish backlog）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
