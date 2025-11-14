import express from "express";
import { openDb } from "../database/db.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Récupérer tous les liens recette ↔ ingrédients
router.get("/recettes-ingredients", async (req, res) => {
  const db = await openDb();
  const links = await db.all("SELECT * FROM recettes_ingredients");
  res.json(links);
});

// ✅ Récupérer tous les ingrédients pour une recette
router.get("/recettes-ingredients/:recette_id", async (req, res) => {
  const db = await openDb();
  const ingredients = await db.all(
    `SELECT ri.recette_id, ri.ingredient_id, ri.quantite, i.name 
     FROM recettes_ingredients ri 
     JOIN ingredients i ON ri.ingredient_id = i.id
     WHERE ri.recette_id = ?`,
    [req.params.recette_id]
  );
  res.json(ingredients);
});

// ✅ Lier un ingrédient à une recette
router.post("/recettes-ingredients", verifyToken, async (req, res) => {
  const { recette_id, ingredient_id, quantite } = req.body;

  if (!recette_id || !ingredient_id)
    return res.status(400).json({ message: "recette_id et ingredient_id sont requis" });

  const db = await openDb();

  await db.run(
    `INSERT INTO recettes_ingredients (recette_id, ingredient_id, quantite)
     VALUES (?, ?, ?)`,
    [recette_id, ingredient_id, quantite || ""]
  );

  res.status(201).json({ message: "Lien recette ↔ ingrédient créé" });
});

// ✅ Modifier la quantité d’un ingrédient dans une recette
router.put("/recettes-ingredients", verifyToken, async (req, res) => {
  const { recette_id, ingredient_id, quantite } = req.body;

  if (!recette_id || !ingredient_id)
    return res.status(400).json({ message: "recette_id et ingredient_id sont requis" });

  const db = await openDb();

  await db.run(
    `UPDATE recettes_ingredients
     SET quantite = ?
     WHERE recette_id = ? AND ingredient_id = ?`,
    [quantite, recette_id, ingredient_id]
  );

  res.json({ message: "Quantité mise à jour" });
});

// ✅ Supprimer un lien recette ↔ ingrédient
router.delete("/recettes-ingredients", verifyToken, async (req, res) => {
  const { recette_id, ingredient_id } = req.body;

  if (!recette_id || !ingredient_id)
    return res.status(400).json({ message: "recette_id et ingredient_id sont requis" });

  const db = await openDb();

  await db.run(
    `DELETE FROM recettes_ingredients
     WHERE recette_id = ? AND ingredient_id = ?`,
    [recette_id, ingredient_id]
  );

  res.json({ message: "Lien supprimé" });
});

export default router;
