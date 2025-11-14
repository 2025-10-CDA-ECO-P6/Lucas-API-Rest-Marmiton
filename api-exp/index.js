import express from "express";
import recettesRoutes from "./routes/recettes.js";
import authRoutes from "./routes/auth.js";
import ingredientsRoutes from "./routes/ingredients.js";
import recettesIngredientsRoutes from "./routes/recettesIngredients.js";

const app = express();
const PORT = 1337;

// Middleware pour lire le JSON
app.use(express.json());

app.use("/api", authRoutes);

// Routes
app.use("/api", recettesRoutes);
app.use("/api", ingredientsRoutes);

app.use("/api", recettesIngredientsRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Express démarré sur http://localhost:${PORT}`);
});
