import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "../core/database";
import { SelectQueryBuilder } from "./select-builder";
import type { Database } from "../core/types";

describe("SelectQueryBuilder", () => {
    describe("runtime behavior", () => {
        it("renders queries without where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("users").toSQL();

            expect(sql).toBe("SELECT * FROM users");
        });

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

        it("renders greater-than where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("users").where("age", ">", 30).toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age > 30");
        });

        it("renders less-than where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("products").where("stock", "<", 10).toSQL();

            expect(sql).toBe("SELECT * FROM products WHERE stock < 10");
        });

        it("renders greater-than-or-equal where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("products").where("price", ">=", 99).toSQL();

            expect(sql).toBe("SELECT * FROM products WHERE price >= 99");
        });

        it("renders less-than-or-equal where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db.selectFrom("users").where("age", "<=", 65).toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age <= 65");
        });

        it("concatenates multiple where clauses with AND", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .where("age", "=", 30)
                .where("name", "=", "Alice")
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age = 30 AND name = 'Alice'");
        });

        it("renders where followed by orWhere", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .where("age", ">=", 18)
                .orWhere("name", "=", "Alice")
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age >= 18 OR name = 'Alice'");
        });

        it("renders chains with multiple orWhere clauses", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .where("age", ">=", 18)
                .orWhere("name", "=", "Alice")
                .orWhere("email", "=", "alice@example.com")
                .toSQL();

            expect(sql).toBe(
                "SELECT * FROM users WHERE age >= 18 OR name = 'Alice' OR email = 'alice@example.com'"
            );
        });

        it("renders mixed where and orWhere clauses in call order", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .where("age", ">=", 18)
                .orWhere("name", "=", "Alice")
                .where("email", "=", "alice@example.com")
                .toSQL();

            expect(sql).toBe(
                "SELECT * FROM users WHERE age >= 18 OR name = 'Alice' AND email = 'alice@example.com'"
            );
        });

        it("falls back to where when orWhere is the first condition", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .orWhere("age", ">=", 18)
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE age >= 18");
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

        it("renders escaped single quotes in string where clauses", () => {
            const db = createDatabase<Database>();
            const sql = db
                .selectFrom("users")
                .where("name", "=", "O'Brien")
                .toSQL();

            expect(sql).toBe("SELECT * FROM users WHERE name = 'O''Brien'");
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

        it("preserves the table-scoped builder type across chained where clauses", () => {
            const db = createDatabase<Database>();
            const builder = db
                .selectFrom("users")
                .where("age", ">=", 30)
                .where("name", "=", "Alice");

            expectTypeOf(builder).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();
        });

        it("preserves the table-scoped builder type across orWhere", () => {
            const db = createDatabase<Database>();
            const builder = db
                .selectFrom("users")
                .where("age", ">=", 18)
                .orWhere("name", "=", "Alice");

            expectTypeOf(builder).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();
        });

        it("accepts the supported relational where operators", () => {
            const db = createDatabase<Database>();

            expectTypeOf(db.selectFrom("users").where("age", ">", 30)).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();

            expectTypeOf(db.selectFrom("users").where("age", "<", 30)).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();

            expectTypeOf(db.selectFrom("users").where("age", ">=", 30)).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();

            expectTypeOf(db.selectFrom("users").where("age", "<=", 30)).toEqualTypeOf<
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

        it("rejects orWhere clauses for unknown columns", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").orWhere("last_name", "=", "Alice");
        });

        it("rejects unsupported where operators", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").where("age", "LIKE", 30);
        });

        it("rejects unsupported orWhere operators", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").orWhere("age", "LIKE", 30);
        });

        it("rejects where values that do not match the column type", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").where("age", "=", "30");
        });

        it("rejects orWhere values that do not match the column type", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("users").orWhere("age", "=", "30");
        });
    });
});
