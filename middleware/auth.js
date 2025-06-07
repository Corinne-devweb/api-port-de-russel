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

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Accès refusé : token manquant ou mal formaté." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

module.exports = authMiddleware;
