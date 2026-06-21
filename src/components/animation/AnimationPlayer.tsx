import { useEffect, useMemo, useState } from 'react';
import type { AnimationConfig } from '../../types';
import { ANIMATION_REGISTRY } from './registry';
import styles from './AnimationPlayer.module.css';

interface AnimationPlayerProps {
  config: AnimationConfig;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

export function AnimationPlayer({ config }: AnimationPlayerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();
  const totalSteps = config.steps.length;
  const step = config.steps[stepIndex] ?? config.steps[0];
  const Canvas = ANIMATION_REGISTRY[config.type];
  const isPlaying = playing && !reducedMotion;

  useEffect(() => {
    if (!isPlaying || totalSteps === 0) return;
    const duration = step?.durationMs ?? 1700;
    const timer = window.setTimeout(() => {
      setStepIndex((cur) => {
        if (cur >= totalSteps - 1) {
          setPlaying(false);
          return cur;
        }
        return cur + 1;
      });
    }, duration);
    return () => window.clearTimeout(timer);
  }, [isPlaying, step, totalSteps]);

  useEffect(() => {
    if (!Canvas && import.meta.env.DEV) {
      console.warn(`未注册的 AnimationType: ${config.type}`);
    }
  }, [Canvas, config.type]);

  const canPrev = stepIndex > 0;
  const canNext = stepIndex < totalSteps - 1;
  const stepLabel = useMemo(
    () => `${Math.min(stepIndex + 1, totalSteps)} / ${totalSteps}`,
    [stepIndex, totalSteps],
  );

  if (!step) return null;

  return (
    <div className={styles.player}>
      <h3>{config.title}</h3>
      {Canvas ? (
        <Canvas
          config={config}
          step={step}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          reducedMotion={reducedMotion}
        />
      ) : (
        <div className={styles.fallback}>
          <strong>{step.title}</strong>
          <p>{step.description}</p>
        </div>
      )}

      <div className={styles.controls}>
        <button type="button" disabled={!canPrev} onClick={() => setStepIndex((i) => i - 1)}>
          上一步
        </button>
        <button
          type="button"
          disabled={reducedMotion}
          onClick={() => {
            if (stepIndex >= totalSteps - 1) setStepIndex(0);
            setPlaying((value) => !value);
          }}
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button type="button" disabled={!canNext} onClick={() => setStepIndex((i) => i + 1)}>
          下一步
        </button>
        <button
          type="button"
          onClick={() => {
            setStepIndex(0);
            setPlaying(false);
          }}
        >
          重置
        </button>
        <span>{stepLabel}</span>
      </div>

      <div className={styles.caption}>
        <strong>{step.title}</strong>
        <p>{step.description}</p>
      </div>
    </div>
  );
}

export default AnimationPlayer;
