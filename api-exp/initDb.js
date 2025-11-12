import { openDb } from "./database/db.js";

const init = async () => {
  const db = await openDb();

  // Créer la table "recettes" si elle n'existe pas
  await db.exec(`
    CREATE TABLE IF NOT EXISTS recettes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT,
      temps_preparation INTEGER,
      difficulte INTEGER,
      budget INTEGER,
      description TEXT
    )
  `);

  // Table utilisateurs
  await db.exec(`
    CREATE TABLE IF NOT EXISTS utilisateurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  console.log("✅ Base de données initialisée avec succès !");
};

init();
