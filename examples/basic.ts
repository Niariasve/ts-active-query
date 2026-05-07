import { createDatabase } from "../src/core/database";
import type { Database } from "../src/core/types";

const db = createDatabase<Database>();

const query = db.selectFrom("reservation");

console.log(query.toSql());