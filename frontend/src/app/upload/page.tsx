"use client";

import { useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Выберите файл");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `Upload failed: ${resp.status}`);
      }
      const data = (await resp.json()) as { id: string; url: string };
      setResultUrl(`http://localhost:3001${data.url}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <h1 className="text-xl font-semibold">Загрузка видео</h1>

        <input
          type="file"
          accept="video/*"
          onChange={handleSelect}
          className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
          aria-label="Выберите видеофайл"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {isLoading ? "Загрузка..." : "Загрузить"}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {resultUrl && (
          <div className="space-y-2">
            <p className="text-sm">Файл загружен:</p>
            <a
              href={resultUrl}
              className="text-blue-400 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {resultUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;


