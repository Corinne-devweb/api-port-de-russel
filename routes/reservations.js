const express = require("express");
const router = express.Router();
const reservationsController = require("../controllers/reservationsController");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

router.get(
  "/catways/:catwayId/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.getByCatway
);

router.get(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.getById
);

router.post(
  "/catways/:catwayId/reservations",
  authMiddleware,
  checkCatwayExists,
  reservationsController.create
);

router.put(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.update
);

router.delete(
  "/catways/:catwayId/reservations/:reservationId",
  authMiddleware,
  reservationsController.delete
);

module.exports = router;
