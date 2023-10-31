import { Database } from "bun:sqlite";

export const db = new Database("file:css-in-bun?mode=memory&cache=shared", 0x42);

db.run("CREATE TABLE IF NOT EXISTS definitions (value TEXT PRIMARY KEY)");

export const insert_definition = db.prepare(
  "INSERT INTO definitions SELECT value FROM json_each(?) WHERE true ON CONFLICT DO NOTHING"
);
export const get_defnitions = db.prepare("SELECT * FROM definitions");
export const reset_database = db.prepare("DELETE FROM definitions");