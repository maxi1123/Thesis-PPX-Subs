import express from "express";
import * as usageController from "../controllers/usage.controller.js";
const router = express.Router();

router.get("/", usageController.get);
router.post("/", usageController.post);

export default router;
