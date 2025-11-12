import express from "express";
import { openDb } from "../database/db.js";

const router = express.Router();

// ✅ Récupérer toutes les recettes
router.get("/recettes", async (req, res) => {
  const db = await openDb();
  const recettes = await db.all("SELECT * FROM recettes");
  res.json(recettes);
});

// ✅ Récupérer une recette par ID
router.get("/recettes/:id", async (req, res) => {
  const db = await openDb();
  const recette = await db.get("SELECT * FROM recettes WHERE id = ?", [req.params.id]);
  recette ? res.json(recette) : res.status(404).json({ message: "Recette non trouvée" });
});

// ✅ Ajouter une recette
router.post("/recettes", async (req, res) => {
  const { titre, temps_preparation, difficulte, budget, description } = req.body;
  const db = await openDb();
  await db.run(
    "INSERT INTO recettes (titre, temps_preparation, difficulte, budget, description) VALUES (?, ?, ?, ?, ?)",
    [titre, temps_preparation, difficulte, budget, description]
  );
  res.status(201).json({ message: "Recette ajoutée avec succès" });
});

// ✅ Supprimer une recette
router.delete("/recettes/:id", async (req, res) => {
  const db = await openDb();
  await db.run("DELETE FROM recettes WHERE id = ?", [req.params.id]);
  res.json({ message: "Recette supprimée avec succès" });
});

export default router;
