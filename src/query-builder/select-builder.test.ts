import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "../core/database";
import { SelectQueryBuilder } from "./select-builder";
import type { Database } from "../core/types";

describe("SelectQueryBuilder", () => {
    describe("runtime behavior", () => {
        it("renders selected columns", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("users").select(["id", "name"]).toSQL();

            expect(sql).toBe("SELECT id, name FROM users");
        });

        it("renders numeric where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("users").where("age", "=", 30).toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age = 30");
        });

        it("renders selected-column queries with string where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .select(["id", "name"])
                .where("name", "=", "Alice")
                .toSQL();

            expect(sql).toBe("SELECT id, name FROM users WHERE name = 'Alice'");
        });
    });

    describe("type-level contracts", () => {
        it("preserves the table-scoped builder type across where", () => {
            const db = createDatabase<Database>();
            const builder = db.selectFrom("users").where("age", "=", 30);

            expectTypeOf(builder).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();
        });

        it("rejects unknown selected columns", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").select(["id", "last_name"]);
        });

        it("rejects where clauses for unknown columns", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").where("last_name", "=", "Alice");
        });

        it("rejects unsupported where operators", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").where("age", "LIKE", 30);
        });

        it("rejects where values that do not match the column type", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").where("age", "=", "30");
        });
    });
});
