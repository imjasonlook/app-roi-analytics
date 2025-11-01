import { Router } from "express";
import { RoiQuerySchema } from "../utils/zod-schemas.js";
import { listFilters, queryRoi } from "../services/roi.service.js";

const router = Router();

router.get("/filters", async (_req, res) => {
  const data = await listFilters();
  res.json({ code: 0, data });
});

router.get("/", async (req, res) => {
  const parsed = RoiQuerySchema.safeParse({
    ...req.query,
    limitDays: req.query.limitDays ? Number(req.query.limitDays) : undefined
  });
  if (!parsed.success) {
    return res.status(400).json({ code: 400, error: parsed.error.flatten() });
  }
  const data = await queryRoi(parsed.data);
  res.json({ code: 0, data });
});

export default router;
