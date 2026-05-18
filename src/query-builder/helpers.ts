import type { RenderableColumn, RenderableValue } from "./types";

export function renderValue(value: RenderableValue) {
    if (typeof value === "string") {
        return `'${escapeQuotes(value)}'`;
    } else if (typeof value === "number") {
        return String(value);
    } else {
        const exhaustiveCheck: never = value;
        return exhaustiveCheck;
    }
}

function escapeQuotes(s: string) {
    if (s.includes("'")) {
        return s.replace(/'/g, "''");
    } else {
        return s;
    }
}
