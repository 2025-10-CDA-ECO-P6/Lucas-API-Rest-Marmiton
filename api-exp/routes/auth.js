import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { openDb } from "../database/db.js";

const router = express.Router();
const SECRET_KEY = "super_secret_key"; // ⚠️ à mettre plus tard dans un .env

// ✅ Inscription
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const db = await openDb();

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run("INSERT INTO utilisateurs (username, password) VALUES (?, ?)", [
      username,
      hashedPassword,
    ]);
    res.status(201).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    res.status(400).json({ message: "Nom d'utilisateur déjà utilisé" });
  }
});

// ✅ Connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const db = await openDb();

  const user = await db.get("SELECT * FROM utilisateurs WHERE username = ?", [username]);

  if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe invalide" });

  // Génération du token
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "2h",
  });

  res.json({ message: "Connexion réussie !", token });
});

export default router;
