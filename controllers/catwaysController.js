const catwayService = require("../services/catways");

/**
 * Controller pour gérer les catways.
 */
const catwayController = {
  /**
   * Récupère tous les catways.
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getAll: async (req, res) => {
    try {
      const catways = await catwayService.getAll();
      res.status(200).json(catways);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      const catway = await catwayService.getById(catwayNumber);
      res.status(200).json(catway);
    } catch (error) {
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
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
      const newCatway = await catwayService.create(req.body);
      res.status(201).json(newCatway);
    } catch (error) {
      // Les erreurs liées aux données sont en 400 (ex: champ manquant, existant)
      res.status(400).json({ message: error.message });
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
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      // Selon les consignes : seul catwayState peut être modifié
      const { catwayState } = req.body;
      if (!catwayState) {
        return res
          .status(400)
          .json({
            message: "Seul l'état du catway (catwayState) peut être modifié",
          });
      }

      const updateData = { catwayState };
      const updated = await catwayService.update(catwayNumber, updateData);
      res.status(200).json(updated);
    } catch (error) {
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
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
          .json({ message: "L'ID du catway doit être un nombre" });
      }

      const result = await catwayService.delete(catwayNumber);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Catway non trouvé") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = catwayController;
