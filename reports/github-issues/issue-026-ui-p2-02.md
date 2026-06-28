## 元信息
- **本地 ID**：UI-P2-02
- **优先级**：P2
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §4
- **GitHub**：#26
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenariosPage/ScenarioPage 统计大数字使用 serif，design.md 要求指标用 mono。

## 2. 影响与风险

数字可读性与 design.md IBM Plex Mono 规范不一致。

## 3. 复现步骤

1. 访问 `/scenarios`，观察卡片/页内统计数字字体

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 字体（指标） | var(--font-mono) | serif/sans 混用 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![场景页统计数字字体](https://raw.githubusercontent.com/alanlau2012/AI-Learning-App/main/output/qa/issues-20260628/issue-026-scenarios-stats-font.png)


### 5.2 代码 / 内容证据

- `ScenariosPage.module.css / ScenarioPage.module.css`
  > stats strong 字体

## 6. 根因定位

design.md 序号/指标 mono 规范

## 7. 最小修复方向

stats strong 改 var(--font-mono)

## 8. 验收标准

- [ ] 统计数字为 mono

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
