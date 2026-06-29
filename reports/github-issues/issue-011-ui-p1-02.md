## 元信息
- **本地 ID**：UI-P1-02
- **优先级**：P1
- **角度**：UI 视觉
- **来源报告**：reports/issue-tickets-uiux-visual-20260628.md §3
- **GitHub**：#11
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

动画组件 CSS（animation/*.module.css）约 230 处画布配色硬编码（#1a1916、#f7f3ea 等），未走 tokens.css。

## 2. 影响与风险

动画暗色主题无法全站统一调整；与 design.md 暖纸色体系割裂。

## 3. 复现步骤

1. Grep：`rg "#[0-9a-fA-F]{3,8}" src/components/animation --glob "*.module.css" | wc -l`
2. 打开含动画的知识点页观察画布背景

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 动画色板（来源） | tokens.css --anim-canvas-* | ~230 处 module.css 硬编码 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- Grep：src/components/animation/*.module.css 多处 #1a1916 / #f7f3ea / #8ea2ff

## 6. 根因定位

AGENTS.md §5.3；历史动画色板未登记 token。

## 7. 最小修复方向

tokens.css 增加 --anim-canvas-bg / --anim-canvas-accent 等系列，分批替换。

## 8. 验收标准

- [ ] animation CSS 硬编码色显著减少
- [ ] validate 与 typecheck PASS

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**：属 backlog 大工作量项，建议单开 polish 回合。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
