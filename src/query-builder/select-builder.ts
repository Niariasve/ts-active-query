import { renderValue } from "./helpers";
import type { Condition, RenderableColumn, RenderableValue, RowOf } from "./types";

export class SelectQueryBuilder<
    TDatabase,
    TTable extends keyof TDatabase
> {
    private selectedColumns?: Array<keyof TDatabase[TTable]>;
    private condition?: Condition;

    constructor(
        private table: TTable
    ) { }

    select(columns: Array<keyof TDatabase[TTable]>): this {
        this.selectedColumns = columns;
        return this;
    }

    where<TColumn extends RenderableColumn<TDatabase, TTable>>(
        column: TColumn,
        operator: "=",
        value: Extract<RowOf<TDatabase, TTable>[TColumn], RenderableValue>,
    ): this {
        this.condition = {
            column,
            operator,
            value
        }
        return this;
    }

    toSQL() {
        const columns =
            this.selectedColumns?.map((column) => String(column)).join(", ") ?? "*";

        const condition = this.condition
            ? ` WHERE ${this.condition.column} ${this.condition.operator} ${renderValue(this.condition.value)}`
            : "";

        return `SELECT ${columns} FROM ${String(this.table)}${condition}`;
    }
}
