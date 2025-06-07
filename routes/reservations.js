const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

/**
 * @swagger
 * /catways/{catwayId}/reservations:
 *   get:
 *     summary: Récupère toutes les réservations d’un catway
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Liste des réservations
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get(
  "/catways/:catwayId/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.getByCatway
);

/**
 * @swagger
 * /catways/{catwayId}/reservations/{reservationId}:
 *   get:
 *     summary: Récupère une réservation spécifique
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.getById
);

/**
 * @swagger
 * /catways/{catwayId}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.post(
  "/catways/:catwayId/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.create
);

/**
 * @swagger
 * /catways/{catwayId}/reservations/{reservationId}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reservationId
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
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               catwayNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.put(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.update
);

/**
 * @swagger
 * /catways/{catwayId}/reservations/{reservationId}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.delete(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.delete
);

module.exports = router;
