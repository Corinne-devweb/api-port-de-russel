const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API PORT DE PLAISANCE DE RUSSEL",
      version: "1.0.0",
      description:
        "Documentation de l'API de gestion des catways et réservations pour le port de plaisance de Russell.",
      contact: {
        name: "Support API",
        email: "support@portrussel.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Serveur de développement",
      },
      {
        url: "https://votre-api-production.com/api",
        description: "Serveur de production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Entrez votre token JWT obtenu via /api/login",
        },
      },
    },
    // Sécurité globale optionnelle
    security: [],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
