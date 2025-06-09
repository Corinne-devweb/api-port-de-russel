const express = require("express");
const router = express.Router();

// Import des contrôleurs et services
const userController = require("../controllers/userController");
const reservationService = require("../services/reservations");
const catwayService = require("../services/catways");
const userService = require("../services/users");

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Vérification de l'API
 *     responses:
 *       200:
 *         description: API opérationnelle
 */
router.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// ====== ROUTES VUES EJS ======

// Stockage utilisateur connecté
let currentUser = null;

// Page d'accueil
router.get("/", function (req, res) {
  res.render("index", { error: null });
});

router.get("/home", function (req, res) {
  res.render("index", { error: null });
});

// Connexion (HTML via EJS)
router.post("/auth/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("index", { error: "Email et mot de passe requis" });
    }

    const user = await userService.authenticateUser(email, password);
    currentUser = user;

    res.redirect("/dashboard");
  } catch (error) {
    res.render("index", { error: "Identifiants incorrects" });
  }
});

// Vérification de connexion
function checkAuth(req, res, next) {
  if (!currentUser) {
    return res.redirect("/home");
  }
  next();
}

// Dashboard
router.get("/dashboard", checkAuth, async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    const catways = await catwayService.getAll();

    res.render("dashboard", {
      user: currentUser,
      reservations: reservations || [],
      totalCatways: catways ? catways.length : 0,
    });
  } catch (error) {
    res.render("dashboard", {
      user: currentUser,
      reservations: [],
      totalCatways: 0,
    });
  }
});

// Page catways
router.get("/catways", checkAuth, async (req, res) => {
  try {
    const catways = await catwayService.getAll();
    res.render("catways", { catways: catways || [] });
  } catch (error) {
    res.render("catways", { catways: [] });
  }
});

// Page réservations
router.get("/reservations", checkAuth, async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    const catways = await catwayService.getAll();
    res.render("reservations", {
      reservations: reservations || [],
      catways: catways || [],
    });
  } catch (error) {
    res.render("reservations", { reservations: [], catways: [] });
  }
});

// Page utilisateurs
router.get("/users", checkAuth, async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.render("users", { users: result.users || [] });
  } catch (error) {
    res.render("users", { users: [] });
  }
});

// Déconnexion (pour les vues EJS)
router.get("/logout", (req, res) => {
  currentUser = null;
  res.redirect("/home");
});

// ====== ROUTES CRUD POUR VUES EJS (sans JWT) ======

// Catways
router.post("/catways/create", checkAuth, async (req, res) => {
  try {
    const catway = await catwayService.create(req.body);
    res.json({ success: true, catway });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/catways/:id/update", checkAuth, async (req, res) => {
  try {
    const catway = await catwayService.update(
      parseInt(req.params.id),
      req.body
    );
    res.json({ success: true, catway });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/catways/:id/delete", checkAuth, async (req, res) => {
  try {
    await catwayService.delete(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Réservations
router.post("/reservations/:catwayId/create", checkAuth, async (req, res) => {
  try {
    const data = { ...req.body, catwayNumber: parseInt(req.params.catwayId) };
    const reservation = await reservationService.create(data);
    res.json({ success: true, reservation });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put(
  "/reservations/:catwayId/:id/update",
  checkAuth,
  async (req, res) => {
    try {
      const reservation = await reservationService.update(
        req.params.id,
        req.body
      );
      res.json({ success: true, reservation });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
);

router.delete(
  "/reservations/:catwayId/:id/delete",
  checkAuth,
  async (req, res) => {
    try {
      await reservationService.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
);

// Utilisateurs
router.post("/users/create", checkAuth, async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/users/:email/update", checkAuth, async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.email, req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/users/:email/delete", checkAuth, async (req, res) => {
  try {
    await userService.deleteUser(req.params.email);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ====== ROUTES API ======

// Import des routes API
const userRoutes = require("./users");
const catwayRoutes = require("./catways");
const reservationRoutes = require("./reservations");

// Routes API
router.use("/users", userRoutes);
router.use("/catways", catwayRoutes);
router.use("/catways", reservationRoutes);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
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
 *       401:
 *         description: Identifiants incorrects
 */
router.post("/login", userController.loginUser); // Route API REST — inchangée

module.exports = router;
