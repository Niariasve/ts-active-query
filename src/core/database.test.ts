import { describe, expect, it } from "vitest";
import { createDatabase } from "./database";
import type { Database } from "./types";

describe("DatabaseClient", () => {
    it('builds SQL for db.selectFrom("users").toSQL()', () => {
        const db = createDatabase<Database>();

        const sql = db.selectFrom("users").toSQL();
        
        expect(sql).toBe("SELECT * FROM users");
    });
});
