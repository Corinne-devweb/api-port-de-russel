// middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification basé sur JWT.
 * Vérifie que le header Authorization contient un token JWT valide.
 * Si le token est valide, ajoute l'objet décodé dans req.user et appelle next().
 * Sinon, renvoie une erreur 401 ou 403 selon le cas.
 *
 * @param {Object} req - L'objet requête Express.
 * @param {Object} res - L'objet réponse Express.
 * @param {Function} next - La fonction middleware pour passer au middleware suivant.
 * @returns {void}
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Vérifier si l'en-tête Authorization existe et est bien formaté
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Accès refusé",
      message:
        "Token manquant ou mal formaté. Format attendu: 'Bearer <token>'",
    });
  }

  // Extraire le token
  const token = authHeader.split(" ")[1];

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.SECRET_KEY
    );

    // Ajouter les informations utilisateur à la requête
    req.user = decoded;

    // Passer au middleware suivant
    next();
  } catch (err) {
    // Gestion spécifique des erreurs JWT
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expiré",
        message: "Votre session a expiré. Veuillez vous reconnecter.",
      });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        error: "Token invalide",
        message: "Le token fourni n'est pas valide.",
      });
    } else {
      return res.status(403).json({
        error: "Erreur d'authentification",
        message: "Impossible de vérifier le token.",
      });
    }
  }
};

module.exports = authMiddleware;
