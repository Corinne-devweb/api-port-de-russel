// services/catways.js

const Catway = require("../models/catways");

module.exports = {
  getAll: async () => {
    return await Catway.find();
  },

  getById: async (catwayId) => {
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    if (!catway) throw new Error("Catway non trouvé");
    return catway;
  },

  create: async ({ catwayNumber, catwayType, catwayState }) => {
    if (!catwayNumber || !catwayType || !catwayState) {
      throw new Error("Tous les champs sont requis");
    }

    const existing = await Catway.findOne({ catwayNumber });
    if (existing) throw new Error("Un catway avec ce numéro existe déjà");

    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    return await newCatway.save();
  },

  update: async (catwayId, { catwayState }) => {
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    if (!catway) throw new Error("Catway non trouvé");

    if (catwayState) {
      catway.catwayState = catwayState;
    }

    return await catway.save();
  },

  delete: async (catwayId) => {
    const catway = await Catway.findOne({ catwayNumber: catwayId });
    if (!catway) throw new Error("Catway non trouvé");

    await Catway.deleteOne({ catwayNumber: catwayId });
    return { message: "Catway supprimé avec succès" };
  },
};
