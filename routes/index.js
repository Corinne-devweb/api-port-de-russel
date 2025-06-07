// routes/index.js

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Point d'entrée de l'API
 *     description: Vérifie si l'API fonctionne correctement en renvoyant un message simple.
 *     responses:
 *       200:
 *         description: API est opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API is working!
 */

/**
 * Route GET racine qui renvoie un message de fonctionnement.
 */
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

/**
 * @swagger
 * /{any}:
 *   get:
 *     summary: Route non trouvée
 *     description: Gestion des routes non définies (404).
 *     parameters:
 *       - in: path
 *         name: any
 *         schema:
 *           type: string
 *         required: true
 *         description: Toute route non définie dans l'API.
 *     responses:
 *       404:
 *         description: Route non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Route non trouvée
 */

/**
 * Middleware pour gérer les routes non trouvées (404)
 */
router.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = router;
