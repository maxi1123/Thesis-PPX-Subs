import express from "express";
import * as streamsController from "../controllers/streams.controller.js";
const router = express.Router();

router.get("/", streamsController.get);
router.get("/streamUrl", streamsController.getStreamUrl);

export default router;
