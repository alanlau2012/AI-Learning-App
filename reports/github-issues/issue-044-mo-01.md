## 元信息
- **本地 ID**：MO-01
- **优先级**：P0
- **角度**：UI 交互
- **来源报告**：reports/issue-tickets-uiux-interaction-20260628.md §3
- **GitHub**：#44
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

审计时 AppShell `.shell` flex-row 下 BottomNav 与 main 横排争宽，非全宽底栏；窄屏主内容可被压至约 50% 视口。

## 2. 影响与风险

**唯一 P0**：移动端主导航可用性存疑，阻断对外承诺响应式体验。

## 3. 复现步骤

1. 启动：`scripts\start-local.cmd web`
2. 视口：**390×844**
3. 访问任意页如 `/` 或 `/scenarios`
4. 观察 BottomNav 是否全宽贴底、主内容是否被横向压缩

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 布局（BottomNav） | fixed 全宽底栏 | 审计时与 main 横排争宽 |
| padding（内容区） | padding-bottom ≥56px | 审计时可能不足 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![390×844 BottomNav 布局](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-044-mobile-bottomnav-layout.png)


### 5.2 代码 / 内容证据

- `AppShell.tsx / BottomNav.module.css（审计基线）`
  > shell flex-row + BottomNav 非 fixed 全宽
- `当前 AppShell.tsx:16-22`
  > BottomNav 已移入 .main 列；BottomNav.module.css position:fixed width:100%

## 6. 根因定位

design.md §3 移动布局；AppShell flex 结构错误（审计基线）。

## 7. 最小修复方向

BottomNav fixed 全宽 + content padding-bottom ≥56px（或移入 main 列底部）。

## 8. 验收标准

- [ ] 390×844 下 BottomNav 全宽贴底
- [ ] 主内容不被横向压缩
- [ ] 截图对比审计基线

## 9. 关联 issue

- 同源 / 相关：#52

## 10. 当前代码复核（2026-06-28 执行时填写）

**已修复**：当前 BottomNav 在 .main 内且 `position:fixed; width:100%`；AppShell.content 移动端 padding-bottom:80px。验收应 PASS。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
