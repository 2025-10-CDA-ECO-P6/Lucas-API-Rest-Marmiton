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
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS recettes_ingredients (
      recette_id INTEGER,
      ingredient_id INTEGER,
      quantite TEXT,
      PRIMARY KEY (recette_id, ingredient_id),
      FOREIGN KEY (recette_id) REFERENCES recettes(id),
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    )
  `);

  console.log("✅ Base de données initialisée avec succès !");
};

init();
