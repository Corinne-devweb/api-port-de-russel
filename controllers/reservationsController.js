const reservationService = require("../services/reservations");

const reservationController = {
  getAll: async (req, res) => {
    try {
      const reservations = await reservationService.getAll();
      res.status(200).json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

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

  update: async (req, res) => {
    try {
      const { catwayId, reservationId } = req.params;
      const reservation = await reservationService.getById(reservationId);

      if (reservation.catwayNumber !== Number(catwayId)) {
        return res
          .status(404)
          .json({ message: "Réservation non trouvée pour ce catway" });
      }

      // Pour éviter que catwayNumber soit modifié vers un autre catway que celui de l'URL
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
