import express from "express";
import { openDb } from "../database/db.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Récupérer tous les ingrédients
router.get("/ingredients", async (req, res) => {
  const db = await openDb();
  const ingredients = await db.all("SELECT * FROM ingredients");
  res.json(ingredients);
});

// ✅ Récupérer un ingrédient par ID
router.get("/ingredients/:id", async (req, res) => {
  const db = await openDb();
  const ingredient = await db.get("SELECT * FROM ingredients WHERE id = ?", [
    req.params.id,
  ]);
  ingredient
    ? res.json(ingredient)
    : res.status(404).json({ message: "Ingrédient non trouvé" });
});

// ✅ Ajouter un ingrédient
router.post("/ingredients", verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name)
    return res.status(400).json({ message: "Le champ name est requis" });

  const db = await openDb();

  await db.run("INSERT INTO ingredients (name) VALUES (?)", [name]);

  res.status(201).json({ message: "Ingrédient ajouté avec succès" });
});

// ✅ Modifier un ingrédient
router.put("/ingredients/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  const db = await openDb();

  const ingredient = await db.get(
    "SELECT * FROM ingredients WHERE id = ?",
    req.params.id
  );

  if (!ingredient)
    return res.status(404).json({ message: "Ingrédient non trouvé" });

  await db.run("UPDATE ingredients SET name = ? WHERE id = ?", [
    name ?? ingredient.name,
    req.params.id,
  ]);

  res.json({ message: "Ingrédient mis à jour" });
});

// ✅ Supprimer un ingrédient
router.delete("/ingredients/:id", verifyToken, async (req, res) => {
  const db = await openDb();

  await db.run("DELETE FROM ingredients WHERE id = ?", [req.params.id]);

  res.json({ message: "Ingrédient supprimé" });
});

export default router;
