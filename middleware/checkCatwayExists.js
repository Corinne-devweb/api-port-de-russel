const Catway = require("../models/catways");

/**
 * Middleware pour vérifier si un catway existe en base de données.
 * Récupère l'identifiant du catway depuis les paramètres de la requête,
 * vérifie que c'est un nombre valide, puis cherche le catway dans la base.
 * Si trouvé, ajoute le catway dans `req.catway` et passe au middleware suivant.
 * Sinon, renvoie une erreur 400 (id invalide) ou 404 (non trouvé).
 * En cas d'erreur serveur, renvoie une erreur 500.
 *
 * @param {Object} req - L'objet requête Express
 * @param {Object} res - L'objet réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {void} - Ne retourne rien, mais envoie une réponse en cas d'erreur
 */
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
