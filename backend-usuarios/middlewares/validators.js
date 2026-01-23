// body() → sirve para validar campos enviados en el req.body
// validationResult() → recoge los errores generados por los validadores
import { body, validationResult } from "express-validator";

// body("name") → toma el campo name del body
// trim() → elimina espacios al inicio y al final
// notEmpty() → exige que no esté vacío
// Si está vacío → devuelve el mensaje "El nombre es obligatorio"

export const registerValidators = [
  body("name").trim().notEmpty().withMessage("El nombre es obligatorio"),
//  isEmail() → valida que tenga formato correcto
// normalizeEmail() → lo convierte a un formato estándar (minúsculas, etc.)
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
// Este middleware:
// Revisa si algún validador anterior generó un error.
// Si hay errores → responde con 400 y un JSON con todos los errores.
// Si NO hay errores → llama a next() y continúa hacia tu controlador register().
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];


 // body("email") → toma el campo email del body
// isEmail() → valida que tenga formato correcto
// normalizeEmail() → lo convierte a un formato estándar (minúsculas, etc.)
// body("password") → toma el campo password del body
// notEmpty() → exige que no esté vacío
// Si está vacío → devuelve el mensaje "Contraseña obligatoria"
// Este middleware:
// Revisa si algún validador anterior generó un error.
// Si hay errores → responde con 400 y un JSON con todos los errores.
// Si NO hay errores → llama a next() y continúa hacia tu controlador login().
export const loginValidators = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  body("password").notEmpty().withMessage("Contraseña obligatoria"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];
