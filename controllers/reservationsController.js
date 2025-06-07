const reservationService = require("../services/reservations");

/**
 * Controller pour gérer les réservations.
 */
const reservationController = {
  /**
   * Récupérer toutes les réservations.
   * @param {import("express").Request} req - Objet requête Express
   * @param {import("express").Response} res - Objet réponse Express
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

  /**
   * Créer une nouvelle réservation pour un catway donné.
   * @param {import("express").Request} req - Contient params.catwayId et body des données de réservation
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  create: async (req, res) => {
    try {
      const catwayId = Number(req.params.catwayId);
      const data = { ...req.body, catwayNumber: catwayId };
      const newReservation = await reservationService.create(data);
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Récupérer une réservation par son ID et vérifier qu’elle appartient au catway.
   * @param {import("express").Request} req - Contient params.catwayId et params.reservationId
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getById: async (req, res) => {
    try {
      const { catwayId, reservationId } = req.params;
      const reservation = await reservationService.getById(reservationId);

      if (reservation.catwayNumber !== Number(catwayId)) {
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
   * Mettre à jour une réservation si elle appartient au catway.
   * @param {import("express").Request} req - Contient params.catwayId, params.reservationId, body updateData
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  update: async (req, res) => {
    try {
      const { catwayId, reservationId } = req.params;
      const reservation = await reservationService.getById(reservationId);

      if (reservation.catwayNumber !== Number(catwayId)) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      // Empêche la modification du catwayNumber vers un autre catway que celui de l'URL
      const updateData = { ...req.body, catwayNumber: Number(catwayId) };

      const updatedReservation = await reservationService.update(
        reservationId,
        updateData
      );
      res.status(200).json(updatedReservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Supprimer une réservation si elle appartient au catway.
   * @param {import("express").Request} req - Contient params.catwayId et params.reservationId
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  delete: async (req, res) => {
    try {
      const { catwayId, reservationId } = req.params;
      const reservation = await reservationService.getById(reservationId);

      if (reservation.catwayNumber !== Number(catwayId)) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      const result = await reservationService.delete(reservationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Récupérer toutes les réservations associées à un catway.
   * @param {import("express").Request} req - Contient params.catwayId
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getByCatway: async (req, res) => {
    try {
      const reservations = await reservationService.getByCatway(
        req.params.catwayId
      );
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = reservationController;
