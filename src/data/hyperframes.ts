import type { HyperframeMaterial } from '../types';

export const hyperframeMaterials: HyperframeMaterial[] = [
  {
    id: 'text-to-answer',
    title: '一句话如何变成模型回答',
    subtitle: '从自然语言到下一个 Token，串起模型回答的完整工程链路。',
    moduleId: 'm1',
    durationSeconds: 45,
    src: '/hyperframes/text-to-answer/index.html',
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
      { id: 'token', title: 'Token', startSeconds: 3, relatedConceptId: 'token' },
      { id: 'semantic-space', title: '语义空间', startSeconds: 9, relatedConceptId: 'semantic-space' },
      { id: 'transformer', title: 'Transformer', startSeconds: 15, relatedConceptId: 'transformer' },
      { id: 'attention', title: '注意力 + 位置', startSeconds: 22, relatedConceptId: 'attention' },
      { id: 'autoregressive', title: '自回归生成', startSeconds: 30, relatedConceptId: 'autoregressive' },
      { id: 'sampling', title: '采样策略', startSeconds: 37, relatedConceptId: 'sampling' },
      { id: 'outro', title: '结论', startSeconds: 42.5 },
    ],
  },
];

export function getHyperframeMaterialsForModule(moduleId: string): HyperframeMaterial[] {
  return hyperframeMaterials.filter((material) => material.moduleId === moduleId);
}

export function getHyperframeMaterialsForConcept(conceptId: string): HyperframeMaterial[] {
  return hyperframeMaterials.filter((material) => material.relatedConceptIds.includes(conceptId));
}
