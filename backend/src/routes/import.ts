import { Router } from "express";
import multer from "multer";
import { importCsv } from "../services/import.service.js";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ code: 400, msg: "No file" });
  const result = await importCsv(req.file.path);
  res.json({ code: 0, data: result });
});

router.post("/path", async (req, res) => {
  const { filePath } = req.body || {};
  if (!filePath) return res.status(400).json({ code: 400, msg: "filePath required" });
  const result = await importCsv(filePath);
  res.json({ code: 0, data: result });
});

export default router;
