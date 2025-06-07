const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get("/", authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Récupérer un utilisateur par email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 */
router.get("/:email", authMiddleware, userController.getUserByEmail);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post("/", userController.createUser);

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 */
router.put("/:email", authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete("/:email", authMiddleware, userController.deleteUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
router.post("/login", userController.loginUser);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.get("/logout", authMiddleware, userController.logoutUser);

module.exports = router;
