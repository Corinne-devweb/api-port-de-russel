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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   catwayNumber:
 *                     type: integer
 *                   catwayType:
 *                     type: string
 *                     enum: [long, short]
 *                   catwayState:
 *                     type: string
 */
router.get("/", catwaysController.getAll);

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Récupère un catway par son numéro (utilisé comme ID)
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *     responses:
 *       200:
 *         description: Détails du catway
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 catwayNumber:
 *                   type: integer
 *                 catwayType:
 *                   type: string
 *                 catwayState:
 *                   type: string
 *       400:
 *         description: Numéro invalide
 *       404:
 *         description: Catway non trouvé
 */
router.get("/:id", (req, res, next) => {
  const catwayNumber = parseInt(req.params.id, 10);
  if (isNaN(catwayNumber)) {
    return res
      .status(400)
      .json({ error: "L'ID doit être un entier valide (numéro de catway)" });
  }
  req.params.id = catwayNumber;
  catwaysController.getById(req, res, next);
});

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
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 minimum: 1
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *               catwayState:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Numéro de catway déjà existant
 *       401:
 *         description: Non autorisé
 */
router.post("/", authMiddleware, catwaysController.create);

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Met à jour un catway existant (seulement catwayState)
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayState
 *             properties:
 *               catwayState:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Catway mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.put("/:id", authMiddleware, (req, res, next) => {
  const catwayNumber = parseInt(req.params.id, 10);
  if (isNaN(catwayNumber)) {
    return res
      .status(400)
      .json({ error: "L'ID doit être un entier valide (numéro de catway)" });
  }
  req.params.id = catwayNumber;
  catwaysController.update(req, res, next);
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Supprime un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       400:
 *         description: Numéro invalide
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.delete("/:id", authMiddleware, (req, res, next) => {
  const catwayNumber = parseInt(req.params.id, 10);
  if (isNaN(catwayNumber)) {
    return res
      .status(400)
      .json({ error: "L'ID doit être un entier valide (numéro de catway)" });
  }
  req.params.id = catwayNumber;
  catwaysController.delete(req, res, next);
});

module.exports = router;
