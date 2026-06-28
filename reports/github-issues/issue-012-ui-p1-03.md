## 元信息
- **本地 ID**：UI-P1-03
- **优先级**：P1
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §3
- **GitHub**：#12
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ProfilePage 复盘/告警区使用棕色文本 `#9a520f`，偏离 design.md 告警体系（--color-warning）。

## 2. 影响与风险

「危险/待复盘」语义色与全站告警不一致，降低视觉可信度。

## 3. 复现步骤

1. 启动 dev server，视口 1440×900
2. 访问 `/profile`，完成至少一个场景演练以产生复盘队列
3. 观察「待复盘场景」或 danger 样式文本颜色

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| danger 文本（色值） | var(--color-warning) 体系统一 | #9a520f 硬编码 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![Profile 页 danger 棕色文本](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-012-profile-danger-color.png)


### 5.2 代码 / 内容证据

- `src/pages/ProfilePage.module.css:368`
  > color: #9a520f

## 6. 根因定位

AGENTS.md §5.3；ProfilePage 局部 bypass tokens。

## 7. 最小修复方向

改用 var(--color-warning) 或新增 --color-warning-text。

## 8. 验收标准

- [ ] Profile danger 文本使用 token
- [ ] 与 ExplanationPanel 告警色一致

## 9. 关联 issue

- 同源 / 相关：#10、#22

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：需 DevTools 复核 ProfilePage.module.css。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
