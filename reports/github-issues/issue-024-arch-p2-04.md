## 元信息
- **本地 ID**：ARCH-P2-04
- **优先级**：P2
- **角度**：架构
- **来源报告**：reports/issue-tickets-architecture-20260628.md §4.6
- **GitHub**：#24
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

conceptById / scenarioById 在 ConceptPage、ScenarioPage、ProfilePage、ScenariosPage 四处重复 `new Map(...)`。

## 2. 影响与风险

字段变更需多处同步；违反 DRY。

## 3. 复现步骤

1. Grep `new Map(concepts.map` 与 `scenarioExercises.map`

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| byId（来源） | data 层唯一导出 | 4 处重复构造 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- Grep：4 处重复 Map 构造

## 6. 根因定位

data 层未暴露 conceptById

## 7. 最小修复方向

在 conceptNav.ts 或 conceptIndex.ts 暴露唯一 byId 映射。

## 8. 验收标准

- [ ] 页面不再 local new Map
- [ ] Grep 仅 data 层构造

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
