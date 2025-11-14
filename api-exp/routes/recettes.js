import express from "express";
import { openDb } from "../database/db.js";
import { verifyToken } from "../middlewares/auth.js";

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
router.post("/recettes", verifyToken, async (req, res) => {
  const { titre, temps_preparation, difficulte, budget, description } = req.body;
  const db = await openDb();
  await db.run(
    "INSERT INTO recettes (titre, temps_preparation, difficulte, budget, description) VALUES (?, ?, ?, ?, ?)",
    [titre, temps_preparation, difficulte, budget, description]
  );
  res.status(201).json({ message: "Recette ajoutée avec succès" });
});

router.patch("/recettes/:id", verifyToken, async (req, res) => {
  const db = await openDb();
  const { id } = req.params;

  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour." });
  }

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates);

  try {
    await db.run(
      `UPDATE recettes SET ${fields} WHERE id = ?`,
      [...values, id]
    );

    res.json({ message: "Recette mise à jour avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
});

// ✅ Supprimer une recette
router.delete("/recettes/:id", verifyToken, async (req, res) => {
  const db = await openDb();
  await db.run("DELETE FROM recettes WHERE id = ?", [req.params.id]);
  res.json({ message: "Recette supprimée" });
});

export default router;
