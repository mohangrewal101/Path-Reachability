import { Router } from "express";
import { programAnalyzerController } from "../controllers/programAnalyzer.controller";

const router = new Router();

router.post("/", programAnalyzerController.analyzeProgram);

export default router;
