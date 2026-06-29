## 元信息
- **本地 ID**：CONTENT-P3-02
- **优先级**：P3
- **角度**：内容·诊断题
- **来源报告**：reports/issue-tickets-content-diag-20260628.md §3
- **GitHub**：#42
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

demoConcepts.ts 部分 concept JSON 缩进深度不一致（M3 系列等）。

## 2. 影响与风险

代码风格；不影响运行。

## 3. 复现步骤

1. 打开 demoConcepts.ts 对比 M3 vs 其他缩进

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| 格式（缩进） | 2 空格统一 | 部分过深 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `demoConcepts.ts`
  > 缩进不统一

## 6. 根因定位

合入风格

## 7. 最小修复方向

主开发合入时统一格式

## 8. 验收标准

- [ ] 缩进一致

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**（风格项）。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
