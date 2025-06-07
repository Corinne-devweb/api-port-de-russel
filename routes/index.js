// routes/index.js

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// Import des fichiers de routes spécifiques
const userRoutes = require("./users");
const catwayRoutes = require("./catways");
const reservationRoutes = require("./reservations");

// Routes principales
router.use("/users", userRoutes);
router.use("/catways", catwayRoutes);
router.use("/reservations", reservationRoutes);

// Middleware pour gérer les routes non trouvées (404)
router.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = router;
