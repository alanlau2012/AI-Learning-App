## 元信息
- **本地 ID**：ARCH-P3-05
- **优先级**：P3
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.6
- **GitHub**：#38
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

scenarioSimulation.ts 883 行，多职责单文件接近 1000 行阈值。

## 2. 影响与风险

新增场景类型时改一处易牵连；可维护性。

## 3. 复现步骤

1. wc -l src/utils/scenarioSimulation.ts

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 行数（规模） | <500 或分子模块 | 883 行 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `scenarioSimulation.ts`
  > 883 行多职责

## 6. 根因定位

AGENTS.md §8 可维护性

## 7. 最小修复方向

拆分为 routing/genericDelta/review 子模块

## 8. 验收标准

- [ ] 单文件职责清晰

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（历史 backlog）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
