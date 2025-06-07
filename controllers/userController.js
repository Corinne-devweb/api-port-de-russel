const jwt = require("jsonwebtoken");
const userService = require("../services/users");

/**
 * Créer un nouvel utilisateur.
 * @param {import("express").Request} req - Contient les données de l'utilisateur dans req.body
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Récupérer tous les utilisateurs, avec pagination optionnelle.
 * @param {import("express").Request} req - req.query.page et req.query.limit sont optionnels
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const users = await userService.getAllUsers(Number(page), Number(limit));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Récupérer un utilisateur par son email.
 * @param {import("express").Request} req - req.params.email
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.params.email);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Mettre à jour un utilisateur par son email.
 * @param {import("express").Request} req - req.params.email et req.body données mises à jour
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.email,
      req.body
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Supprimer un utilisateur par son email.
 * @param {import("express").Request} req - req.params.email
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.email);
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/**
 * Authentifier un utilisateur (login) et générer un token JWT.
 * @param {import("express").Request} req - req.body doit contenir email et password
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      user: { email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Déconnexion utilisateur (simple message de succès).
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
};
