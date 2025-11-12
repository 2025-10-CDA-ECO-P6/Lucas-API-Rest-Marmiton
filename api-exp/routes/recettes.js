import express from "express";

const router = express.Router();

const recettes = [
  { id: 1, titre: "Pâtes carbonara", temps_preparation: 20, difficulte: 2, budget: 1 },
  { id: 2, titre: "Tarte aux pommes", temps_preparation: 45, difficulte: 3, budget: 2 },
];

// READ - toutes les recettes
router.get("/recettes", (req, res) => {
  res.json(recettes);
});

// READ - une recette par ID
router.get("/recettes/:id", (req, res) => {
  const recette = recettes.find(r => r.id === parseInt(req.params.id));
  recette ? res.json(recette) : res.status(404).json({ message: "Recette non trouvée" });
});

export default router;
