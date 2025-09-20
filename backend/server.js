const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

// Эндпоинт для получения видео
app.get("/video", (req, res) => {
  const videoPath = path.join(__dirname, "..", "videos", "sample.mp4");

  // Проверим наличие файла
  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (!range) {
    // Если Range не указан → отдаем весь файл (неоптимально)
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  // Пример Range-заголовка: "bytes=0-"
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(videoPath, { start, end });

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers); // Partial Content
  file.pipe(res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
