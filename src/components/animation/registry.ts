import type { ComponentType } from 'react';
import type { AnimationType } from '../../types';
import { AgentLoopAnimation } from './AgentLoopAnimation';
import { AttentionAnimation } from './AttentionAnimation';
import { ContextWindowAnimation } from './ContextWindowAnimation';
import { IssueFixFlowAnimation } from './IssueFixFlowAnimation';
import { KVCacheAnimation } from './KVCacheAnimation';
import { ModelRoutingAnimation } from './ModelRoutingAnimation';
import { ObservabilityTraceAnimation } from './ObservabilityTraceAnimation';
import { PrefillDecodeAnimation } from './PrefillDecodeAnimation';
import { SkillLifecycleAnimation } from './SkillLifecycleAnimation';
import { TokenRoiFlowAnimation } from './TokenRoiFlowAnimation';
import { TokenFlowAnimation } from './TokenFlowAnimation';
import type { AnimationCanvasProps } from './types';

export const ANIMATION_REGISTRY: Partial<
  Record<AnimationType, ComponentType<AnimationCanvasProps>>
> = {
  'token-flow': TokenFlowAnimation,
  'attention-map': AttentionAnimation,
  'context-window': ContextWindowAnimation,
  'prefill-decode': PrefillDecodeAnimation,
  'kv-cache': KVCacheAnimation,
  'model-router': ModelRoutingAnimation,
  'agent-loop': AgentLoopAnimation,
  'skill-lifecycle': SkillLifecycleAnimation,
  'issue-fix-flow': IssueFixFlowAnimation,
  'observability-trace': ObservabilityTraceAnimation,
  'token-roi-flow': TokenRoiFlowAnimation,
};

export const REGISTERED_ANIMATION_TYPES = Object.keys(
  ANIMATION_REGISTRY,
) as AnimationType[];
