import { describe, expect, it } from "vitest";
import { expectTypeOf } from "expect-type";
import { createDatabase } from "./database";
import { SelectQueryBuilder } from "../query-builder/select-builder";
import type { Database } from "./types";

describe("DatabaseClient", () => {
    it('builds SQL for db.selectFrom("users").toSQL()', () => {
        const db = createDatabase<Database>();
        const builder = db.selectFrom("users");

        expectTypeOf(builder).toEqualTypeOf<
            SelectQueryBuilder<Database, "users">
        >();

        const sql = builder.toSQL();

        expect(sql).toBe("SELECT * FROM users");
    });

    it('fails when not using type keyof TDatabase on db.selectFrom', () => {
        const db = createDatabase<Database>();

        // @ts-expect-error
        const builder = db.selectFrom("orders");
    });
});
