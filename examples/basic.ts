import { createDatabase } from "../src/core/database";
import type { Database } from "../src/core/types";

const db = createDatabase<Database>();

const sql = db.selectFrom("users").toSQL();

console.log(sql);
