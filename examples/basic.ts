import { createDatabase } from "../src/core/database";
import type { Database } from "../src/core/types";

const db = createDatabase<Database>();

const sql = db.selectFrom("users").toSQL();

const sqlWhere = db.selectFrom("users").where("age", "=", 30).toSQL()
const sqlWhere2 = db.selectFrom("users").where("name", "=", "30").toSQL()

console.log(sql);
console.log(sqlWhere);
console.log(sqlWhere2);
