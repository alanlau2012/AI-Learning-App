import type { ComponentType } from 'react';
import type { AnimationType } from '../../types';
import { GenericMechanismAnimation } from './GenericMechanismAnimation';
import { KVCacheAnimation } from './KVCacheAnimation';
import type { AnimationCanvasProps } from './types';

export const ANIMATION_REGISTRY: Partial<
  Record<AnimationType, ComponentType<AnimationCanvasProps>>
> = {
  'token-flow': GenericMechanismAnimation,
  'attention-map': GenericMechanismAnimation,
  'context-window': GenericMechanismAnimation,
  'prefill-decode': GenericMechanismAnimation,
  'kv-cache': KVCacheAnimation,
  'model-router': GenericMechanismAnimation,
  'agent-loop': GenericMechanismAnimation,
  'issue-fix-flow': GenericMechanismAnimation,
};

export const REGISTERED_ANIMATION_TYPES = Object.keys(
  ANIMATION_REGISTRY,
) as AnimationType[];
