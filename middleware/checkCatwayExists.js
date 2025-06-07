const Catway = require("../models/catways");

const checkCatwayExists = async (req, res, next) => {
  try {
    const catwayIdRaw = req.params.catwayId || req.params.id;
    const catwayId = parseInt(catwayIdRaw, 10);

    if (isNaN(catwayId)) {
      return res.status(400).json({ message: "Identifiant catway invalide." });
    }

    const catway = await Catway.findOne({ catwayNumber: catwayId });

    if (!catway) {
      return res.status(404).json({
        message: "Catway non trouvé",
        details: `catwayNumber: ${catwayId}`,
      });
    }

    req.catway = catway;
    next();
  } catch (err) {
    console.error("Erreur dans checkCatwayExists:", err);
    res.status(500).json({
      message: "Erreur lors de la vérification du catway",
      error: err.message,
    });
  }
};

module.exports = checkCatwayExists;
