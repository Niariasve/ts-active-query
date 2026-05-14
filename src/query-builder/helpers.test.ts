import { describe, expect, it } from "vitest";
import { renderValue } from "./helpers";

describe("renderValue", () => {
    it("renders numbers without quotes", () => {
        expect(renderValue(30)).toBe("30");
        expect(renderValue(0)).toBe("0");
    });

    it("wraps strings in single quotes", () => {
        expect(renderValue("Alice")).toBe("'Alice'");
        expect(renderValue("")).toBe("''");
    });

    it("preserves embedded single quotes with no escaping", () => {
        expect(renderValue("O'Brien")).toBe("'O'Brien'");
    });
});
