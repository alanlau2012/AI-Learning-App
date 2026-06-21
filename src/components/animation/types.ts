import type { AnimationConfig, AnimationStep } from '../../types';

export interface AnimationCanvasProps {
  config: AnimationConfig;
  step: AnimationStep;
  stepIndex: number;
  totalSteps: number;
  reducedMotion: boolean;
}
