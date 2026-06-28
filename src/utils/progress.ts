/**
 * Profile-level progress calculations.
 *
 * Lightweight persistence and module progress live in progressCore.ts so shell
 * components do not pull full lesson content into the entry chunk.
 */
import type { CapabilityDomain, KnowledgePoint, RolePath, UserProgress } from '../types';
import { capabilityDomainLabels } from '../data/capabilityDomains';
import { concepts } from '../data/concepts';
import { rolePaths } from '../data/rolePaths';
import { scenarioExercises } from '../data/scenarioExercises';
import {
  isPublishedConcept,
  orderedPublishedConceptIds,
} from './progressCore';

const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));

export {
  isPublishedConcept,
  moduleProgress,
  overallProgress,
} from './progressCore';

export type CapabilityConfidence = 'low' | 'medium' | 'high';

export interface CapabilityDomainScore {
  domain: CapabilityDomain;
  label: string;
  completionScore: number;
  diagnosticScore?: number;
  finalScore: number;
  confidence: CapabilityConfidence;
  completedWeightedCount: number;
  totalWeightedCount: number;
  diagnosticWeightedCount: number;
  wrongWeightedCount: number;
  nextConceptId?: string;
}

export interface RolePathPhaseProgress {
  id: string;
  title: string;
  outcome: string;
  done: number;
  total: number;
  percent: number;
  nextConceptId?: string;
}

export interface RolePathProgress {
  id: RolePath['id'];
  title: string;
  goal: string;
  done: number;
  total: number;
  percent: number;
  nextConceptId?: string;
  phases: RolePathPhaseProgress[];
}

export type ProfileActionKind =
  | 'wrongQuestion'
  | 'capabilityGap'
  | 'rolePath'
  | 'review';

export interface ProfileNextAction {
  kind: ProfileActionKind;
  title: string;
  reason: string;
  conceptId: string;
  conceptTitle: string;
  contextLabel?: string;
}

export type WeeklyProfileRecommendationKind =
  | 'nextLesson'
  | 'nextQuestion'
  | 'scenarioExercise'
  | 'reviewFavorite';

export interface WeeklyProfileRecommendation {
  id: string;
  kind: WeeklyProfileRecommendationKind;
  title: string;
  actionLabel: string;
  reason: string;
  conceptId?: string;
  conceptTitle?: string;
  contextLabel?: string;
  scenarioId?: string;
  scenarioTitle?: string;
  scenarioNote?: string;
}

export interface ProfileJudgmentBias {
  id: string;
  title: string;
  severity: 'priority' | 'watch';
  evidence: string;
  suggestedAction: string;
  conceptId?: string;
  conceptTitle?: string;
  domainLabel?: string;
}

function percent(numerator: number, denominator: number): number {
  return denominator > 0 ? Math.round((numerator / denominator) * 100) : 0;
}

function roundWeighted(value: number): number {
  return Math.round(value * 10) / 10;
}

function domainWeight(concept: KnowledgePoint, domain: CapabilityDomain): number {
  if (concept.capabilityDomains?.primary === domain) return 1;
  if (concept.capabilityDomains?.secondary === domain) return 0.5;
  return 0;
}

function sortedDomainScores(scores: CapabilityDomainScore[]): CapabilityDomainScore[] {
  return [...scores].sort((a, b) => {
    if (a.finalScore !== b.finalScore) return a.finalScore - b.finalScore;
    if (a.confidence !== b.confidence) {
      const rank: Record<CapabilityConfidence, number> = { low: 0, medium: 1, high: 2 };
      return rank[a.confidence] - rank[b.confidence];
    }
    return b.totalWeightedCount - a.totalWeightedCount;
  });
}

function getConceptById(conceptId: string | undefined): KnowledgePoint | undefined {
  return conceptId ? conceptById.get(conceptId) : undefined;
}

function getFirstWrongConcept(wrongQuestionIds: string[]): KnowledgePoint | undefined {
  const wrongQuestionSet = new Set(wrongQuestionIds);
  return concepts.find(
    (concept) => concept.diagnosticQuestion && wrongQuestionSet.has(concept.diagnosticQuestion.id),
  );
}

function appendRecommendation(
  recommendations: WeeklyProfileRecommendation[],
  usedConceptIds: Set<string>,
  recommendation: WeeklyProfileRecommendation,
): void {
  if (recommendations.length >= 3) return;
  if (recommendation.conceptId && usedConceptIds.has(recommendation.conceptId)) return;
  recommendations.push(recommendation);
  if (recommendation.conceptId) usedConceptIds.add(recommendation.conceptId);
}

export function capabilityDomainProgress(
  completedConceptIds: string[],
  wrongQuestionIds: string[],
): CapabilityDomainScore[] {
  const completed = new Set(completedConceptIds);
  const wrongQuestions = new Set(wrongQuestionIds);
  const orderedPublishedConcepts = orderedPublishedConceptIds
    .map((id) => conceptById.get(id))
    .filter((concept): concept is KnowledgePoint => Boolean(concept && isPublishedConcept(concept)));

  return (Object.keys(capabilityDomainLabels) as CapabilityDomain[]).map((domain) => {
    let completedWeightedCount = 0;
    let totalWeightedCount = 0;
    let diagnosticWeightedCount = 0;
    let wrongWeightedCount = 0;
    let nextConceptId: string | undefined;

    for (const concept of orderedPublishedConcepts) {
      const weight = domainWeight(concept, domain);
      if (weight === 0) continue;

      totalWeightedCount += weight;
      const isCompleted = completed.has(concept.id);
      if (isCompleted) completedWeightedCount += weight;
      if (!isCompleted && !nextConceptId) nextConceptId = concept.id;

      if (isCompleted && concept.diagnosticQuestion) {
        diagnosticWeightedCount += weight;
        if (wrongQuestions.has(concept.diagnosticQuestion.id)) {
          wrongWeightedCount += weight;
        }
      }
    }

    const completionScore = totalWeightedCount > 0
      ? completedWeightedCount / totalWeightedCount
      : 0;
    const diagnosticScore = diagnosticWeightedCount > 0
      ? (diagnosticWeightedCount - wrongWeightedCount) / diagnosticWeightedCount
      : undefined;
    const finalScore = diagnosticScore === undefined
      ? completionScore
      : completionScore * 0.7 + diagnosticScore * 0.3;
    const confidence: CapabilityConfidence =
      diagnosticWeightedCount === 0 ? 'low' : diagnosticWeightedCount < 3 ? 'medium' : 'high';

    return {
      domain,
      label: capabilityDomainLabels[domain],
      completionScore,
      diagnosticScore,
      finalScore,
      confidence,
      completedWeightedCount: roundWeighted(completedWeightedCount),
      totalWeightedCount: roundWeighted(totalWeightedCount),
      diagnosticWeightedCount: roundWeighted(diagnosticWeightedCount),
      wrongWeightedCount: roundWeighted(wrongWeightedCount),
      nextConceptId,
    };
  });
}

function countCompletedConcepts(conceptIds: string[], completed: ReadonlySet<string>): number {
  return conceptIds.reduce((sum, id) => sum + (completed.has(id) ? 1 : 0), 0);
}

export function rolePathProgress(completedConceptIds: string[]): RolePathProgress[] {
  const completed = new Set(completedConceptIds);

  return rolePaths.map((path) => {
    const done = countCompletedConcepts(path.recommendedConceptIds, completed);
    const total = path.recommendedConceptIds.length;
    const phases = path.phases.map((phase) => {
      const phaseDone = countCompletedConcepts(phase.conceptIds, completed);
      const phaseTotal = phase.conceptIds.length;
      return {
        id: phase.id,
        title: phase.title,
        outcome: phase.outcome,
        done: phaseDone,
        total: phaseTotal,
        percent: percent(phaseDone, phaseTotal),
        nextConceptId: phase.conceptIds.find((id) => !completed.has(id)),
      };
    });

    return {
      id: path.id,
      title: path.title,
      goal: path.goal,
      done,
      total,
      percent: percent(done, total),
      nextConceptId: path.recommendedConceptIds.find((id) => !completed.has(id)),
      phases,
    };
  });
}

export function getNextProfileAction(
  progress: Pick<UserProgress, 'completedConceptIds' | 'wrongQuestionIds' | 'lastVisitedConceptId'>,
  domainScores: CapabilityDomainScore[],
  pathScores: RolePathProgress[],
): ProfileNextAction {
  const wrongConcept = getFirstWrongConcept(progress.wrongQuestionIds);
  if (wrongConcept) {
    return {
      kind: 'wrongQuestion',
      title: 'Review the missed question first',
      reason: 'A missed diagnostic question is the strongest signal. Revisit the scenario, options, and troubleshooting path before adding new lessons.',
      conceptId: wrongConcept.id,
      conceptTitle: wrongConcept.title,
    };
  }

  const weakestDomain = sortedDomainScores(domainScores).find((score) => score.nextConceptId);
  if (weakestDomain?.nextConceptId) {
    const concept = conceptById.get(weakestDomain.nextConceptId);
    if (concept) {
      return {
        kind: 'capabilityGap',
        title: 'Close the weakest capability gap',
        reason: weakestDomain.label + ' has the lowest current estimate. Finish the next lesson in this domain first.',
        conceptId: concept.id,
        conceptTitle: concept.title,
        contextLabel: weakestDomain.label,
      };
    }
  }

  const weakestPath = [...pathScores]
    .sort((a, b) => (a.percent === b.percent ? b.total - a.total : a.percent - b.percent))
    .find((path) => path.nextConceptId);
  if (weakestPath?.nextConceptId) {
    const concept = conceptById.get(weakestPath.nextConceptId);
    if (concept) {
      return {
        kind: 'rolePath',
        title: 'Continue the role path',
        reason: weakestPath.title + ' is the least complete role path. Continue with its next lesson.',
        conceptId: concept.id,
        conceptTitle: concept.title,
        contextLabel: weakestPath.title,
      };
    }
  }

  const fallbackId = progress.lastVisitedConceptId ?? orderedPublishedConceptIds[0] ?? '';
  const fallbackConcept = conceptById.get(fallbackId) ?? concepts[0];
  return {
    kind: 'review',
    title: 'Enter review mode',
    reason: 'All capability domains and role paths look complete. Revisit the latest lesson and turn it into an explicit engineering judgment.',
    conceptId: fallbackConcept.id,
    conceptTitle: fallbackConcept.title,
  };
}

export function getWeeklyProfileRecommendations(
  progress: Pick<
    UserProgress,
    | 'completedConceptIds'
    | 'completedScenarioIds'
    | 'favoriteConceptIds'
    | 'wrongQuestionIds'
    | 'lastVisitedConceptId'
  >,
  domainScores: CapabilityDomainScore[],
  pathScores: RolePathProgress[],
): WeeklyProfileRecommendation[] {
  const completed = new Set(progress.completedConceptIds);
  const completedScenarios = new Set(progress.completedScenarioIds);
  const recommendations: WeeklyProfileRecommendation[] = [];
  const usedConceptIds = new Set<string>();
  const wrongConcept = getFirstWrongConcept(progress.wrongQuestionIds);

  if (wrongConcept?.diagnosticQuestion) {
    appendRecommendation(recommendations, usedConceptIds, {
      id: 'wrong-' + wrongConcept.id,
      kind: 'nextQuestion',
      title: 'Next question: review the miss',
      actionLabel: 'Open missed lesson',
      reason: 'Question ' + wrongConcept.diagnosticQuestion.id + ' is the clearest current judgment-risk signal. Redo its scenario and troubleshooting path this week.',
      conceptId: wrongConcept.id,
      conceptTitle: wrongConcept.title,
      contextLabel: 'Wrong-question signal',
    });
  }

  const weakestDomains = sortedDomainScores(domainScores).map((score) => score.domain);
  const recommendedScenario =
    weakestDomains
      .flatMap((domain) =>
        scenarioExercises.filter(
          (scenario) =>
            !completedScenarios.has(scenario.id) &&
            scenario.capabilityDomains?.includes(domain),
        ),
      )[0] ??
    scenarioExercises.find((scenario) => !completedScenarios.has(scenario.id));

  if (recommendedScenario) {
    const entryConcept = getConceptById(recommendedScenario.entryConceptIds[0]);
    appendRecommendation(recommendations, usedConceptIds, {
      id: 'scenario-' + recommendedScenario.id,
      kind: 'scenarioExercise',
      title: 'Next scenario: practice a production diagnosis',
      actionLabel: 'Open scenario',
      reason: 'This exercise turns related lessons into a production symptom, strategy tradeoff, and review loop.',
      conceptId: entryConcept?.id,
      conceptTitle: entryConcept?.title,
      contextLabel: recommendedScenario.capabilityDomains?.[0]
        ? capabilityDomainLabels[recommendedScenario.capabilityDomains[0]]
        : 'Scenario exercise',
      scenarioId: recommendedScenario.id,
      scenarioTitle: recommendedScenario.title,
    });
  }

  const unfinishedFavorite = progress.favoriteConceptIds
    .map((id) => getConceptById(id))
    .find((concept): concept is KnowledgePoint => Boolean(concept && !completed.has(concept.id)));
  if (unfinishedFavorite) {
    appendRecommendation(recommendations, usedConceptIds, {
      id: 'favorite-' + unfinishedFavorite.id,
      kind: 'reviewFavorite',
      title: 'Turn a favorite into action',
      actionLabel: 'Finish favorite',
      reason: 'You saved this lesson but have not completed it. Use it as the shortest path from interest to evidence.',
      conceptId: unfinishedFavorite.id,
      conceptTitle: unfinishedFavorite.title,
      contextLabel: 'Favorite signal',
    });
  }

  const weakestDomain = sortedDomainScores(domainScores).find((score) => score.nextConceptId);
  const weakestDomainConcept = getConceptById(weakestDomain?.nextConceptId);
  if (weakestDomain && weakestDomainConcept) {
    appendRecommendation(recommendations, usedConceptIds, {
      id: 'domain-' + weakestDomain.domain,
      kind: 'nextLesson',
      title: 'Next lesson: close a weak domain',
      actionLabel: 'Open next lesson',
      reason: weakestDomain.label + ' is estimated at ' + Math.round(weakestDomain.finalScore * 100) + '%. Complete the next lesson in this domain.',
      conceptId: weakestDomainConcept.id,
      conceptTitle: weakestDomainConcept.title,
      contextLabel: weakestDomain.label,
    });
  }

  const weakestPath = [...pathScores]
    .sort((a, b) => (a.percent === b.percent ? b.total - a.total : a.percent - b.percent))
    .find((path) => path.nextConceptId);
  const weakestPathConcept = getConceptById(weakestPath?.nextConceptId);
  if (weakestPath && weakestPathConcept) {
    appendRecommendation(recommendations, usedConceptIds, {
      id: 'path-' + weakestPath.id,
      kind: 'nextLesson',
      title: 'Move the role path forward',
      actionLabel: 'Continue path',
      reason: weakestPath.title + ' is ' + weakestPath.percent + '% complete. This lesson advances the leader path.',
      conceptId: weakestPathConcept.id,
      conceptTitle: weakestPathConcept.title,
      contextLabel: weakestPath.title,
    });
  }

  if (recommendations.length === 0) {
    const fallbackConcept =
      getConceptById(progress.lastVisitedConceptId) ?? getConceptById(orderedPublishedConceptIds[0]);
    if (fallbackConcept) {
      appendRecommendation(recommendations, usedConceptIds, {
        id: 'fallback-' + fallbackConcept.id,
        kind: 'nextLesson',
        title: 'Weekly review entry',
        actionLabel: 'Open review lesson',
        reason: 'No wrong-question or favorite signal exists yet. Start from the latest or first lesson and make one leader-level judgment explicit.',
        conceptId: fallbackConcept.id,
        conceptTitle: fallbackConcept.title,
        contextLabel: 'Fallback',
      });
    }
  }

  return recommendations;
}

const biasCopyByDomain: Record<
  CapabilityDomain,
  { title: string; suggestedAction: string }
> = {
  modelMechanics: {
    title: 'Model-mechanism black-box bias',
    suggestedAction: 'Review mechanism lessons until you can explain error modes, hallucination, and sampling boundaries rather than only naming symptoms.',
  },
  inferenceCostPerformance: {
    title: 'Cost-first bias',
    suggestedAction: 'Review cost, latency, throughput, and quality together. Avoid platform decisions based only on per-call cost.',
  },
  maasPlatformization: {
    title: 'Quality / SLA boundary bias',
    suggestedAction: 'Review gateway, routing, SLA, and circuit-breaker lessons so degradation and fallback are explicit.',
  },
  ragContextEngineering: {
    title: 'Context-solves-everything bias',
    suggestedAction: 'Review context window, compression, pollution, and session layering. Separate retrieval gaps from context pollution and model limits.',
  },
  agentEngineering: {
    title: 'Agent-boundary optimism bias',
    suggestedAction: 'Review tool calling, human confirmation, subagents, and multi-agent boundaries. Write autonomy limits into execution rules.',
  },
  evaluationObservability: {
    title: 'Evaluation / observability gap bias',
    suggestedAction: 'Review eval, trace, and observability so quality issues are explained with evidence rather than intuition.',
  },
  securityGovernanceOrg: {
    title: 'Governance / permission-afterthought bias',
    suggestedAction: 'Review permission governance, Token ROI, and org rollout. Move risk interception, cost ownership, and approval boundaries earlier.',
  },
};

export function getProfileJudgmentBiases(
  progress: Pick<UserProgress, 'wrongQuestionIds' | 'favoriteConceptIds' | 'lastVisitedConceptId'>,
  domainScores: CapabilityDomainScore[],
): ProfileJudgmentBias[] {
  const wrongQuestionSet = new Set(progress.wrongQuestionIds);
  const wrongConcepts = concepts.filter(
    (concept) => concept.diagnosticQuestion && wrongQuestionSet.has(concept.diagnosticQuestion.id),
  );
  const wrongDomainCounts = new Map<CapabilityDomain, number>();

  for (const concept of wrongConcepts) {
    const domains = [concept.capabilityDomains?.primary, concept.capabilityDomains?.secondary]
      .filter((domain): domain is CapabilityDomain => Boolean(domain));
    for (const domain of domains) {
      wrongDomainCounts.set(domain, (wrongDomainCounts.get(domain) ?? 0) + 1);
    }
  }

  const sorted = sortedDomainScores(domainScores)
    .map((score) => ({
      score,
      wrongCount: wrongDomainCounts.get(score.domain) ?? 0,
    }))
    .sort((a, b) => {
      if (a.wrongCount !== b.wrongCount) return b.wrongCount - a.wrongCount;
      return a.score.finalScore - b.score.finalScore;
    });

  const biases: ProfileJudgmentBias[] = [];
  const pushBias = (score: CapabilityDomainScore, wrongCount: number) => {
    if (biases.length >= 3) return;
    const copy = biasCopyByDomain[score.domain];
    const nextConcept = getConceptById(score.nextConceptId);
    const evidenceParts = [
      score.label + ' estimate ' + Math.round(score.finalScore * 100) + '%',
      wrongCount > 0 ? wrongCount + ' related missed question(s)' : undefined,
      score.diagnosticWeightedCount === 0 ? 'diagnostic sample is thin' : undefined,
    ].filter(Boolean);
    biases.push({
      id: 'bias-' + score.domain,
      title: copy.title,
      severity: wrongCount > 0 || score.finalScore < 0.55 ? 'priority' : 'watch',
      evidence: evidenceParts.join(', '),
      suggestedAction: copy.suggestedAction,
      conceptId: nextConcept?.id,
      conceptTitle: nextConcept?.title,
      domainLabel: score.label,
    });
  };

  for (const item of sorted) {
    if (
      item.wrongCount > 0 ||
      item.score.finalScore < 0.75 ||
      item.score.diagnosticWeightedCount === 0
    ) {
      pushBias(item.score, item.wrongCount);
    }
  }

  if (biases.length === 0) {
    const fallbackScores = sortedDomainScores(domainScores).slice(0, 2);
    for (const score of fallbackScores) {
      pushBias(score, wrongDomainCounts.get(score.domain) ?? 0);
    }
  }

  if (biases.length < 2 && progress.favoriteConceptIds.length > 0) {
    const favoriteConcept = progress.favoriteConceptIds
      .map((id) => getConceptById(id))
      .find((concept): concept is KnowledgePoint => Boolean(concept));
    if (favoriteConcept && biases.every((bias) => bias.conceptId !== favoriteConcept.id)) {
      biases.push({
        id: 'bias-favorite-' + favoriteConcept.id,
        title: 'Interest-without-closure bias',
        severity: 'watch',
        evidence: 'Favorited ' + favoriteConcept.title + ', but a favorite is not yet a completed leader judgment.',
        suggestedAction: 'Turn the favorite into one decision checklist: applicable scenario, counterexample, metric, and rollout boundary.',
        conceptId: favoriteConcept.id,
        conceptTitle: favoriteConcept.title,
      });
    }
  }

  if (biases.length < 2 && progress.lastVisitedConceptId) {
    const lastVisited = getConceptById(progress.lastVisitedConceptId);
    if (lastVisited && biases.every((bias) => bias.conceptId !== lastVisited.id)) {
      biases.push({
        id: 'bias-last-' + lastVisited.id,
        title: 'Recent-learning-without-review bias',
        severity: 'watch',
        evidence: 'Last visited ' + lastVisited.title + ', but it still needs to become an explicit engineering judgment.',
        suggestedAction: 'Return to the latest lesson and write one standard you would use in a launch review.',
        conceptId: lastVisited.id,
        conceptTitle: lastVisited.title,
      });
    }
  }

  return biases.slice(0, 3);
}
