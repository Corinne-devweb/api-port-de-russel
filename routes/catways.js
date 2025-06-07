const express = require("express");
const router = express.Router();
const catwaysController = require("../controllers/catwaysController");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways
 */

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Récupère tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways
 */
router.get("/", catwaysController.getAll);

/**
 * @swagger
 * /catways/{catwayId}:
 *   get:
 *     summary: Récupère un catway par ID
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *       404:
 *         description: Catway non trouvé
 */
router.get("/:catwayId", catwaysController.getById);

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Crée un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Catway créé
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post("/", authMiddleware, catwaysController.create);

/**
 * @swagger
 * /catways/{catwayId}:
 *   put:
 *     summary: Met à jour un catway existant
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.put("/:catwayId", authMiddleware, catwaysController.update);

/**
 * @swagger
 * /catways/{catwayId}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.delete("/:catwayId", authMiddleware, catwaysController.delete);

module.exports = router;
