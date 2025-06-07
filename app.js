const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

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

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes principales
app.use("/", indexRouter);

// Gestion des routes non trouvées (404)
app.use((req, res) => {
  res.status(404).json({
    name: "API",
    version: "1.0",
    status: 404,
    message: "not_found",
  });
});

module.exports = app;
