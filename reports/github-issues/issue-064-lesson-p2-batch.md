## 元信息
- **本地 ID**：LESSON-P2-BATCH
- **优先级**：P2
- **角度**：内容·56讲
- **来源报告**：reports/issue-tickets-content-lessons-20260628.md §3 P2
- **GitHub**：#64
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

56讲正文 v2 流水线 P2 polish 批次（8 讲模板定义、Glossary 漂移、pitfalls 丢失等）。

## 2. 影响与风险

内容 polish backlog。

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

- `content-lessons §3 P2`
  > 8讲模板/Glossary 15条

### 5.3 批次子项 checklist

- [ ] **8讲模板定义**
  - 复现：Grep 模板尾句
  - 证据：demoConcepts
  - 修复：替换流水线模板定义尾句

- [ ] **Glossary 15条**
  - 复现：对比正文 definition
  - 证据：glossary.ts
  - 修复：对齐正文措辞

- [ ] **speculative-decoding**
  - 复现：读 pitfalls
  - 证据：conceptId
  - 修复：补丢失 pitfalls

- [ ] **cache-system**
  - 复现：读 pitfalls
  - 证据：conceptId
  - 修复：修正混写 pitfalls

## 6. 根因定位

批量 issue

## 7. 最小修复方向

按子项改 demoConcepts/glossary

## 8. 验收标准

- [ ] 子项 checkbox

## 9. 关联 issue

- 同源 / 相关：#61、#62、#63

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
