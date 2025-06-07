const express = require("express");
const router = express.Router();
const catwaysController = require("../controllers/catwaysController");
const authMiddleware = require("../middleware/auth");

// Routes publiques
router.get("/", catwaysController.getAll);
router.get("/:catwayId", catwaysController.getById);

// Routes protégées (création, modification, suppression)
router.post("/", authMiddleware, catwaysController.create);
router.put("/:catwayId", authMiddleware, catwaysController.update);
router.delete("/:catwayId", authMiddleware, catwaysController.delete);

module.exports = router;
