## 元信息
- **本地 ID**：LESSON-P1-03
- **优先级**：P1
- **角度**：内容·56讲/glossary
- **来源报告**：reports/issue-tickets-content-lessons-20260628.md §3
- **GitHub**：#63
- **审计基线 commit**：9a11d694（2026-06-28）
- **完整 commit**：`9a11d6941c1886bb095b26f836e7ec2754999e81`

## 1. 现象描述

Glossary 术语 embedding / rag / model-routing 无同名 KnowledgePoint.id，IA 不对齐。

## 2. 影响与风险

术语页链接悬空或指向别名，读者困惑。

## 3. 复现步骤

1. 访问 `/glossary`
2. 搜索 embedding、rag、model-routing
3. 尝试跳转对应讲

## 4. 期望行为 vs 实际行为

| 维度 | 期望 | 实际（审计时） |
|---|---|---|
| IA（术语→讲） | 同名讲或明确别名 | 无同名 id |

## 5. 证据

### 5.1 截图（UI/UX 类必填）

![Glossary IA 不对齐](https://github.com/alanlau2012/AI-Learning-App/blob/main/output/qa/issues-20260628/issue-063-glossary-ia-mismatch.png)


### 5.2 代码 / 内容证据

- `glossary.ts`
  > embedding/rag/model-routing 无同名讲
- `建议别名`
  > semantic-space / prompt-context / multi-model-routing

## 6. 根因定位

Glossary 与 56 讲登记表未对齐

## 7. 最小修复方向

标注术语索引项或别名映射

## 8. 验收标准

- [ ] 术语可导航到对应讲或说明无独立讲

## 9. 关联 issue

- 同源 / 相关：无

## 10. 当前代码复核（2026-06-28 执行时填写）

**仍复现**。

---
来源: v2 移交接手模板 | `docs/issue-handover-template.md` | 生成: `scripts/generate-github-issue-bodies.mjs`
