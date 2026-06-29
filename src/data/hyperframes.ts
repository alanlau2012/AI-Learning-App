import type { HyperframeMaterial } from '../types';

const rawAssetBase = import.meta.env?.BASE_URL ?? '/';
const assetBase = rawAssetBase.endsWith('/') ? rawAssetBase : `${rawAssetBase}/`;

export const hyperframeMaterials: HyperframeMaterial[] = [
  {
    id: 'text-to-answer',
    title: '一句话如何变成模型回答',
    subtitle:
      '从自然语言、Token、Embedding 到 Self-Attention、KV Cache 与自回归 Decode，串起模型回答的连续工程链路。',
    moduleId: 'm1',
    durationSeconds: 55,
    src: `${assetBase}hyperframes/text-to-answer/index.html`,
    width: 1920,
    height: 1080,
    relatedConceptIds: [
      'token',
      'semantic-space',
      'transformer',
      'attention',
      'positional-encoding',
      'autoregressive',
      'sampling',
    ],
    chapters: [
      { id: 'intro', title: '总览', startSeconds: 0 },
      { id: 'tokenizer', title: 'Token 切分', startSeconds: 8, relatedConceptId: 'token' },
      {
        id: 'embedding',
        title: 'Embedding + 位置',
        startSeconds: 11,
        relatedConceptId: 'semantic-space',
      },
      { id: 'prefill', title: 'Prefill', startSeconds: 17, relatedConceptId: 'transformer' },
      {
        id: 'attention',
        title: 'Self-Attention',
        startSeconds: 21,
        relatedConceptId: 'attention',
      },
      {
        id: 'kv-cache',
        title: 'KV Cache',
        startSeconds: 27,
        relatedConceptId: 'positional-encoding',
      },
      { id: 'first-token', title: '首 Token', startSeconds: 31, relatedConceptId: 'sampling' },
      {
        id: 'decode-loop',
        title: 'Decode Loop',
        startSeconds: 34.4,
        relatedConceptId: 'autoregressive',
      },
      {
        id: 'cache-reuse',
        title: '缓存复用',
        startSeconds: 41,
        relatedConceptId: 'autoregressive',
      },
      { id: 'outro', title: '结论', startSeconds: 51 },
    ],
  },
];

export function getHyperframeMaterialsForModule(moduleId: string): HyperframeMaterial[] {
  return hyperframeMaterials.filter((material) => material.moduleId === moduleId);
}

export function getHyperframeMaterialsForConcept(conceptId: string): HyperframeMaterial[] {
  return hyperframeMaterials.filter((material) => material.relatedConceptIds.includes(conceptId));
}
