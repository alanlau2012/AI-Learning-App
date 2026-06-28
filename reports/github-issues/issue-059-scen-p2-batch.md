## 元信息
- **本地 ID**：SCEN-P2-BATCH
- **优先级**：P2
- **角度**：内容·场景
- **来源报告**：reports/issue-tickets-content-scenarios-20260628.md §3 P2
- **GitHub**：#59
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

场景+角色路径 P2 polish 批次。

## 2. 影响与风险

内容与 IA polish。

## 3. 复现步骤

1. 逐项 §5

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 批次（子项） | 可执行 | 一句话 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `content-scenarios §3 P2`
  > DEV 票号/路径缺口

### 5.3 批次子项 checklist

- [ ] **model-router**
  - 复现：读背景 narrative
  - 证据：scenarioExercises
  - 修复：删除 DEV-06/07/08 内部票号

- [ ] **platformEngineer**
  - 复现：读 rolePath 覆盖
  - 证据：rolePaths.ts
  - 修复：补 cost-routing/trace 讲

- [ ] **applicationArchitect**
  - 复现：读 rolePath
  - 证据：rolePaths.ts
  - 修复：补 permission-governance/trace

- [ ] **路径覆盖**
  - 复现：统计 22 讲缺口
  - 证据：content-scenarios
  - 修复：补路径或标注 optional

- [ ] **agent-tool-failure**
  - 复现：失败样本占比
  - 证据：scenario events
  - 修复：调整失败样本比例文案

## 6. 根因定位

批量 issue

## 7. 最小修复方向

按子项改 scenarioExercises / rolePaths

## 8. 验收标准

- [ ] 子项 checkbox

## 9. 关联 issue

- 同源 / 相关：#57

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
