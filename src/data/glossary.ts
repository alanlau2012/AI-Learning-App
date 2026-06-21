import type { GlossaryTerm } from '../types';

/**
 * 术语索引（GlossaryPage 数据源）。骨架阶段为空，
 * 待内容 Agent 产出术语后按 docs/content-schema.md §1 的 GlossaryTerm 合入。
 * relatedConceptIds 必须指向已存在的 KnowledgePoint.id（由 validate:structure 校验）。
 */
export const glossary: GlossaryTerm[] = [];
