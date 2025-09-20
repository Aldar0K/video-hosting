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
          className="flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Введите URL видео"
          aria-label="Поле ввода URL видео"
        />
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          onClick={handleLoad}
        >
          Загрузить
        </button>
      </div>

      <div className="rounded-md border border-slate-800 overflow-hidden bg-black">
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

        <div className="flex items-center gap-2 p-3 border-t border-slate-800 bg-slate-900/60">
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            onClick={handleToggle}
            aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? "Пауза" : "Старт"}
          </button>
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            onClick={() => handleSeek(-10)}
            aria-label="Назад 10с"
          >
            -10с
          </button>
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            onClick={() => handleSeek(10)}
            aria-label="Вперед 10с"
          >
            +10с
          </button>
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
            onClick={() => handleVolume(-0.1)}
            aria-label="Тише"
          >
            Vol-
          </button>
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm hover:bg-slate-700"
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


