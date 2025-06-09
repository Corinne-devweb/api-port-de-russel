const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Import des routes
const indexRouter = require("./routes/index");

const initClientDbConnection = require("./db/mongo");

const app = express();

// Connexion MongoDB
(async () => {
  try {
    await initClientDbConnection();
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
})();

// Middleware CORS
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Authorization"],
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ====== CONFIGURATION EJS ======
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Pour les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes principales
app.use("/", indexRouter);

// Gestion des routes non trouvées (404)

app.use((req, res) => {
  // Gère les 404 en HTML si acceptée, sinon JSON
  if (req.accepts("html")) {
    // Redirection vers la page d'accueil au lieu d'une vue 404
    res.status(404).redirect("/home");
  } else {
    res.status(404).json({
      name: "API",
      version: "1.0",
      status: 404,
      message: "not_found",
    });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    name: "API",
    version: "1.0",
    status: 500,
    message: "Erreur interne du serveur",
  });
});

module.exports = app;
