const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const memoriesController = require("../controllers/memoriesController");

router.use(requireAuth);

router.get("/", memoriesController.getMemories);

router.post("/", memoriesController.createMemory);

router.delete("/", memoriesController.deleteMemory);

module.exports = router;