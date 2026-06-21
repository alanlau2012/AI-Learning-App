import type { Difficulty, KnowledgePoint } from '../types';
import { demoConcepts } from './demoConcepts.ts';

/**
 * 56 个知识点登记（stub 阶段）。
 *
 * 仅登记结构字段（id/slug/moduleId/order/difficulty/estimatedMinutes/tags/contentStatus），
 * 正文留空。待内容 Agent 按 docs/content-schema.md §3 写作模板产出、审核 Agent 通过后，
 * 由主开发按映射表合入正文并翻 contentStatus。
 *
 * 权威清单与模块构成（10/10/8/16/6/6 = 56）以 docs/content-schema.md §4 登记表为准。
 *
 * 注：hasAnimation 当前统一为 false（stub 阶段，避免触发尚未实现的动画校验）。
 * 动画落地阶段（P3）按 §4 将下列 17 个概念翻为 true 并补 animation：
 *   token, attention, autoregressive,
 *   prefill, decode, ttft, tpot, kv-cache, session-affinity,
 *   model-gateway, multi-model-routing, cost-routing, capability-routing,
 *   context-window, agent-loop, tool-calling, issue-fix-agent
 */

interface StubInput {
  id: string;
  title: string;
  moduleId: string;
  order: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  tags?: string[];
}

/** 构造一个结构完整的 stub 知识点（正文留空，contentStatus=stub）。 */
function stub(input: StubInput): KnowledgePoint {
  return {
    id: input.id,
    slug: input.id,
    title: input.title,
    moduleId: input.moduleId,
    order: input.order,
    difficulty: input.difficulty,
    estimatedMinutes: input.estimatedMinutes,
    tags: input.tags ?? [],
    contentStatus: 'stub',
    hasAnimation: false,
    definition: '',
    whyItMatters: '',
    mentalModel: '',
    mechanism: [],
    enterpriseCase: {
      title: '',
      scenario: '',
      problem: '',
      analysis: '',
      solution: '',
      takeaway: '',
    },
    pitfalls: [],
    keyTakeaways: [],
    relatedConceptIds: [],
  };
}

const baseConcepts: KnowledgePoint[] = [
  // M1 模型怎么工作（10）
  stub({ id: 'token', title: 'Token', moduleId: 'm1', order: 1, difficulty: 'basic', estimatedMinutes: 8 }),
  stub({ id: 'semantic-space', title: '词向量与语义空间', moduleId: 'm1', order: 2, difficulty: 'basic', estimatedMinutes: 8 }),
  stub({ id: 'transformer', title: 'Transformer', moduleId: 'm1', order: 3, difficulty: 'basic', estimatedMinutes: 10 }),
  stub({ id: 'attention', title: '注意力机制', moduleId: 'm1', order: 4, difficulty: 'basic', estimatedMinutes: 10 }),
  stub({ id: 'positional-encoding', title: '位置编码', moduleId: 'm1', order: 5, difficulty: 'basic', estimatedMinutes: 7 }),
  stub({ id: 'autoregressive', title: '自回归生成', moduleId: 'm1', order: 6, difficulty: 'basic', estimatedMinutes: 8 }),
  stub({ id: 'sampling', title: '采样策略', moduleId: 'm1', order: 7, difficulty: 'basic', estimatedMinutes: 8 }),
  stub({ id: 'instruction-tuning', title: '指令微调与偏好优化', moduleId: 'm1', order: 8, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'hallucination', title: '幻觉', moduleId: 'm1', order: 9, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'reasoning-limit', title: '推理能力边界', moduleId: 'm1', order: 10, difficulty: 'intermediate', estimatedMinutes: 12 }),

  // M2 模型怎么跑得又快又稳（10）
  stub({ id: 'prefill', title: 'Prefill', moduleId: 'm2', order: 1, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'decode', title: 'Decode', moduleId: 'm2', order: 2, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'ttft', title: 'TTFT', moduleId: 'm2', order: 3, difficulty: 'intermediate', estimatedMinutes: 9 }),
  stub({ id: 'tpot', title: 'TPOT', moduleId: 'm2', order: 4, difficulty: 'intermediate', estimatedMinutes: 8 }),
  {
    id: 'kv-cache',
    slug: 'kv-cache',
    title: 'KV Cache',
    moduleId: 'm2',
    order: 5,
    difficulty: 'advanced',
    estimatedMinutes: 12,
    tags: ['KV Cache', 'TTFT', 'Session 亲和', 'MaaS'],
    contentStatus: 'demo',
    hasAnimation: true,
    definition:
      'KV Cache 是在大模型推理中缓存历史上下文的 Key 和 Value，避免每次生成新 Token 时重复计算全部历史。',
    whyItMatters:
      'KV Cache 直接影响首字时延、吞吐、显存占用和多轮对话体验。企业 MaaS 平台如果 KV Cache 命中率低，高并发下会快速劣化。',
    mentalModel:
      '把 KV Cache 理解为“模型已经读过的上下文笔记”。下一轮还在同一会话里时，模型可直接翻笔记，而不是重新读全文。',
    mechanism: [
      'Prefill 阶段处理完整输入上下文',
      '模型为每层注意力生成 Key 和 Value',
      '这些 Key 和 Value 被缓存到显存中',
      'Decode 阶段生成新 Token 时复用已有 KV',
      '如果请求被路由到没有缓存的实例，就需要重新 Prefill',
    ],
    animation: {
      type: 'kv-cache',
      title: 'KV Cache 命中与未命中',
      steps: [
        {
          id: 's1',
          title: '多轮请求进入同一会话',
          description: '用户在同一会话里连续提问，模型需要复用之前的上下文。',
          highlightTargets: ['session'],
        },
        {
          id: 's2',
          title: 'Prefill：处理完整输入',
          description: '模型一次性并行处理全部输入上下文，并为每层注意力计算 Key 和 Value。',
          highlightTargets: ['prefill'],
        },
        {
          id: 's3',
          title: '写入 KV Cache',
          description: '计算出的 Key / Value 被缓存到显存中，作为“已读上下文的笔记”。',
          highlightTargets: ['cache'],
        },
        {
          id: 's4',
          title: 'Decode：命中缓存',
          description: '生成新 Token 时直接复用已缓存的 KV，无需重算历史，TTFT 很低。',
          highlightTargets: ['decode', 'hit'],
        },
        {
          id: 's5',
          title: '路由失效：缓存未命中',
          description: '请求被打散到没有缓存的实例，必须重新 Prefill，TTFT 飙升。',
          highlightTargets: ['miss'],
        },
      ],
    },
    enterpriseCase: {
      title: '高峰期 TTFT 飙升',
      scenario: '某 MaaS 平台高峰期 TTFT 明显上升。',
      problem: '用户反馈首字等待明显变长。',
      analysis: '负载均衡未保持 Session 亲和，多轮请求被分配到不同实例，导致 KV Cache 命中率下降。',
      solution: '启用 Session 亲和路由，让同一会话稳定命中持有缓存的实例；监控缓存命中率而非只看平均时延。',
      takeaway: 'Session 亲和是企业 MaaS 必须具备的能力。',
    },
    pitfalls: [
      '只关注模型大小，不关注缓存命中',
      '认为增加卡数一定能降低 TTFT',
      '忽视会话亲和',
      '忽视长上下文对显存的挤占',
    ],
    diagnosticQuestion: {
      id: 'q-kv-cache-1',
      type: 'single',
      scenario:
        '某 MaaS 平台高峰期 TTFT 从 800ms 上升到 4s，KV Cache 命中率从 60% 下降到 15%，用户反馈首字等待明显变长。',
      question: '最优先排查什么？',
      options: [
        { id: 'a', text: '模型参数量是否过大' },
        { id: 'b', text: 'Session 亲和是否失效' },
        { id: 'c', text: '温度参数是否过高' },
        { id: 'd', text: '是否需要增加提示词长度' },
      ],
      correctOptionIds: ['b'],
      explanation:
        'TTFT 上升且 KV Cache 命中率下降，优先怀疑请求没有路由到持有上下文缓存的实例，或会话亲和策略失效。模型大小和温度不是该现象的首要解释。',
      troubleshootingPath: ['确认会话亲和/路由策略', '检查实例缓存状态', '核对请求是否被错误打散', '复核高峰期扩缩容'],
      relatedConceptIds: ['prefill', 'decode', 'ttft', 'session-affinity'],
    },
    keyTakeaways: [
      'KV Cache 是多轮对话性能的关键',
      'Session 亲和是企业 MaaS 必须具备的能力',
      '高并发问题不能只看平均时延，要同时看缓存命中率',
    ],
    relatedConceptIds: ['prefill', 'decode', 'ttft', 'session-affinity', 'sla'],
  },
  stub({ id: 'session-affinity', title: 'Session 亲和', moduleId: 'm2', order: 6, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'batch-scheduling', title: 'Batch 调度', moduleId: 'm2', order: 7, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'pd-separation', title: 'P-D 分离', moduleId: 'm2', order: 8, difficulty: 'advanced', estimatedMinutes: 12 }),
  stub({ id: 'speculative-decoding', title: '投机解码', moduleId: 'm2', order: 9, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'quantization', title: '量化', moduleId: 'm2', order: 10, difficulty: 'intermediate', estimatedMinutes: 10 }),

  // M3 模型怎么变成企业平台（8）
  stub({ id: 'maas', title: 'MaaS', moduleId: 'm3', order: 1, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'model-gateway', title: '模型网关', moduleId: 'm3', order: 2, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'multi-model-routing', title: '多模型路由', moduleId: 'm3', order: 3, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'cost-routing', title: '成本路由', moduleId: 'm3', order: 4, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'capability-routing', title: '能力路由', moduleId: 'm3', order: 5, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'cache-system', title: '缓存体系', moduleId: 'm3', order: 6, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'rate-limit-circuit-break', title: '限流熔断', moduleId: 'm3', order: 7, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'sla', title: 'SLA 保障', moduleId: 'm3', order: 8, difficulty: 'intermediate', estimatedMinutes: 10 }),

  // M4 模型怎么变成 Agent（16）
  stub({ id: 'prompt-context', title: 'Prompt 与 Context', moduleId: 'm4', order: 1, difficulty: 'basic', estimatedMinutes: 9 }),
  stub({ id: 'system-prompt', title: '系统提示词', moduleId: 'm4', order: 2, difficulty: 'basic', estimatedMinutes: 8 }),
  stub({ id: 'context-window', title: '上下文窗口', moduleId: 'm4', order: 3, difficulty: 'basic', estimatedMinutes: 9 }),
  stub({ id: 'context-compression', title: '上下文压缩', moduleId: 'm4', order: 4, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'context-pollution', title: '上下文污染', moduleId: 'm4', order: 5, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'layered-session', title: '分层会话', moduleId: 'm4', order: 6, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'agents-md', title: 'AGENTS.md', moduleId: 'm4', order: 7, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'repo-context', title: '仓库上下文', moduleId: 'm4', order: 8, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'spec-driven-development', title: '规格驱动开发', moduleId: 'm4', order: 9, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'agent-loop', title: 'Agent Loop', moduleId: 'm4', order: 10, difficulty: 'intermediate', estimatedMinutes: 12 }),
  stub({ id: 'tool-calling', title: '工具调用', moduleId: 'm4', order: 11, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'skill', title: 'Skill', moduleId: 'm4', order: 12, difficulty: 'advanced', estimatedMinutes: 12 }),
  stub({ id: 'subagent', title: 'Subagent', moduleId: 'm4', order: 13, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'memory', title: '记忆', moduleId: 'm4', order: 14, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'human-in-the-loop', title: 'Human-in-the-loop', moduleId: 'm4', order: 15, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'multi-agent', title: '多 Agent 协作', moduleId: 'm4', order: 16, difficulty: 'advanced', estimatedMinutes: 12 }),

  // M5 Agent 怎么改变软件工程（6）
  stub({ id: 'code-review-agent', title: 'Code Review Agent', moduleId: 'm5', order: 1, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'issue-fix-agent', title: 'Issue Fix Agent', moduleId: 'm5', order: 2, difficulty: 'advanced', estimatedMinutes: 12 }),
  stub({ id: 'requirement-decomposition-agent', title: '需求拆解 Agent', moduleId: 'm5', order: 3, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'test-generation-agent', title: '测试生成 Agent', moduleId: 'm5', order: 4, difficulty: 'intermediate', estimatedMinutes: 10 }),
  stub({ id: 'ops-diagnosis-agent', title: '运维诊断 Agent', moduleId: 'm5', order: 5, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'value-review-agent', title: '价值复盘 Agent', moduleId: 'm5', order: 6, difficulty: 'intermediate', estimatedMinutes: 10 }),

  // M6 企业怎么治理 AI（6）
  stub({ id: 'eval', title: 'Eval', moduleId: 'm6', order: 1, difficulty: 'advanced', estimatedMinutes: 12 }),
  stub({ id: 'trace', title: 'Trace', moduleId: 'm6', order: 2, difficulty: 'advanced', estimatedMinutes: 10 }),
  stub({ id: 'observability', title: 'Observability', moduleId: 'm6', order: 3, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'token-roi', title: 'Token ROI', moduleId: 'm6', order: 4, difficulty: 'advanced', estimatedMinutes: 12 }),
  stub({ id: 'permission-governance', title: '权限治理', moduleId: 'm6', order: 5, difficulty: 'advanced', estimatedMinutes: 11 }),
  stub({ id: 'ai-native-org', title: 'AI 原生组织阵型', moduleId: 'm6', order: 6, difficulty: 'advanced', estimatedMinutes: 12 }),
];

const demoById = new Map(demoConcepts.map((concept) => [concept.id, concept]));

export const concepts: KnowledgePoint[] = baseConcepts.map(
  (concept) => demoById.get(concept.id) ?? concept,
);
