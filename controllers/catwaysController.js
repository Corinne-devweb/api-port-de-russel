// controllers/catwaysController.js

const catwayService = require("../services/catways");

/**
 * Récupérer tous les catways.
 */
exports.getAll = async (req, res) => {
  try {
    const catways = await catwayService.getAll();
    res.status(200).json(catways);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer un catway par son numéro.
 */
exports.getById = async (req, res) => {
  try {
    const catway = await catwayService.getById(req.params.catwayId);
    res.status(200).json(catway);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Créer un catway.
 */
exports.create = async (req, res) => {
  try {
    const newCatway = await catwayService.create(req.body);
    res.status(201).json(newCatway);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Mettre à jour un catway.
 */
exports.update = async (req, res) => {
  try {
    const updated = await catwayService.update(req.params.catwayId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Supprimer un catway.
 */
exports.delete = async (req, res) => {
  try {
    const result = await catwayService.delete(req.params.catwayId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
