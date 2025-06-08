// services/catways.js

const Catway = require("../models/catways");

module.exports = {
  getAll: async () => {
    return await Catway.find();
  },

  getById: async (catwayNumber) => {
    if (typeof catwayNumber !== "number") {
      throw new Error("catwayNumber doit être un nombre");
    }
    const catway = await Catway.findOne({ catwayNumber });
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

  update: async (catwayNumber, { catwayState }) => {
    if (typeof catwayNumber !== "number") {
      throw new Error("catwayNumber doit être un nombre");
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) throw new Error("Catway non trouvé");

    if (catwayState) {
      catway.catwayState = catwayState;
    }

    return await catway.save();
  },

  delete: async (catwayNumber) => {
    if (typeof catwayNumber !== "number") {
      throw new Error("catwayNumber doit être un nombre");
    }

    const catway = await Catway.findOne({ catwayNumber });
    if (!catway) throw new Error("Catway non trouvé");

    await Catway.deleteOne({ catwayNumber });
    return { message: "Catway supprimé avec succès" };
  },
};
