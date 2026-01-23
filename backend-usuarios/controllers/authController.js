// ¿Qué hace cada cosa?
// bcrypt → sirve para encriptar contraseñas (hash) y compararlas.
// findUserByEmail → busca un usuario por su email.
// createUser → crea un usuario nuevo y lo guarda en el JSON.
// getAllUsers → obtiene todos los usuarios del archivo JSON.
// SALT_ROUNDS = 10 → nivel de seguridad para bcrypt (estándar).

import bcrypt from "bcrypt";
import { findUserByEmail, createUser, getAllUsers } from "../models/userModel.js";

const SALT_ROUNDS = 10;

// registrar nuevo usuario
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Verificar si ya existe el email
    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: "El email ya está registrado" });

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Crear usuario
    const user = await createUser({ name, email, passwordHash });

    // Devolver usuario sin passwordHash
    // Extrae passwordHash
    // Devuelve el resto del objeto (id, name, email, createdAt)
    // Código 201 = "Creado"
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: "Usuario registrado", user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

// login de usuario
// Verifica email y contraseña
// Si es correcto, devuelve mensaje de éxito y datos básicos del usuario (sin password)
// Si no, devuelve error 401 (no autorizado)
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

    // Comparar contraseña con el hash guardado
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

    // Devolver usuario sin passwordHash
    // Extrae passwordHash
    // Devuelve el resto del objeto (id, name, email, createdAt)
    const { passwordHash: _, ...userSafe } = user;
    res.json({ message: "Login exitoso", user: userSafe });
  } catch (err) {
    next(err);
  }
}

// Endpoint opcional para listar usuarios (solo para pruebas)
export async function listUsers(req, res, next) {
  try {
    const users = await getAllUsers();
    const safe = users.map(({ passwordHash, ...rest }) => rest);
    res.json(safe);
  } catch (err) {
    next(err);
  }
}
