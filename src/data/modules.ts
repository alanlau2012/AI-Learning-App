import type { LearningModule } from '../types';

/**
 * 6 个学习模块。conceptIds 与 docs/content-schema.md §4 登记表一致，
 * 由 validate:structure 校验其与 concepts 的集合与 order 完全一致。
 * description 取自 product-spec §5 模块目标；recommendedFor 取自 §4 推荐路径。
 */
export const modules: LearningModule[] = [
  {
    id: 'm1',
    title: '模型怎么工作',
    subtitle: '大模型的基本机制',
    description: '理解大模型基本机制与能力边界。',
    order: 1,
    conceptIds: [
      'token', 'semantic-space', 'transformer', 'attention', 'positional-encoding',
      'autoregressive', 'sampling', 'instruction-tuning', 'hallucination', 'reasoning-limit',
    ],
    recommendedFor: ['全部用户（入门路径）'],
  },
  {
    id: 'm2',
    title: '模型怎么跑得又快又稳',
    subtitle: '推理性能与系统瓶颈',
    description: '理解推理性能、时延、吞吐、缓存、调度、瓶颈。',
    order: 2,
    conceptIds: [
      'prefill', 'decode', 'ttft', 'tpot', 'kv-cache', 'session-affinity',
      'batch-scheduling', 'pd-separation', 'speculative-decoding', 'quantization',
    ],
    recommendedFor: ['平台/工程（工程路径）'],
  },
  {
    id: 'm3',
    title: '模型怎么变成企业平台',
    subtitle: 'MaaS、网关与治理',
    description: '理解 MaaS、网关、路由、缓存、成本、SLA。',
    order: 3,
    conceptIds: [
      'maas', 'model-gateway', 'multi-model-routing', 'cost-routing', 'capability-routing',
      'cache-system', 'rate-limit-circuit-break', 'sla',
    ],
    recommendedFor: ['平台负责人'],
  },
  {
    id: 'm4',
    title: '模型怎么变成 Agent',
    subtitle: '上下文、工具与任务闭环',
    description: '理解上下文工程、Agent Loop、工具、Skill、多 Agent。',
    order: 4,
    conceptIds: [
      'prompt-context', 'system-prompt', 'context-window', 'context-compression', 'context-pollution',
      'layered-session', 'agents-md', 'repo-context', 'spec-driven-development', 'agent-loop',
      'tool-calling', 'skill', 'subagent', 'memory', 'human-in-the-loop', 'multi-agent',
    ],
    recommendedFor: ['应用开发（应用路径）'],
  },
  {
    id: 'm5',
    title: 'Agent 怎么改变软件工程',
    subtitle: 'AI 原生研发闭环',
    description: '理解 AI 原生软件工程闭环。',
    order: 5,
    conceptIds: [
      'code-review-agent', 'issue-fix-agent', 'requirement-decomposition-agent',
      'test-generation-agent', 'ops-diagnosis-agent', 'value-review-agent',
    ],
    recommendedFor: ['研发管理者'],
  },
  {
    id: 'm6',
    title: '企业怎么治理 AI',
    subtitle: '评测、安全、成本与组织',
    description: '理解评测、观测、安全、权限、成本、组织。',
    order: 6,
    conceptIds: [
      'eval', 'trace', 'observability', 'token-roi', 'permission-governance', 'ai-native-org',
    ],
    recommendedFor: ['AI 负责人（负责人路径）'],
  },
];
