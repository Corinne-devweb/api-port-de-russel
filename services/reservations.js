const Reservation = require("../models/reservations");

const reservationService = {
  // Récupérer toutes les réservations
  async getAll() {
    try {
      return await Reservation.find();
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les réservations d'un catway
  async getByCatway(catwayNumber) {
    try {
      return await Reservation.find({ catwayNumber: parseInt(catwayNumber) });
    } catch (error) {
      throw error;
    }
  },

  // Récupérer une réservation par son ID
  async getById(reservationId) {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }
      return reservation;
    } catch (error) {
      throw error;
    }
  },

  // Créer une réservation
  async create(reservationData) {
    try {
      const reservation = new Reservation(reservationData);
      return await reservation.save();
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une réservation
  async update(reservationId, updateData) {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      return reservation;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une réservation
  async delete(reservationId) {
    try {
      const reservation = await Reservation.findByIdAndDelete(reservationId);

      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }

      return reservation;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = reservationService;
