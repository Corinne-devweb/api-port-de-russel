// routes/reservations.js
const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

/**
 * @swagger
 * tags:
 *   name: Réservations
 *   description: Gestion des réservations (sous-ressource des catways)
 */

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   get:
 *     summary: Récupère toutes les réservations d'un catway
 *     tags: [Réservations]
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
 *         description: Liste des réservations du catway
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
 *                   clientName:
 *                     type: string
 *                   boatName:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *       404:
 *         description: Catway non trouvé
 *       401:
 *         description: Non autorisé
 */
router.get(
  "/:id/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.getByCatway
);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   get:
 *     summary: Récupère une réservation spécifique
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 catwayNumber:
 *                   type: integer
 *                 clientName:
 *                   type: string
 *                 boatName:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date
 *                 endDate:
 *                   type: string
 *                   format: date
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.get(
  "/:id/reservations/:idReservation",
  authMiddleware,
  checkCatwayExists,
  reservationsController.getById
);

/**
 * @swagger
 * /api/catways/{id}/reservations:
 *   post:
 *     summary: Crée une nouvelle réservation
 *     tags: [Réservations]
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
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               clientName:
 *                 type: string
 *                 minLength: 1
 *               boatName:
 *                 type: string
 *                 minLength: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Catway non trouvé
 *       409:
 *         description: Conflit de dates avec une réservation existante
 *       401:
 *         description: Non autorisé
 */
router.post(
  "/:id/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.create
);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   put:
 *     summary: Met à jour une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 minLength: 1
 *               boatName:
 *                 type: string
 *                 minLength: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               catwayNumber:
 *                 type: integer
 *                 description: Permet de déplacer la réservation vers un autre catway
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Réservation non trouvée
 *       409:
 *         description: Conflit de dates avec une réservation existante
 *       401:
 *         description: Non autorisé
 */
router.put(
  "/:id/reservations/:idReservation",
  authMiddleware,
  checkCatwayExists,
  reservationsController.update
);

/**
 * @swagger
 * /api/catways/{id}/reservations/{idReservation}:
 *   delete:
 *     summary: Supprime une réservation
 *     tags: [Réservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway (utilisé comme ID)
 *       - in: path
 *         name: idReservation
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       404:
 *         description: Réservation non trouvée
 *       401:
 *         description: Non autorisé
 */
router.delete(
  "/:id/reservations/:idReservation",
  authMiddleware,
  checkCatwayExists,
  reservationsController.delete
);

module.exports = router;
