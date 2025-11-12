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

  console.log("✅ Base de données initialisée avec succès !");
};

init();
