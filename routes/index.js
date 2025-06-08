const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /api:
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
router.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// Import des routes
const userRoutes = require("./users");
const catwayRoutes = require("./catways");
const reservationRoutes = require("./reservations");
const userController = require("../controllers/userController"); // ✅ AJOUTÉ pour login/logout

// Routes avec préfixe /api pour une structure RESTful cohérente
router.use("/api/users", userRoutes);
router.use("/api/catways", catwayRoutes);
router.use("/api/catways", reservationRoutes); // Sous-ressource des catways

// ✅ AJOUTÉ : Routes d'authentification (selon les consignes)
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/api/login", userController.loginUser);

/**
 * @swagger
 * /api/logout:
 *   get:
 *     summary: Déconnexion utilisateur
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/api/logout", userController.logoutUser);

// Gestion des routes inconnues (404)
router.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

module.exports = router;
