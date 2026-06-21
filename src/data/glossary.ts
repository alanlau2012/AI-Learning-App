import type { GlossaryTerm } from '../types';

/**
 * 术语索引（GlossaryPage 数据源）。
 * relatedConceptIds 必须指向已存在的 KnowledgePoint.id（由 validate:structure 校验）。
 */
export const glossary: GlossaryTerm[] = [
  {
    id: 'token',
    name: 'Token',
    enName: 'Token',
    definition: '大模型处理文本的基本单位，一个 Token 不一定等于一个字或一个词。',
    moduleId: 'm1',
    relatedConceptIds: ['token', 'autoregressive'],
    tags: ['LLM', 'Tokenizer'],
  },
  {
    id: 'kv-cache',
    name: 'KV Cache',
    enName: 'Key-Value Cache',
    definition: '缓存历史上下文的 Key 和 Value，避免 Decode 阶段重复计算全部历史。',
    moduleId: 'm2',
    relatedConceptIds: ['kv-cache', 'prefill', 'decode', 'session-affinity'],
    tags: ['Inference', 'TTFT'],
  },
  {
    id: 'ttft',
    name: '首字时延',
    enName: 'Time To First Token',
    definition: '从请求发出到模型返回第一个 Token 的时间，是交互体验的关键指标。',
    moduleId: 'm2',
    relatedConceptIds: ['ttft', 'prefill', 'kv-cache'],
    tags: ['Latency'],
  },
  {
    id: 'maas',
    name: '模型即服务',
    enName: 'Model as a Service',
    definition: '把模型能力封装成可治理、可路由、可观测、可计费的平台服务。',
    moduleId: 'm3',
    relatedConceptIds: ['maas', 'model-gateway', 'sla'],
    tags: ['Platform'],
  },
];
