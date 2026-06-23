/**
 * 全册术语 canonical 写法（docs/content-schema.md §7.1）。
 * 与 glossary.ts 互补：此处只管写法锁定，不管定义正文。
 */

import type { MechanismContent, MechanismGroup } from '../types/index.ts';

export interface TermRule {
  canonical: string;
  /** 正则，须带 g 标志；匹配 forbidden 变体 */
  forbidden: RegExp;
  rule: string;
}

export const TERM_RULES: TermRule[] = [
  {
    canonical: 'Token',
    forbidden: /\btoken\b/g,
    rule: '领域专有名词，首字母大写，全册统一',
  },
  {
    canonical: 'Prefill',
    forbidden: /\bprefill\b/g,
    rule: '阶段名按专有名词处理',
  },
  {
    canonical: 'Decode',
    forbidden: /\bdecode\b/g,
    rule: '阶段名按专有名词处理',
  },
  {
    canonical: 'Embedding',
    forbidden: /\bembedding\b/g,
    rule: '统一大写，避免与普通词混淆',
  },
];

/** 半角直引号 → 中文引号（仅正文 prose，跳过代码语境） */
export const HALF_WIDTH_QUOTE_PATTERN = /"([^"]+)"/g;

export function collectConceptTextFields(concept: {
  definition: string;
  whyItMatters: string;
  mentalModel: string;
  mechanism: MechanismContent;
  pitfalls: string[];
  keyTakeaways: string[];
  enterpriseCase: {
    title: string;
    scenario: string;
    problem: string;
    analysis: string;
    solution: string;
    takeaway: string;
  };
  diagnosticQuestion?: {
    scenario: string;
    question: string;
    explanation: string;
    options: { text: string }[];
    troubleshootingPath: string[];
  };
}): string[] {
  const texts: string[] = [
    concept.definition,
    concept.whyItMatters,
    concept.mentalModel,
    ...concept.pitfalls,
    ...concept.keyTakeaways,
    concept.enterpriseCase.title,
    concept.enterpriseCase.scenario,
    concept.enterpriseCase.problem,
    concept.enterpriseCase.analysis,
    concept.enterpriseCase.solution,
    concept.enterpriseCase.takeaway,
  ];

  if (Array.isArray(concept.mechanism) && concept.mechanism.length > 0) {
    if (typeof concept.mechanism[0] === 'string') {
      texts.push(...(concept.mechanism as string[]));
    } else {
      for (const group of concept.mechanism as MechanismGroup[]) {
        texts.push(group.title, ...group.items);
      }
    }
  }

  const q = concept.diagnosticQuestion;
  if (q) {
    texts.push(q.scenario, q.question, q.explanation, ...q.troubleshootingPath);
    texts.push(...q.options.map((o) => o.text));
  }

  return texts.filter(Boolean);
}
