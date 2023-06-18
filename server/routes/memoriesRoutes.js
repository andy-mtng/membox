const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const memoriesController = require("../controllers/memoriesController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "routes/tempImages/")
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
// const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(requireAuth);

router.get("/", memoriesController.getMemories);

router.post("/", upload.single('image'), memoriesController.createMemory);

router.delete("/", memoriesController.deleteMemory);

router.put("/", upload.single('image'), memoriesController.editMemory);

module.exports = router;