const jwt = require("jsonwebtoken");
const userService = require("../services/users");

/**
 * Controller pour gérer les utilisateurs et l'authentification.
 */
const userController = {
  /**
   * Créer un nouvel utilisateur.
   * Route: POST /users/
   * @param {import("express").Request} req - Contient les données de l'utilisateur dans req.body
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  createUser: async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Récupérer tous les utilisateurs, avec pagination optionnelle.
   * Route: GET /users/
   * @param {import("express").Request} req - req.query.page et req.query.limit sont optionnels
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getAllUsers: async (req, res) => {
    try {
      const { page, limit } = req.query;
      const users = await userService.getAllUsers(Number(page), Number(limit));
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Récupérer tous les utilisateurs (sans req, res) - pour rendu vue EJS.
   * @returns {Promise<Array>} Liste des utilisateurs
   */
  getAllUsersData: async () => {
    try {
      return await userService.getAllUsers();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Récupérer un utilisateur par son email.
   * Route: GET /users/:email
   * @param {import("express").Request} req - req.params.email
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  getUserByEmail: async (req, res) => {
    try {
      const user = await userService.getUserByEmail(req.params.email);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Mettre à jour un utilisateur par son email.
   * Route: PUT /users/:email
   * @param {import("express").Request} req - req.params.email et req.body données mises à jour
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  updateUser: async (req, res) => {
    try {
      const updatedUser = await userService.updateUser(
        req.params.email,
        req.body
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  },

  /**
   * Supprimer un utilisateur par son email.
   * Route: DELETE /users/:email
   * @param {import("express").Request} req - req.params.email
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  deleteUser: async (req, res) => {
    try {
      const deletedUser = await userService.deleteUser(req.params.email);
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  /**
   * Authentifier un utilisateur (login) et générer un token JWT.
   * Route: POST /login
   * @param {import("express").Request} req - req.body doit contenir email et password
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation des données d'entrée
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email et mot de passe sont requis" });
      }

      const user = await userService.authenticateUser(email, password);

      // Génération du token JWT (harmonisé avec le model - 24h)
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        message: "Connexion réussie",
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
        },
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  /**
   * Déconnexion utilisateur.
   * Route: GET /logout
   * Note: Avec JWT, la déconnexion côté serveur est principalement informative
   * Le client doit supprimer le token de son côté
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @returns {Promise<void>}
   */
  logoutUser: async (req, res) => {
    try {
      // Optionnel : récupérer les infos utilisateur du token pour logs
      const user = req.user; // Si middleware auth appliqué

      res.status(200).json({
        message: "Déconnexion réussie",
        instruction: "Veuillez supprimer le token côté client",
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la déconnexion" });
    }
  },
};

module.exports = userController;
