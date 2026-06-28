## 元信息
- **本地 ID**：SCEN-P3-BATCH
- **优先级**：P3
- **角度**：内容·场景
- **来源报告**：reports/issue-tickets-content-scenarios-20260628.md §3 P3
- **GitHub**：#60
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

场景与能力域低优先级 polish 批次。

## 2. 影响与风险

IA 表述 polish。

## 3. 复现步骤

1. 逐项 §5

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 域归属（token-roi） | 明确 primary | 可商榷 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `content-scenarios §3 P3`
  > 路径 UI 暗示

### 5.3 批次子项 checklist

- [ ] **token-roi 域**
  - 复现：读 capabilityDomains
  - 证据：scenarioExercises
  - 修复：确认 token-roi primary 归属

- [ ] **路径 UI**
  - 复现：Profile 角色路径
  - 证据：ProfilePage
  - 修复：避免暗示路径=全部应学

## 6. 根因定位

批量 issue

## 7. 最小修复方向

按子项调整

## 8. 验收标准

- [ ] 子项 checkbox

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
