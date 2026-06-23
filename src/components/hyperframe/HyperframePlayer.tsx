import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { HyperframeMaterial } from '../../types';
import styles from './HyperframePlayer.module.css';

interface HyperframeTimeline {
  play: () => HyperframeTimeline;
  pause: () => HyperframeTimeline;
  restart: () => HyperframeTimeline;
  seek: (time: number, suppressEvents?: boolean) => HyperframeTimeline;
  time: () => number;
  duration: () => number;
  paused: () => boolean;
}

interface HyperframeWindow extends Window {
  __timelines?: Record<string, HyperframeTimeline>;
}

interface HyperframePlayerProps {
  material: HyperframeMaterial;
}

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
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
  const frameRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(material.durationSeconds);
  const [scale, setScale] = useState(1);
  const reducedMotion = useReducedMotion();

  const getTimeline = useCallback((): HyperframeTimeline | undefined => {
    try {
      const contentWindow = iframeRef.current?.contentWindow as HyperframeWindow | null | undefined;
      return contentWindow?.__timelines?.[material.id];
    } catch {
      return undefined;
    }
  }, [material.id]);

  const syncTime = useCallback(() => {
    const timeline = getTimeline();
    if (!timeline) return;
    const nextTime = timeline.time();
    setCurrentTime(nextTime);
    setPlaying(!timeline.paused() && nextTime < duration - 0.05);
  }, [duration, getTimeline]);

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
    if (!playing) {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      return;
    }

    const tick = () => {
      syncTime();
      frameRef.current = window.requestAnimationFrame(tick);
    };
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [playing, syncTime]);

  useEffect(() => {
    if (reducedMotion && playing) {
      getTimeline()?.pause();
    }
  }, [getTimeline, playing, reducedMotion]);

  const onLoad = () => {
    const timeline = getTimeline();
    if (!timeline) {
      setReady(false);
      return;
    }
    timeline.pause();
    timeline.seek(0, false);
    setDuration(timeline.duration() || material.durationSeconds);
    setCurrentTime(0);
    setPlaying(false);
    setReady(true);
  };

  const playPause = () => {
    if (reducedMotion) return;
    const timeline = getTimeline();
    if (!timeline) return;

    if (playing) {
      timeline.pause();
      setPlaying(false);
      syncTime();
      return;
    }

    if (currentTime >= duration - 0.05) {
      timeline.seek(0, false);
      setCurrentTime(0);
    }
    timeline.play();
    setPlaying(true);
  };

  const restart = () => {
    const timeline = getTimeline();
    if (!timeline) return;

    if (reducedMotion) {
      timeline.pause();
      timeline.seek(0, false);
      setCurrentTime(0);
      setPlaying(false);
      return;
    }

    timeline.restart();
    setCurrentTime(0);
    setPlaying(true);
  };

  const seekTo = (seconds: number) => {
    const timeline = getTimeline();
    if (!timeline) return;
    timeline.pause();
    timeline.seek(seconds, false);
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
