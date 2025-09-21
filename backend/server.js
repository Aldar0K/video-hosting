const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 3001;

// CORS для фронтенда на 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Range"],
    credentials: false,
  })
);

// Папка для загрузок
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка загрузчика файлов
const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".mp4";
    const safeExt = [".mp4", ".webm", ".mov", ".mkv"].includes(ext.toLowerCase())
      ? ext
      : ".mp4";
    cb(null, `${generateId()}${safeExt}`);
  },
});
const upload = multer({ storage });

// Загрузка видео
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File is required" });
  }
  const filename = req.file.filename;
  const id = path.parse(filename).name;
  return res.status(201).json({ id, url: `/videos/${filename}` });
});

// Простая мапа content-type по расширению
const getVideoContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".mkv") return "video/x-matroska";
  return "video/mp4";
};

// Хелпер для стриминга по Range
const streamVideoFile = (filePath, req, res) => {
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": getVideoContentType(filePath),
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (isNaN(start) || isNaN(end) || start > end || start < 0 || end >= fileSize) {
    return res.status(416).set("Content-Range", `bytes */${fileSize}`).end();
  }

  const chunkSize = end - start + 1;
  const file = fs.createReadStream(filePath, { start, end });
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": getVideoContentType(filePath),
  };
  res.writeHead(206, headers);
  file.pipe(res);
};

// Эндпоинт для получения видео
app.get("/video", (req, res) => {
  const videoPath = path.join(uploadsDir, "sample.mp4");
  return streamVideoFile(videoPath, req, res);
});

// Стриминг по имени файла
app.get("/videos/:filename", (req, res) => {
  const filePath = path.join(uploadsDir, req.params.filename);
  return streamVideoFile(filePath, req, res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
