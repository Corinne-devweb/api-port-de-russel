const reservationService = require("../services/reservations");

/**
 * Controller pour gérer les réservations.
 */
const reservationController = {
  /**
   * Récupérer toutes les réservations pour un catway donné.
   * Route: GET /catways/:id/reservations
   * @param {import("express").Request} req - Contient params.id (catwayNumber)
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getByCatway: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      const reservations = await reservationService.getByCatway(catwayNumber);
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Récupérer une réservation spécifique d'un catway.
   * Route: GET /catways/:id/reservations/:idReservation
   * @param {import("express").Request} req - Contient params.id (catwayNumber) et params.idReservation
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getById: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      const { idReservation } = req.params;

      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      const reservation = await reservationService.getById(idReservation);

      // Vérifier que la réservation appartient au catway
      if (reservation.catwayNumber !== catwayNumber) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      res.status(200).json(reservation);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Créer une nouvelle réservation pour un catway donné.
   * Route: POST /catways/:id/reservations
   * @param {import("express").Request} req - Contient params.id (catwayNumber) et body des données de réservation
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  create: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      // Ajouter le numéro de catway aux données de réservation
      const data = { ...req.body, catwayNumber };
      const newReservation = await reservationService.create(data);
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Mettre à jour une réservation d'un catway.
   * Route: PUT /catways/:id/reservations (selon consignes - pas d'idReservation dans l'URL)
   * Note: Les consignes montrent PUT /catways/:id/reservations sans idReservation
   * Il faudra clarifier avec votre service comment identifier quelle réservation modifier
   * @param {import("express").Request} req - Contient params.id (catwayNumber) et body avec les données de mise à jour
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  update: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      // Note: Les consignes ne spécifient pas comment identifier la réservation à modifier
      // Il faudrait soit :
      // 1. Ajouter idReservation dans le body
      // 2. Modifier la route pour inclure idReservation
      const { reservationId, ...updateData } = req.body;

      if (!reservationId) {
        return res
          .status(400)
          .json({
            message: "L'ID de la réservation est requis pour la modification",
          });
      }

      // Vérifier que la réservation appartient au catway
      const reservation = await reservationService.getById(reservationId);
      if (reservation.catwayNumber !== catwayNumber) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      // Empêcher la modification du catwayNumber
      const finalUpdateData = { ...updateData, catwayNumber };
      const updatedReservation = await reservationService.update(
        reservationId,
        finalUpdateData
      );
      res.status(200).json(updatedReservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Supprimer une réservation d'un catway.
   * Route: DELETE /catways/:id/reservations/:idReservation
   * @param {import("express").Request} req - Contient params.id (catwayNumber) et params.idReservation
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  delete: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      const { idReservation } = req.params;

      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      // Vérifier que la réservation appartient au catway
      const reservation = await reservationService.getById(idReservation);
      if (reservation.catwayNumber !== catwayNumber) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      const result = await reservationService.delete(idReservation);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Récupérer toutes les réservations (pour l'administration).
   * Route additionnelle pour le dashboard
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getAll: async (req, res) => {
    try {
      const reservations = await reservationService.getAll();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = reservationController;
