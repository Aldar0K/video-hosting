"use client";

import { useRef, useState } from "react";

type VideoPlayerProps = {
  initialUrl?: string;
};

const VideoPlayer = ({ initialUrl = "http://localhost:3001/video" }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [url, setUrl] = useState<string>(initialUrl);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleLoad = () => {
    const el = videoRef.current;
    if (!el) return;
    el.load();
    el.play().catch(() => {});
  };

  const handleToggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (delta: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, el.currentTime + delta);
  };

  const handleVolume = (delta: number) => {
    const el = videoRef.current;
    if (!el) return;
    el.volume = Math.min(1, Math.max(0, el.volume + delta));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Введите URL видео"
          aria-label="Поле ввода URL видео"
        />
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
          onClick={handleLoad}
        >
          Загрузить
        </button>
      </div>

      <div className="rounded-md border border-border overflow-hidden bg-card text-card-foreground">
        <video
          ref={videoRef}
          className="w-full h-auto"
          src={url}
          controls={false}
          preload="metadata"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="flex items-center gap-2 p-3 border-t border-border bg-muted/60">
          <button
            className="rounded bg-muted px-3 py-2 text-sm text-foreground hover:opacity-90"
            onClick={handleToggle}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? "Пауза" : "Старт"}
          </button>
          <button
            className="rounded bg-muted px-3 py-2 text-sm text-foreground hover:opacity-90"
            onClick={() => handleSeek(-10)}
            aria-label="Назад 10с"
          >
            -10с
          </button>
          <button
            className="rounded bg-muted px-3 py-2 text-sm text-foreground hover:opacity-90"
            onClick={() => handleSeek(10)}
            aria-label="Вперед 10с"
          >
            +10с
          </button>
          <button
            className="rounded bg-muted px-3 py-2 text-sm text-foreground hover:opacity-90"
            onClick={() => handleVolume(-0.1)}
            aria-label="Тише"
          >
            Vol-
          </button>
          <button
            className="rounded bg-muted px-3 py-2 text-sm text-foreground hover:opacity-90"
            onClick={() => handleVolume(0.1)}
            aria-label="Громче"
          >
            Vol+
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;


