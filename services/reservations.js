const Reservation = require("../models/reservations");
const Catway = require("../models/catways");

module.exports = {
  /**
   * Récupère toutes les réservations.
   * @returns {Promise<Array>} Liste des réservations
   * @throws {Error} En cas d'erreur serveur
   */
  getAll: async () => {
    try {
      return await Reservation.find();
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },

  /**
   * Crée une nouvelle réservation après validation des données.
   * @param {Object} data - Données de la réservation
   * @param {number|string} data.catwayNumber - Numéro du catway réservé
   * @param {string} data.clientName - Nom du client
   * @param {string} data.boatName - Nom du bateau
   * @param {string|Date} data.startDate - Date de début de réservation
   * @param {string|Date} data.endDate - Date de fin de réservation
   * @returns {Promise<Object>} La réservation créée
   * @throws {Error} Si des champs sont manquants ou si le catway n'existe pas
   */
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

  /**
   * Récupère une réservation par son identifiant.
   * @param {string} reservationId - Identifiant MongoDB de la réservation
   * @returns {Promise<Object>} La réservation trouvée
   * @throws {Error} Si la réservation n'existe pas ou erreur serveur
   */
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

  /**
   * Met à jour une réservation existante.
   * Vérifie que le nouveau catwayNumber, si présent, existe.
   * @param {string} reservationId - Identifiant de la réservation
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} La réservation mise à jour
   * @throws {Error} Si le catway n'existe pas, la réservation n'existe pas ou erreur serveur
   */
  update: async (reservationId, updateData) => {
    try {
      if (updateData.catwayNumber !== undefined) {
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

  /**
   * Supprime une réservation par son identifiant.
   * @param {string} reservationId - Identifiant de la réservation à supprimer
   * @returns {Promise<Object>} Message confirmant la suppression
   * @throws {Error} Si la réservation n'existe pas ou erreur serveur
   */
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

  /**
   * Récupère toutes les réservations liées à un catway donné.
   * @param {number|string} catwayId - Numéro du catway
   * @returns {Promise<Array>} Liste des réservations pour ce catway
   * @throws {Error} En cas d'erreur serveur
   */
  getByCatway: async (catwayId) => {
    try {
      return await Reservation.find({ catwayNumber: Number(catwayId) });
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },
};
