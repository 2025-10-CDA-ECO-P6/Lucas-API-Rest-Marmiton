import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { openDb } from "../database/db.js";

const router = express.Router();
const SECRET_KEY = "super_secret_key"; // ⚠️ à mettre plus tard dans un .env

// ✅ Inscription
router.post("/auth/local/register", async (req, res) => {
  const { username, email, password } = req.body;
  const db = await openDb();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO utilisateurs (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Utilisateur créé avec succès !", username, email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Nom d'utilisateur ou email déjà utilisé" });
  }
});


// ✅ Connexion
router.post("/auth/local", async (req, res) => {
  const { identifier, password } = req.body;
  const db = await openDb();

  const user = await db.get("SELECT * FROM utilisateurs WHERE email = ?", [identifier]);

  if (!user) return res.status(401).json({ message: "Utilisateur non trouvé" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe invalide" });

  // Génération du token
  const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "2h",
  });

  res.json({ message: "Connexion réussie !", token });
});

export default router;
