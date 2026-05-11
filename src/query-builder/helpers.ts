import type { RenderableColumn } from "./types";

export function renderValue<TDatabase, TTable extends keyof TDatabase>(value: RenderableColumn<TDatabase, TTable>) {
    if (typeof value === "string") {
        return `'${value}'`;
    }
    return String(value);
}