import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "./database";
import { SelectQueryBuilder } from "../query-builder/select-builder";
import type { Database } from "./types";

describe("DatabaseClient", () => {
    describe("runtime behavior", () => {
        it("starts a select query for a valid table", () => {
            const db = createDatabase<Database>();
            const builder = db.selectFrom("users");

            expect(builder).toBeInstanceOf(SelectQueryBuilder);
            expect(builder.toSQL()).toBe("SELECT * FROM users");
        });
    });

    describe("type-level contracts", () => {
        it("returns a builder scoped to the selected table", () => {
            const db = createDatabase<Database>();
            const builder = db.selectFrom("users");

            expectTypeOf(builder).toEqualTypeOf<
                SelectQueryBuilder<Database, "users">
            >();
        });

        it("rejects unknown table names", () => {
            const db = createDatabase<Database>();

            // @ts-expect-error
            db.selectFrom("orders");
        });
    });
});
