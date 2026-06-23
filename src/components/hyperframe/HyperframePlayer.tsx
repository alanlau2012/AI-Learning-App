import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HyperframeMaterial } from '../../types';
import styles from './HyperframePlayer.module.css';

interface HyperframePlayerProps {
  material: HyperframeMaterial;
}

type HyperframeCommandName = 'play' | 'pause' | 'restart' | 'seek' | 'query';

interface HyperframeCommandMessage {
  source: 'ai-learning-app';
  type: 'hyperframe:command';
  materialId: string;
  command: HyperframeCommandName;
  seconds?: number;
}

interface HyperframeEventMessage {
  source: 'hyperframe';
  type: 'hyperframe:event';
  materialId: string;
  event: 'ready' | 'state';
  time: number;
  duration: number;
  paused: boolean;
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

function isHyperframeEventMessage(value: unknown): value is HyperframeEventMessage {
  if (!value || typeof value !== 'object') return false;
  const message = value as Partial<HyperframeEventMessage>;
  return (
    message.source === 'hyperframe' &&
    message.type === 'hyperframe:event' &&
    typeof message.materialId === 'string' &&
    (message.event === 'ready' || message.event === 'state') &&
    typeof message.time === 'number' &&
    typeof message.duration === 'number' &&
    typeof message.paused === 'boolean'
  );
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

export function HyperframePlayer({ material }: HyperframePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(material.durationSeconds);
  const [scale, setScale] = useState(1);
  const reducedMotion = useReducedMotion();

  const postCommand = useCallback((command: HyperframeCommandName, seconds?: number) => {
    const contentWindow = iframeRef.current?.contentWindow;
    if (!contentWindow) return;

    const message: HyperframeCommandMessage = {
      source: 'ai-learning-app',
      type: 'hyperframe:command',
      materialId: material.id,
      command,
      seconds,
    };
    contentWindow.postMessage(message, '*');
  }, [material.id]);


  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? material.width;
      setScale(Math.max(0.1, width / material.width));
    });

    observer.observe(stage);
    return () => observer.disconnect();
  }, [material.width]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isHyperframeEventMessage(event.data)) return;
      if (event.data.materialId !== material.id) return;

      const nextDuration = event.data.duration || material.durationSeconds;
      const nextTime = Math.min(Math.max(0, event.data.time), nextDuration);
      setDuration(nextDuration);
      setCurrentTime(nextTime);
      setPlaying(!event.data.paused && nextTime < nextDuration - 0.05);
      if (event.data.event === 'ready') setReady(true);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [material.durationSeconds, material.id]);

  useEffect(() => {
    if (reducedMotion && playing) {
      postCommand('pause');
    }
  }, [playing, postCommand, reducedMotion]);

  const onLoad = () => {
    setReady(false);
    setCurrentTime(0);
    setPlaying(false);
    setDuration(material.durationSeconds);
    postCommand('query');
  };

  const playPause = () => {
    if (reducedMotion) return;

    if (playing) {
      postCommand('pause');
      setPlaying(false);
      return;
    }

    if (currentTime >= duration - 0.05) {
      postCommand('seek', 0);
      setCurrentTime(0);
    }
    postCommand('play');
    setPlaying(true);
  };

  const restart = () => {
    if (reducedMotion) {
      postCommand('pause');
      postCommand('seek', 0);
      setCurrentTime(0);
      setPlaying(false);
      return;
    }

    postCommand('restart');
    setCurrentTime(0);
    setPlaying(true);
  };

  const seekTo = (seconds: number) => {
    postCommand('seek', seconds);
    setCurrentTime(seconds);
    setPlaying(false);
  };

  const previousChapter = () => {
    const previous = [...material.chapters]
      .reverse()
      .find((chapter) => chapter.startSeconds < currentTime - 0.75);
    seekTo(previous?.startSeconds ?? 0);
  };

  const nextChapter = () => {
    const next = material.chapters.find((chapter) => chapter.startSeconds > currentTime + 0.75);
    seekTo(next?.startSeconds ?? Math.max(0, duration - 0.1));
  };

  const currentChapter = useMemo(
    () =>
      [...material.chapters]
        .reverse()
        .find((chapter) => chapter.startSeconds <= currentTime + 0.1),
    [currentTime, material.chapters],
  );

  return (
    <div className={styles.player}>
      <div className={styles.viewport} ref={stageRef} aria-label={`${material.title} 播放器`}>
        <iframe
          ref={iframeRef}
          title={material.title}
          src={material.src}
          className={styles.frame}
          loading="lazy"
          sandbox="allow-scripts"
          onLoad={onLoad}
          style={{
            width: material.width,
            height: material.height,
            transform: `scale(${scale})`,
          }}
        />
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={previousChapter} disabled={!ready} aria-label="上一场景">
          上一场景
        </button>
        <button type="button" onClick={playPause} disabled={!ready || reducedMotion}>
          {playing ? '暂停' : '播放'}
        </button>
        <button type="button" onClick={nextChapter} disabled={!ready} aria-label="下一场景">
          下一场景
        </button>
        <button type="button" onClick={restart} disabled={!ready}>
          重播
        </button>
        <span className={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className={styles.chapterBar} aria-label="短片章节">
        {material.chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            onClick={() => seekTo(chapter.startSeconds)}
            disabled={!ready}
            className={chapter.id === currentChapter?.id ? styles.chapterActive : styles.chapter}
          >
            {chapter.title}
          </button>
        ))}
      </div>

      {reducedMotion && (
        <p className={styles.motionHint}>已按系统设置关闭连续播放，可使用章节按钮静态查看。</p>
      )}
    </div>
  );
}

export default HyperframePlayer;
