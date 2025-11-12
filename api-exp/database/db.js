import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Connexion à la base SQLite
export const openDb = async () => {
  return open({
    filename: "./database/data.sqlite",
    driver: sqlite3.Database,
  });
};
