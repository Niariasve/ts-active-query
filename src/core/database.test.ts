import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "./database";
import { SelectQueryBuilder } from "../query-builder/select-builder";
import type { Database } from "./types";

describe("DatabaseClient", () => {
    it('builds SQL for a select from table', () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users");

        expectTypeOf(builder).toEqualTypeOf<
            SelectQueryBuilder<Database, "users">
        >();

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT * FROM users");
    });

    it('fails when not using a valid table name', () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        const builder = db.selectFrom("orders");
    });

    it('builds SQL for a select with specific columns', () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users").select(["id", "name"]);

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT id, name FROM users");
    });

    it('fails when not using a valid column name', () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        const builder = db.selectFrom("users").select(["id", "last_name"]);
    })
});
