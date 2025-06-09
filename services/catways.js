const Catway = require("../models/catways");

const catwayService = {
  // Récupérer tous les catways
  async getAll() {
    try {
      return await Catway.find();
    } catch (error) {
      throw error;
    }
  },

  // Récupérer un catway par son numéro
  async getById(catwayNumber) {
    try {
      const catway = await Catway.findOne({ catwayNumber });
      if (!catway) {
        throw new Error("Catway non trouvé");
      }
      return catway;
    } catch (error) {
      throw error;
    }
  },

  // Créer un catway
  async create(catwayData) {
    try {
      const { catwayNumber, catwayType, catwayState } = catwayData;

      // Vérifier si le numéro existe déjà
      const existingCatway = await Catway.findOne({ catwayNumber });
      if (existingCatway) {
        throw new Error("Ce numéro de catway existe déjà");
      }

      const catway = new Catway({
        catwayNumber,
        catwayType,
        catwayState,
      });

      return await catway.save();
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un catway
  async update(catwayNumber, updateData) {
    try {
      const catway = await Catway.findOneAndUpdate(
        { catwayNumber },
        updateData,
        { new: true, runValidators: true }
      );

      if (!catway) {
        throw new Error("Catway non trouvé");
      }

      return catway;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un catway
  async delete(catwayNumber) {
    try {
      const catway = await Catway.findOneAndDelete({ catwayNumber });

      if (!catway) {
        throw new Error("Catway non trouvé");
      }

      return catway;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = catwayService;
