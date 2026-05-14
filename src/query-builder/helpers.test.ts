import { describe, expect, it } from "vitest";
import { renderValue } from "./helpers";

describe("renderValue", () => {
    describe("numbers", () => {
        it("renders numbers without quotes", () => {
            expect(renderValue(30)).toBe("30");
            expect(renderValue(0)).toBe("0");
        });
    });

    describe("strings", () => {
        it("wraps strings in single quotes", () => {
            expect(renderValue("Alice")).toBe("'Alice'");
            expect(renderValue("")).toBe("''");
        });

        it("escapes embedded single quotes by doubling them", () => {
            expect(renderValue("O'Brien")).toBe("'O''Brien'");
        });
    });
});
