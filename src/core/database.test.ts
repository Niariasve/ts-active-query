import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "./database";
import { SelectQueryBuilder } from "../query-builder/select-builder";
import type { Database } from "./types";

describe("DatabaseClient", () => {
    it("builds SQL for a select from table", () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users");

        expectTypeOf(builder).toEqualTypeOf<
            SelectQueryBuilder<Database, "users">
        >();

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT * FROM users");
    });

    it("fails when not using a valid table name", () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        db.selectFrom("orders");
    });

    it("builds SQL for a select with specific columns", () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users").select(["id", "name"]);

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT id, name FROM users");
    });

    it("fails when not using a valid column name", () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        db.selectFrom("users").select(["id", "last_name"]);
    });

    it("builds SQL for a select with a numeric where clause", () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users").where("age", "=", 30);

        expectTypeOf(builder).toEqualTypeOf<
            SelectQueryBuilder<Database, "users">
        >();

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT * FROM users WHERE age = 30");
    });

    it("builds SQL for a selected-column query with a string where clause", () => {
        const db = createDatabase<Database>();
        const sql = db
            .selectFrom("users")
            .select(["id", "name"])
            .where("name", "=", "Alice")
            .toSQL();

        expect(sql).toBe("SELECT id, name FROM users WHERE name = 'Alice'");
    });

    it("fails when where uses an invalid column name", () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        db.selectFrom("users").where("last_name", "=", "Alice");
    });

    it("fails when where uses an unsupported operator", () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        db.selectFrom("users").where("age", "LIKE", 30);
    });

    it("fails when where value does not match the column type", () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        db.selectFrom("users").where("age", "=", "30");
    });
});
