// router.post("/register")	Registra usuarios
// router.post("/login")	Inicia sesión
// router.get("/users")	Lista usuarios (sin contraseñas)
// validators	Revisan que el email y password sean válidos
// controllers	Hacen el trabajo: registrar, logear, listar

import express from "express";
import { register, login, listUsers } from "../controllers/authController.js";
import { registerValidators, loginValidators } from "../middlewares/validators.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
router.post("/register", registerValidators, register);

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post("/login", loginValidators, login);

/**
 * GET /api/auth/users
 * Lista usuarios (sin password). Solo para pruebas.
 */
router.get("/users", listUsers);

export default router;
