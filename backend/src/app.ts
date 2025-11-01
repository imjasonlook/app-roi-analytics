import express from "express";
import cors from "cors";
import roiRouter from "./routes/roi.js";
import importRouter from "./routes/import.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/roi", roiRouter);
app.use("/api/import", importRouter);

export default app;
