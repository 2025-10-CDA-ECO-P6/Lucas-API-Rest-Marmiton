import express from "express";
import recettesRoutes from "./routes/recettes.js";

const app = express();
const PORT = 3000;

// Middleware pour lire le JSON
app.use(express.json());

// Routes
app.use("/api", recettesRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
});
