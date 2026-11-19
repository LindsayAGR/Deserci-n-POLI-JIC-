const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// Pública: crear cuenta de docente por cuenta propia (el controlador decide el rol)
router.post('/register', authController.register);

router.post('/login', authController.login);

// Requiere sesión: cambiar la contraseña propia
router.post('/cambiar-password', verifyToken, authController.cambiarPassword);

module.exports = router;