const catwayService = require("../services/catways");

/**
 * Controller pour gérer les catways.
 */
const catwaysController = {
  /**
   * Récupère tous les catways (API JSON).
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getAll: async (req, res) => {
    try {
      const catways = await catwayService.getAll();
      res.status(200).json(catways);
    } catch (error) {
      console.error("Erreur getAll catways:", error);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Récupère tous les catways (pour affichage dans la vue EJS).
   * Méthode dédiée pour les routes frontend.
   * @returns {Promise<Array>}
   */
  getAllData: async () => {
    try {
      const catways = await catwayService.getAll();
      return catways || [];
    } catch (error) {
      console.error("Erreur getAllData catways:", error);
      throw new Error(error.message);
    }
  },

  /**
   * Récupère un catway par son numéro (id dans l'URL = catwayNumber).
   * @param {import("express").Request} req - Contient params.id (catwayNumber)
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getById: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ error: "L'ID du catway doit être un nombre" });
      }

      const catway = await catwayService.getById(catwayNumber);
      if (!catway) {
        return res.status(404).json({ error: "Catway non trouvé" });
      }

      res.status(200).json(catway);
    } catch (error) {
      console.error("Erreur getById catway:", error);
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Crée un nouveau catway.
   * @param {import("express").Request} req - Contient les données du catway dans req.body
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  create: async (req, res) => {
    try {
      // Validation des données requises
      const { catwayNumber, catwayType, catwayState } = req.body;

      if (!catwayNumber || !catwayType || !catwayState) {
        return res.status(400).json({
          error:
            "Tous les champs sont requis (catwayNumber, catwayType, catwayState)",
        });
      }

      if (!["long", "short"].includes(catwayType)) {
        return res.status(400).json({
          error: "Le type doit être 'long' ou 'short'",
        });
      }

      const newCatway = await catwayService.create(req.body);
      res.status(201).json(newCatway);
    } catch (error) {
      console.error("Erreur create catway:", error);

      // Gestion des erreurs spécifiques
      if (
        error.message.includes("déjà existant") ||
        error.message.includes("duplicate")
      ) {
        return res
          .status(409)
          .json({ error: "Ce numéro de catway existe déjà" });
      }

      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Met à jour un catway existant.
   * Note: Selon les consignes, seul catwayState peut être modifié.
   * @param {import("express").Request} req - Contient params.id et req.body
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  update: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ error: "L'ID du catway doit être un nombre" });
      }

      // Selon les consignes : seul catwayState peut être modifié
      const { catwayState } = req.body;
      if (!catwayState || catwayState.trim() === "") {
        return res.status(400).json({
          error:
            "L'état du catway (catwayState) est requis et ne peut pas être vide",
        });
      }

      const updateData = { catwayState: catwayState.trim() };
      const updated = await catwayService.update(catwayNumber, updateData);

      if (!updated) {
        return res.status(404).json({ error: "Catway non trouvé" });
      }

      res.status(200).json(updated);
    } catch (error) {
      console.error("Erreur update catway:", error);
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Supprime un catway.
   * @param {import("express").Request} req - Contient params.id (catwayNumber)
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  delete: async (req, res) => {
    try {
      const catwayNumber = Number(req.params.id);
      if (isNaN(catwayNumber)) {
        return res
          .status(400)
          .json({ error: "L'ID du catway doit être un nombre" });
      }

      const result = await catwayService.delete(catwayNumber);

      if (!result) {
        return res.status(404).json({ error: "Catway non trouvé" });
      }

      res.status(200).json({
        message: `Catway ${catwayNumber} supprimé avec succès`,
        deletedCatway: result,
      });
    } catch (error) {
      console.error("Erreur delete catway:", error);
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = catwaysController;
