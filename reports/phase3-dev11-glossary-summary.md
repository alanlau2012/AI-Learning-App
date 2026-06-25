# Phase 3 DEV-11 Glossary 能力域与混淆概念 Summary

日期：2026-06-25
任务：DEV-11 Glossary 能力域与混淆概念

## 范围

- 增强 `src/data/glossary.ts`：术语从 4 个扩展到 15 个核心术语。
- 为所有新增/既有术语补充 `capabilityDomains`，覆盖 7 个能力域。
- 为 15 个核心术语补充 `confusedWith`，满足“至少 10 个核心术语有常被混淆概念/易混点”。
- 保持 `relatedConceptIds` 全部指向现有 56 讲 Concept id。

## UI

- `GlossaryPage` 从 `term.capabilityDomains` 读取能力域标签，不在页面硬编码能力域文案。
- 展示“常被混淆”列表，仅在 `confusedWith` 有数据时渲染。
- 相关知识点链接保持 `/concepts/:slug` 路由；若目标知识点存在 `decisionGuide`，链接追加 `#decision-guide`，不破坏现有路由。

## Search

- `src/utils/search.ts` 纳入 Glossary 术语召回。
- 支持术语名称、英文名、标签、定义、易混点和术语能力域命中。
- 搜索结果仍返回 KnowledgePoint，避免改动 SearchPage 结果形态；术语命中通过关联知识点召回。
- 保留现有概念搜索、工程决策搜索、概念能力域搜索和 domain filter 行为。

## Schema / 校验

- `GlossaryTerm` 新增可选字段：`confusedWith?: string[]`。
- `docs/content-schema.md` 同步字段和 Phase 3 DEV-11 约束。
- `scripts/validate-content.ts` 新增：
  - `GlossaryTerm.confusedWith` 存在时必须为非空字符串数组。
  - Phase 3 DEV-11 至少 10 个术语具备 `confusedWith`。

## 验证

- `cmd /c npm run validate:content`：PASS
- `cmd /c npm run typecheck`：PASS
- `cmd /c npm run lint`：PASS

## 备注

- 运行 typecheck 前发现并行改动中的 `src/utils/progress.ts` 有注释吞掉语句导致 TS1005；已做最小语法修复，恢复原有 fallback return / migrate return / catch close，不改变业务逻辑。