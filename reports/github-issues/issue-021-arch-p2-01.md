## 元信息
- **本地 ID**：ARCH-P2-01
- **优先级**：P2
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.4
- **GitHub**：#21
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

ScenarioPage metricCard 状态色硬编码（同 UI-P1-04）。

## 2. 影响与风险

架构层登记为 P2，与 UI 视觉 P1 同源。

## 3. 复现步骤

1. 同 #13

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 色（来源） | tokens | hex 硬编码 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![同 #13](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-013-scenario-metrical-hardcode.png)


### 5.2 代码 / 内容证据

- `ScenarioPage.module.css:133-139`
  > 同 #13

## 6. 根因定位

AGENTS.md §5.3

## 7. 最小修复方向

同 #10/#13 token 收口

## 8. 验收标准

- [ ] 同 #13

## 9. 关联 issue

- 同源 / 相关：#10、#13

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
