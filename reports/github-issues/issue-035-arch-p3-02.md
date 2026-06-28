## 元信息
- **本地 ID**：ARCH-P3-02
- **优先级**：P3
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.3
- **GitHub**：#35
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

completeScenario 完成时自动加入 reviewScenarioIds，「完成」与「复盘」耦合。

## 2. 影响与风险

用户无法只完成而不进复盘队列（设计可议）。

## 3. 复现步骤

1. 完成一场景
2. 观察 Profile 复盘队列是否自动增加

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 语义（完成） | 可分离或文档说明 | 完成即入复盘 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `progressStore.ts:74-83`
  > completeScenario 耦合复盘

## 6. 根因定位

状态动作语义

## 7. 最小修复方向

注释写清或拆开 toggleReview

## 8. 验收标准

- [ ] 行为有文档或 UI 显式控制

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（设计偏好）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
