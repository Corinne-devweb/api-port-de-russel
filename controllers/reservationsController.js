const reservationService = require("../services/reservations");

const reservationsController = {
  // GET /catways/:id/reservations
  getAll: async (req, res) => {
    try {
      const catwayNumber = req.params.id;
      const reservations = await reservationService.getByCatway(catwayNumber);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /catways/:id/reservations/:idReservation
  getById: async (req, res) => {
    try {
      const { idReservation } = req.params;
      const reservation = await reservationService.getById(idReservation);
      res.json(reservation);
    } catch (error) {
      if (error.message.includes("non trouvée")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // POST /catways/:id/reservations
  create: async (req, res) => {
    try {
      const catwayNumber = req.params.id;
      const reservationData = {
        catwayNumber,
        ...req.body,
      };
      const newReservation = await reservationService.create(reservationData);
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // PUT /catways/:id/reservations/:idReservation
  update: async (req, res) => {
    try {
      const catwayNumber = req.params.id;
      const { idReservation } = req.params;

      const updateData = {
        ...req.body,
        catwayNumber,
      };

      const updatedReservation = await reservationService.update(
        idReservation,
        updateData
      );
      res.json(updatedReservation);
    } catch (error) {
      if (error.message.includes("non trouvée")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  },

  // DELETE /catways/:id/reservations/:idReservation
  delete: async (req, res) => {
    try {
      const { idReservation } = req.params;
      const result = await reservationService.delete(idReservation);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes("non trouvée")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = reservationsController;
