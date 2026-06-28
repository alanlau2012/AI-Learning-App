import { capabilityDomainLabels } from '../data/capabilityDomains';
import { glossary } from '../data/glossary';
import { scenarioExercises } from '../data/scenarioExercises';
import type { CapabilityDomain, GlossaryTerm, KnowledgePoint, ScenarioExercise } from '../types';
import { isMechanismGrouped } from '../types';
import { isPublishedConcept } from './progress';

export type SearchDomainFilter = CapabilityDomain | 'all';

export interface SearchConceptOptions {
  query: string;
  selectedDomain?: SearchDomainFilter;
  limit?: number;
}

export interface SearchResult {
  concept: KnowledgePoint;
  score: number;
  reason: string;
  domainMatch?: 'primary' | 'secondary';
}

function includes(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

function mechanismTexts(concept: KnowledgePoint): string[] {
  if (isMechanismGrouped(concept.mechanism)) {
    return concept.mechanism.flatMap((g) => [g.title, ...g.items]);
  }
  return concept.mechanism;
}

function textFields(concept: KnowledgePoint): string[] {
  return [
    concept.definition,
    ...mechanismTexts(concept),
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

function decisionGuideTexts(concept: KnowledgePoint): string[] {
  const guide = concept.decisionGuide;
  if (!guide) return [];

  return [
    ...guide.applicableScenarios.flatMap((item) => [
      item.title,
      item.description,
      ...item.signals,
    ]),
    ...guide.nonApplicableScenarios.flatMap((item) => [
      item.title,
      item.description,
      ...item.signals,
    ]),
    ...guide.decisionSignals.flatMap((item) => [
      item.metricOrFact,
      item.threshold ?? '',
      item.interpretation,
      item.evidenceSource,
    ]),
    ...guide.tradeoffs.flatMap((item) => [
      item.dimension,
      item.gain,
      item.cost,
      item.watchOut,
    ]),
    ...guide.reviewQuestions.flatMap((item) => [
      item.question,
      item.whyAsk,
      ...item.goodAnswerSignals,
    ]),
    ...guide.implementationChecklist.flatMap((item) => [
      item.phase,
      item.item,
      item.passSignal,
    ]),
    guide.executiveExplanation.summary,
    guide.executiveExplanation.businessValue,
    guide.executiveExplanation.mainRisk,
    guide.executiveExplanation.riskControl,
  ];
}

function domainTexts(concept: KnowledgePoint): string[] {
  const domains = concept.capabilityDomains;
  if (!domains) return [];

  const values = [domains.primary, domains.secondary].filter(
    (domain): domain is CapabilityDomain => Boolean(domain),
  );

  return values.flatMap((domain) => [domain, capabilityDomainLabels[domain]]);
}

function glossaryTermsForConcept(concept: KnowledgePoint): GlossaryTerm[] {
  return glossary.filter((term) => term.relatedConceptIds.includes(concept.id));
}

function glossaryDomainTexts(term: GlossaryTerm): string[] {
  return (term.capabilityDomains ?? []).flatMap((domain) => [
    domain,
    capabilityDomainLabels[domain],
  ]);
}


function glossaryTermHasDomain(term: GlossaryTerm, selectedDomain: CapabilityDomain): boolean {
  return Boolean(term.capabilityDomains?.includes(selectedDomain));
}

function hasGlossaryDomainMatch(
  concept: KnowledgePoint,
  selectedDomain: SearchDomainFilter,
): boolean {
  if (selectedDomain === 'all') return false;
  return glossaryTermsForConcept(concept).some((term) => glossaryTermHasDomain(term, selectedDomain));
}

function bestGlossaryMatch(concept: KnowledgePoint, query: string): SearchResult | null {
  const matches = glossaryTermsForConcept(concept)
    .map((term) => {
      const name = term.name.toLowerCase();
      const enName = term.enName.toLowerCase();
      if (name === query || enName === query) {
        return { score: 76, reason: `术语完全匹配：${term.name}` };
      }
      if (name.includes(query) || enName.includes(query)) {
        return { score: 58, reason: `术语匹配：${term.name}` };
      }
      if ((term.tags ?? []).some((tag) => includes(tag, query))) {
        return { score: 57, reason: `术语标签匹配：${term.name}` };
      }
      if (glossaryDomainTexts(term).some((field) => includes(field, query))) {
        return { score: 53, reason: `术语能力域匹配：${term.name}` };
      }
      if ((term.confusedWith ?? []).some((item) => includes(item, query))) {
        return { score: 48, reason: `术语易混点匹配：${term.name}` };
      }
      if (includes(term.definition, query)) {
        return { score: 45, reason: `术语定义匹配：${term.name}` };
      }
      return null;
    })
    .filter((item): item is { score: number; reason: string } => Boolean(item))
    .sort((a, b) => b.score - a.score);

  const best = matches[0];
  if (!best) return null;

  return {
    concept,
    score: best.score,
    reason: best.reason,
  };
}

function domainMatch(
  concept: KnowledgePoint,
  selectedDomain: SearchDomainFilter,
): SearchResult['domainMatch'] {
  if (selectedDomain === 'all' || !concept.capabilityDomains) return undefined;
  if (concept.capabilityDomains.primary === selectedDomain) return 'primary';
  if (concept.capabilityDomains.secondary === selectedDomain) return 'secondary';
  return undefined;
}

function normalizeSearchArgs(
  optionsOrQuery: SearchConceptOptions | string,
  legacyLimit: number,
): Required<SearchConceptOptions> {
  if (typeof optionsOrQuery === 'string') {
    return {
      query: optionsOrQuery,
      selectedDomain: 'all',
      limit: legacyLimit,
    };
  }

  return {
    query: optionsOrQuery.query,
    selectedDomain: optionsOrQuery.selectedDomain ?? 'all',
    limit: optionsOrQuery.limit ?? legacyLimit,
  };
}

function availabilitySuffix(concept: KnowledgePoint): string {
  return isPublishedConcept(concept) ? '' : ' · 即将上线';
}

function availabilityScore(concept: KnowledgePoint): number {
  return isPublishedConcept(concept) ? 0 : -35;
}

function domainScoreBoost(match: SearchResult['domainMatch']): number {
  if (match === 'primary') return 6;
  if (match === 'secondary') return 3;
  return 0;
}

function domainBrowseResult(
  concept: KnowledgePoint,
  selectedDomain: CapabilityDomain,
): SearchResult | null {
  const match = domainMatch(concept, selectedDomain);
  const glossaryMatch = hasGlossaryDomainMatch(concept, selectedDomain);
  if (!match && !glossaryMatch) return null;

  const label = capabilityDomainLabels[selectedDomain];
  const reason = match === 'primary'
    ? `主能力域：${label}`
    : match === 'secondary'
      ? `相关能力域：${label}`
      : `术语能力域：${label}`;

  return {
    concept,
    score: domainScoreBoost(match) + (glossaryMatch ? 2 : 0) + availabilityScore(concept),
    reason: `${reason}${availabilitySuffix(concept)}`,
    domainMatch: match,
  };
}

function textSearchResult(
  concept: KnowledgePoint,
  query: string,
  selectedDomain: SearchDomainFilter,
): SearchResult | null {
  const title = concept.title.toLowerCase();
  const match = domainMatch(concept, selectedDomain);
  const scoreBoost = domainScoreBoost(match) + availabilityScore(concept);
  const reasonSuffix = availabilitySuffix(concept);

  if (title === query) {
    return {
      concept,
      score: 100 + scoreBoost,
      reason: `标题完全匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }
  if (title.includes(query)) {
    return {
      concept,
      score: 80 + scoreBoost,
      reason: `标题匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }

  const glossaryMatch = bestGlossaryMatch(concept, query);
  if (glossaryMatch && glossaryMatch.score >= 58) {
    return {
      ...glossaryMatch,
      score: glossaryMatch.score + scoreBoost,
      reason: `${glossaryMatch.reason}${reasonSuffix}`,
      domainMatch: match,
    };
  }

  if (concept.tags.some((tag) => includes(tag, query))) {
    return {
      concept,
      score: 60 + scoreBoost,
      reason: `标签匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }
  if (domainTexts(concept).some((field) => includes(field, query))) {
    return {
      concept,
      score: 55 + scoreBoost,
      reason: `能力域匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }
  if (glossaryMatch) {
    return {
      ...glossaryMatch,
      score: glossaryMatch.score + scoreBoost,
      reason: `${glossaryMatch.reason}${reasonSuffix}`,
      domainMatch: match,
    };
  }
  if (decisionGuideTexts(concept).some((field) => includes(field, query))) {
    return {
      concept,
      score: 50 + scoreBoost,
      reason: `工程决策匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }
  if (textFields(concept).some((field) => includes(field, query))) {
    return {
      concept,
      score: 40 + scoreBoost,
      reason: `正文匹配${reasonSuffix}`,
      domainMatch: match,
    };
  }

  return null;
}

function domainRank(result: SearchResult): number {
  if (result.domainMatch === 'primary') return 0;
  if (result.domainMatch === 'secondary') return 1;
  return 2;
}

function availabilityRank(result: SearchResult): number {
  return isPublishedConcept(result.concept) ? 0 : 1;
}

export function searchConcepts(
  concepts: KnowledgePoint[],
  optionsOrQuery: SearchConceptOptions | string,
  legacyLimit = 12,
): SearchResult[] {
  const { query: rawQuery, selectedDomain, limit } = normalizeSearchArgs(
    optionsOrQuery,
    legacyLimit,
  );
  const query = rawQuery.trim().toLowerCase();
  const candidates =
    selectedDomain === 'all'
      ? concepts
      : concepts.filter(
          (concept) =>
            Boolean(domainMatch(concept, selectedDomain)) ||
            hasGlossaryDomainMatch(concept, selectedDomain),
        );

  if (!query && selectedDomain === 'all') return [];

  if (!query) {
    return candidates
      .map((concept) => domainBrowseResult(concept, selectedDomain as CapabilityDomain))
      .filter((item): item is SearchResult => Boolean(item))
      .sort(
        (a, b) =>
          availabilityRank(a) - availabilityRank(b) ||
          domainRank(a) - domainRank(b) ||
          a.concept.order - b.concept.order,
      )
      .slice(0, limit);
  }

  return candidates
    .map((concept) => textSearchResult(concept, query, selectedDomain))
    .filter((item): item is SearchResult => Boolean(item))
    .sort(
      (a, b) =>
        b.score - a.score ||
        availabilityRank(a) - availabilityRank(b) ||
        domainRank(a) - domainRank(b) ||
        a.concept.order - b.concept.order,
    )
    .slice(0, limit);
}

export interface SearchScenarioResult {
  scenario: ScenarioExercise;
  score: number;
  reason: string;
}

const SCENARIO_INTENT_TERMS: Record<string, string[]> = {
  'token-cost-spike': ['token 成本', '成本上涨', '成本异常', '成本飙升', '重试风暴', '缓存缺失', '上下文膨胀', '低 roi'],
  'rag-answer-quality': ['rag 答案差', '答案质量', '召回正常', '引用错误', '事实错误', '上下文冲突', '旧政策', '无来源回答'],
};

function scenarioTextFields(scenario: ScenarioExercise): string[] {
  return [
    scenario.title,
    scenario.subtitle ?? '',
    scenario.background,
    scenario.initialSymptom ?? '',
    ...(scenario.capabilityDomains ?? []),
    ...scenario.relatedConceptIds,
    ...scenario.entryConceptIds,
    ...(scenario.facts ?? []).flatMap((fact) => [
      fact.title,
      fact.description,
      ...(fact.risks ?? []),
      ...fact.attributes.flatMap((attribute) => [attribute.label, attribute.value]),
    ]),
    ...scenario.strategyControls.flatMap((control) => [
      control.label,
      ...control.options.flatMap((option) => [
        option.label,
        option.description,
        ...option.metricEffects.map((effect) => effect.explanation),
      ]),
    ]),
    ...scenario.events.flatMap((event) => [
      event.title,
      event.symptom,
      event.correctDiagnosis,
      ...event.relatedConceptIds,
    ]),
  ];
}

function scenarioIntentScore(scenario: ScenarioExercise, query: string): SearchScenarioResult | null {
  const title = scenario.title.toLowerCase();
  if (title.includes(query)) {
    return { scenario, score: 92, reason: '场景标题匹配' };
  }

  const terms = SCENARIO_INTENT_TERMS[scenario.id] ?? [];
  const matchedTerm = terms.find((term) => {
    const normalized = term.toLowerCase();
    return normalized.includes(query) || query.includes(normalized);
  });
  if (matchedTerm) {
    return { scenario, score: 86, reason: `场景意图匹配：${matchedTerm}` };
  }

  if (scenarioTextFields(scenario).some((field) => includes(field, query))) {
    return { scenario, score: 62, reason: '场景内容匹配' };
  }

  return null;
}

export function searchScenarios(options: {
  query: string;
  selectedDomain?: SearchDomainFilter;
  limit?: number;
}): SearchScenarioResult[] {
  const query = options.query.trim().toLowerCase();
  const selectedDomain = options.selectedDomain ?? 'all';
  const limit = options.limit ?? 6;

  if (!query) return [];

  return scenarioExercises
    .filter((scenario) => selectedDomain === 'all' || scenario.capabilityDomains?.includes(selectedDomain))
    .map((scenario) => scenarioIntentScore(scenario, query))
    .filter((item): item is SearchScenarioResult => Boolean(item))
    .sort((a, b) => b.score - a.score || a.scenario.id.localeCompare(b.scenario.id))
    .slice(0, limit);
}