import express from "express";
import * as usageController from "../controllers/usage.controller.js";
const router = express.Router();

router.get("/", usageController.get);
router.post("/", usageController.post);
router.delete("/", usageController.deleteEntry);
router.post("/db", usageController.postUsage);
router.post("/oracle", usageController.postToOracle);

export default router;
