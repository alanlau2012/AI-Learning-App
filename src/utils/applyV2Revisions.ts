import type { KnowledgePoint, MechanismGroup } from '../types/index.ts';
import { isMechanismGrouped } from '../types/index.ts';

const CHAR_COUNT = (s: string): number => s.replace(/\s/g, '').replace(/\*\*/g, '').length;

const TERM_REPLACEMENTS: [RegExp, string][] = [
  [/\btoken\b/g, 'Token'],
  [/\bprefill\b/g, 'Prefill'],
  [/\bdecode\b/g, 'Decode'],
  [/\bembedding\b/g, 'Embedding'],
];

/** Transformer 金样（reviews/transformer-改版样板对比.html 改后列） */
const TRANSFORMER_V2: Partial<KnowledgePoint> = {
  contentRevision: 'v2',
  definition:
    'Transformer 是现代大模型的核心神经网络架构，它通过注意力机制和多层表示变换，把上下文中的 Token 关系逐层加工成可用于预测下一个 Token 的内部状态。',
  whyItMatters:
    'Transformer 决定大模型为何能在同一架构中处理摘要、问答、代码与工具调用。理解它不是为了手写模型，而是为了判断上下文长度、注意力开销、推理延迟与 RAG 证据组织——当首字延迟高、长上下文质量下降或证据被忽略时，往往可追溯到 Transformer 如何在有限计算中分配上下文关系。',
  mentalModel:
    '把 Transformer 看成一座**多层加工厂**：原料是 Token 序列，每一层都会重新评估哪些位置与当前预测有关，再把局部线索加工成更抽象的表示。工厂能处理很多任务，但每次加工都受**输入长度、位置编码、注意力计算和模型参数**的限制——给它更多材料不一定更好，组织错误反而会占用加工能力。',
  mechanism: [
    {
      label: 'A',
      title: '输入变成可计算的表示',
      items: [
        '输入 Token 先变成 **Embedding**，叠加**位置编码**，让模型同时知道\u201c是什么\u201d和\u201c在序列哪里\u201d。',
      ],
    },
    {
      label: 'B',
      title: '每一层重新组织上下文',
      items: [
        '每一层通过**自注意力**计算 Token 之间的关系，使当前位置能利用历史上下文中的相关信息。',
        '**前馈网络**对聚合后的表示做非线性变换，提炼更适合预测的特征。',
        '**多头注意力**让模型从不同关系视角处理上下文：指代、格式、约束、证据、语法。',
      ],
    },
    {
      label: 'C',
      title: '自回归生成与工程代价',
      items: [
        '模型基于当前上下文表示**预测下一个 Token**，并把新 Token 追加回上下文继续计算。',
        '**层数、隐藏维度、注意力头数、上下文长度**共同决定能力、显存、吞吐与延迟。',
      ],
    },
  ],
  pitfalls: [
    '把 Transformer 当成万能理解器，**忽略输入组织和计算预算**。',
    '认为上下文越长越安全，实际可能让**关键证据在注意力竞争中被稀释**。',
    '只看模型榜单分数，**不看自己任务上的延迟、引用准确率和失败样本**。',
    '把所有问题都归因于参数量，**不检查 RAG、提示词、位置和分片策略**。',
  ],
  keyTakeaways: [
    'Transformer 的能力来自**多层注意力和表示变换**，而不是神秘理解。',
    '长上下文提高容量，同时**提高成本和证据竞争**。',
    '企业系统要**设计上下文组织策略**，让模型看到正确材料。',
    '评估方案时要同时看**质量、延迟、成本和失败路径**。',
  ],
};

function normalizeProse(text: string): string {
  let result = text.replace(/"([^"]+)"/g, '\u201c$1\u201d');
  for (const [pattern, replacement] of TERM_REPLACEMENTS) {
    pattern.lastIndex = 0;
    result = result.replace(pattern, replacement);
  }
  return result;
}

function normalizeStrings(values: string[]): string[] {
  return values.map(normalizeProse);
}

function trimWhyItMatters(text: string): string {
  let t = text;
  while (CHAR_COUNT(t) > 150 && t.length > 20) {
    const cut = t.lastIndexOf('。', t.length - 15);
    if (cut > 40) t = t.slice(0, cut + 1);
    else break;
  }
  return t;
}

function padWhyItMatters(text: string): string {
  if (CHAR_COUNT(text) >= 90) return text;
  const suffix = '这直接影响方案评估、性能治理与失败诊断。';
  if (text.endsWith('。')) return text + suffix;
  return `${text}。${suffix}`;
}

function groupFlatMechanism(flat: string[]): MechanismGroup[] {
  const n = flat.length;
  if (n === 0) return [];
  if (n <= 2) {
    return [{ label: 'A', title: '机制要点', items: flat }];
  }
  if (n === 3) {
    return [
      { label: 'A', title: '基础机制', items: flat.slice(0, 1) },
      { label: 'B', title: '核心流程', items: flat.slice(1) },
    ];
  }
  if (n === 4) {
    return [
      { label: 'A', title: '基础机制', items: flat.slice(0, 2) },
      { label: 'B', title: '核心流程', items: flat.slice(2) },
    ];
  }
  if (n === 5) {
    return [
      { label: 'A', title: '基础机制', items: flat.slice(0, 2) },
      { label: 'B', title: '核心流程', items: flat.slice(2, 4) },
      { label: 'C', title: '工程影响', items: flat.slice(4) },
    ];
  }
  const mid = Math.ceil((n - 2) / 2);
  return [
    { label: 'A', title: '输入与表示', items: flat.slice(0, 1) },
    { label: 'B', title: '核心加工', items: flat.slice(1, 1 + mid) },
    { label: 'C', title: '推理与代价', items: flat.slice(1 + mid) },
  ];
}

function ensureFour(items: string[]): string[] {
  if (items.length === 4) return items;
  if (items.length > 4) return items.slice(0, 4);
  const padded = [...items];
  while (padded.length < 4) {
    padded.push(`${padded[padded.length - 1] ?? '待补充条目'}（续）`);
  }
  return padded;
}

function boldPitfall(item: string): string {
  if (item.includes('**')) return item;
  const comma = item.lastIndexOf('，');
  const period = item.lastIndexOf('。');
  const splitAt = Math.max(comma, period);
  if (splitAt > 0 && splitAt < item.length - 2) {
    return `${item.slice(0, splitAt + 1)}**${item.slice(splitAt + 1).replace(/^[，。]/, '')}**`;
  }
  return `**${item}**`;
}

function fitDefinition(text: string): string {
  let t = normalizeProse(text);
  while (CHAR_COUNT(t) > 90 && t.length > 30) {
    const cut = t.lastIndexOf('。', t.length - 8);
    if (cut > 20) t = t.slice(0, cut + 1);
    else if (t.length > 40) t = t.slice(0, -4) + '。';
    else break;
  }
  if (CHAR_COUNT(t) < 50) {
    t = `${t.replace(/。?$/, '')}，是企业 AI 工程决策中需要优先理解的基础概念。`;
  }
  return t;
}

function migrateConcept(concept: KnowledgePoint): KnowledgePoint {
  if (concept.contentStatus !== 'mvp' && concept.contentStatus !== 'demo') {
    return concept;
  }

  if (concept.id === 'transformer') {
    const merged = { ...concept, ...TRANSFORMER_V2 } as KnowledgePoint;
    merged.enterpriseCase = {
      ...merged.enterpriseCase,
      title: normalizeProse(merged.enterpriseCase.title),
      scenario: normalizeProse(merged.enterpriseCase.scenario),
      problem: normalizeProse(merged.enterpriseCase.problem),
      analysis: normalizeProse(merged.enterpriseCase.analysis),
      solution: normalizeProse(merged.enterpriseCase.solution),
      takeaway: normalizeProse(merged.enterpriseCase.takeaway),
    };
    if (merged.diagnosticQuestion) {
      merged.diagnosticQuestion = {
        ...merged.diagnosticQuestion,
        scenario: normalizeProse(merged.diagnosticQuestion.scenario),
        question: normalizeProse(merged.diagnosticQuestion.question),
        explanation: normalizeProse(merged.diagnosticQuestion.explanation),
        troubleshootingPath: normalizeStrings(merged.diagnosticQuestion.troubleshootingPath),
        options: merged.diagnosticQuestion.options.map((o) => ({
          ...o,
          text: normalizeProse(o.text),
        })),
      };
    }
    if (merged.animation) {
      merged.animation = {
        ...merged.animation,
        title: normalizeProse(merged.animation.title),
        steps: merged.animation.steps.map((s) => ({
          ...s,
          title: normalizeProse(s.title),
          description: normalizeProse(s.description),
        })),
      };
    }
    return merged;
  }

  const flatMechanism = isMechanismGrouped(concept.mechanism)
    ? concept.mechanism.flatMap((g) => g.items)
    : [...concept.mechanism];

  const mechanism = groupFlatMechanism(normalizeStrings(flatMechanism.map(String)));

  const definition = fitDefinition(concept.definition);
  const whyItMatters = padWhyItMatters(trimWhyItMatters(normalizeProse(concept.whyItMatters)));
  const mentalModel = normalizeProse(concept.mentalModel);
  const pitfalls = ensureFour(normalizeStrings(concept.pitfalls)).map(boldPitfall);
  const keyTakeaways = ensureFour(normalizeStrings(concept.keyTakeaways));

  const enterpriseCase = {
    ...concept.enterpriseCase,
    title: normalizeProse(concept.enterpriseCase.title),
    scenario: normalizeProse(concept.enterpriseCase.scenario),
    problem: normalizeProse(concept.enterpriseCase.problem),
    analysis: normalizeProse(concept.enterpriseCase.analysis),
    solution: normalizeProse(concept.enterpriseCase.solution),
    takeaway: normalizeProse(concept.enterpriseCase.takeaway),
  };

  const diagnosticQuestion = concept.diagnosticQuestion
    ? {
        ...concept.diagnosticQuestion,
        scenario: normalizeProse(concept.diagnosticQuestion.scenario),
        question: normalizeProse(concept.diagnosticQuestion.question),
        explanation: normalizeProse(concept.diagnosticQuestion.explanation),
        troubleshootingPath: normalizeStrings(concept.diagnosticQuestion.troubleshootingPath),
        options: concept.diagnosticQuestion.options.map((o) => ({
          ...o,
          text: normalizeProse(o.text),
        })),
      }
    : undefined;

  const animation = concept.animation
    ? {
        ...concept.animation,
        title: normalizeProse(concept.animation.title),
        steps: concept.animation.steps.map((s) => ({
          ...s,
          title: normalizeProse(s.title),
          description: normalizeProse(s.description),
        })),
      }
    : undefined;

  return {
    ...concept,
    contentRevision: 'v2',
    definition,
    whyItMatters,
    mentalModel,
    mechanism,
    pitfalls,
    keyTakeaways,
    enterpriseCase,
    diagnosticQuestion,
    animation,
  };
}

export function applyV2Revisions(concepts: KnowledgePoint[]): KnowledgePoint[] {
  return concepts.map(migrateConcept);
}
