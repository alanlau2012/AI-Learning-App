## 元信息
- **本地 ID**：LESSON-P3-BATCH
- **优先级**：P3
- **角度**：内容·56讲
- **来源报告**：reports/issue-tickets-content-lessons-20260628.md §3 P3
- **GitHub**：#65
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

56讲低优先级 polish：Token 大小写、Glossary 自引用、prefix-cache 搜索别名等。

## 2. 影响与风险

极低优先级 polish。

## 3. 复现步骤

1. 逐项 §5

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| Token（大小写） | 统一 | 混用 |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

_本 issue 以代码/原文证据为主，无 UI 截图要求。_


### 5.2 代码 / 内容证据

- `content-lessons §3 P3`
  > 大小写/自引用

### 5.3 批次子项 checklist

- [ ] **Token 大小写**
  - 复现：Grep Token/token
  - 证据：demoConcepts
  - 修复：统一 product 口径

- [ ] **Glossary 自引用**
  - 复现：读 glossary 条目
  - 证据：glossary.ts
  - 修复：清理自引用 loop

- [ ] **prefix-cache 别名**
  - 复现：Search prefix-cache
  - 证据：search.ts
  - 修复：补搜索别名

## 6. 根因定位

批量 issue

## 7. 最小修复方向

按子项 polish

## 8. 验收标准

- [ ] 子项 checkbox

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
