const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Lister tous les utilisateurs (protégé)
router.get("/", authMiddleware, userController.getAllUsers);

// Lire un utilisateur par email (protégé)
router.get("/:email", authMiddleware, userController.getUserByEmail);

// Créer un nouvel utilisateur (public)
router.post("/", userController.createUser);

// Modifier un utilisateur (protégé)
router.put("/:email", authMiddleware, userController.updateUser);

// Supprimer un utilisateur (protégé)
router.delete("/:email", authMiddleware, userController.deleteUser);

// Connexion (public)
router.post("/login", userController.loginUser);

// Déconnexion
router.get("/logout", authMiddleware, userController.logoutUser);

module.exports = router;
