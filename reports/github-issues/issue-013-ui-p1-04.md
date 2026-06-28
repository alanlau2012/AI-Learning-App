## 元信息
- **本地 ID**：UI-P1-04
- **优先级**：P1
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §3
- **GitHub**：#13
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenarioPage metricCard 状态色（better/worse）使用 `#bed8ca / #f1d0a8 / #fff7ea` 硬编码。

## 2. 影响与风险

场景指标对比色与 progress/warning token 不一致；调整全站色板时此处易遗漏。

## 3. 复现步骤

1. 访问 `/scenarios/rag-answer-quality`
2. 展开指标对比 metricCard（better/worse 状态）
3. DevTools 检查 background/border 色值

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| metricCard（色来源） | tokens.css success/warning soft | 三处 hex 硬编码 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![ScenarioPage metricCard 硬编码色](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-013-scenario-metrical-hardcode.png)


### 5.2 代码 / 内容证据

- `src/pages/ScenarioPage.module.css:133,138,139`
  > #bed8ca / #f1d0a8 / #fff7ea

## 6. 根因定位

AGENTS.md §5.3；ScenarioPage 局部状态色未 token 化。

## 7. 最小修复方向

并入 UI-P1-01 warning/progress token 体系。

## 8. 验收标准

- [ ] metricCard 使用 var(...)
- [ ] 无 #bed8ca 等硬编码

## 9. 关联 issue

- 同源 / 相关：#10、#21

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：ScenarioPage.module.css 局部 hex 仍在。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
