import type { KnowledgePoint } from '../types';

export interface SearchResult {
  concept: KnowledgePoint;
  score: number;
  reason: string;
}

function includes(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

function textFields(concept: KnowledgePoint): string[] {
  return [
    concept.definition,
    ...concept.mechanism,
    concept.enterpriseCase.title,
    concept.enterpriseCase.scenario,
    concept.enterpriseCase.problem,
    concept.enterpriseCase.analysis,
    concept.enterpriseCase.solution,
    concept.enterpriseCase.takeaway,
    ...concept.pitfalls,
    concept.diagnosticQuestion?.scenario ?? '',
    concept.diagnosticQuestion?.question ?? '',
  ];
}

export function searchConcepts(
  concepts: KnowledgePoint[],
  rawQuery: string,
  limit = 12,
): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  return concepts
    .map((concept): SearchResult | null => {
      const title = concept.title.toLowerCase();
      if (title === query) return { concept, score: 100, reason: '标题完全匹配' };
      if (title.includes(query)) return { concept, score: 80, reason: '标题匹配' };
      if (concept.tags.some((tag) => includes(tag, query))) {
        return { concept, score: 60, reason: '标签匹配' };
      }
      if (textFields(concept).some((field) => includes(field, query))) {
        return { concept, score: 40, reason: '正文匹配' };
      }
      return null;
    })
    .filter((item): item is SearchResult => Boolean(item))
    .sort((a, b) => b.score - a.score || a.concept.order - b.concept.order)
    .slice(0, limit);
}
