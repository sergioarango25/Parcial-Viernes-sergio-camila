import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS PRIMERO (ANTES DE TODO)
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

// ✅ JSON
app.use(express.json());

// ✅ RUTAS
app.use("/api/auth", authRoutes);

// Página raíz
app.get("/", (req, res) => {
  res.send("API de autenticación de usuarios");
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Server error"
  });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
