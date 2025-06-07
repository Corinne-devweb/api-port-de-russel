const Reservation = require("../models/reservations");
const Catway = require("../models/catways");

module.exports = {
  getAll: async () => {
    try {
      return await Reservation.find();
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },

  create: async (data) => {
    try {
      const { catwayNumber, clientName, boatName, startDate, endDate } = data;

      if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
        throw new Error("Tous les champs sont requis");
      }

      const catwayExists = await Catway.findOne({
        catwayNumber: Number(catwayNumber),
      });
      if (!catwayExists) {
        throw new Error("Catway non trouvé");
      }

      const newReservation = new Reservation({
        catwayNumber: Number(catwayNumber),
        clientName,
        boatName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      await newReservation.save();
      return newReservation;
    } catch (error) {
      throw new Error("Erreur création réservation: " + error.message);
    }
  },

  getById: async (reservationId) => {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }
      return reservation;
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },

  update: async (reservationId, updateData) => {
    try {
      if (updateData.catwayNumber) {
        const catwayExists = await Catway.findOne({
          catwayNumber: Number(updateData.catwayNumber),
        });
        if (!catwayExists) {
          throw new Error("Catway non trouvé");
        }
        updateData.catwayNumber = Number(updateData.catwayNumber);
      }

      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        updateData,
        { new: true }
      );

      if (!updatedReservation) {
        throw new Error("Réservation non trouvée");
      }

      return updatedReservation;
    } catch (error) {
      throw new Error("Échec de la mise à jour: " + error.message);
    }
  },

  delete: async (reservationId) => {
    try {
      const deleted = await Reservation.findByIdAndDelete(reservationId);
      if (!deleted) {
        throw new Error("Réservation non trouvée");
      }
      return { message: "Réservation supprimée" };
    } catch (error) {
      throw new Error("Échec de la suppression: " + error.message);
    }
  },

  getByCatway: async (catwayId) => {
    try {
      return await Reservation.find({ catwayNumber: Number(catwayId) });
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },
};
