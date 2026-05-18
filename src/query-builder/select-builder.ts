import { renderValue } from "./helpers";
import type { BooleanConnector, Condition, RenderableColumn, RenderableValue, RowOf, WhereOperator } from "./types";

export class SelectQueryBuilder<
    TDatabase,
    TTable extends keyof TDatabase
> {
    private selectedColumns?: Array<keyof TDatabase[TTable]>;
    private conditions: Condition[] = [];

    constructor(
        private table: TTable
    ) { }

    select(columns: Array<keyof TDatabase[TTable]>): this {
        this.selectedColumns = columns;
        return this;
    }

    where<TColumn extends RenderableColumn<TDatabase, TTable>>(
        column: TColumn,
        operator: WhereOperator,
        value: Extract<RowOf<TDatabase, TTable>[TColumn], RenderableValue>,
    ): this {
        const condition = { column, operator, value, connector: "AND" } as Condition;

        this.conditions.push(condition);

        return this;
    }

    orWhere<TColumn extends RenderableColumn<TDatabase, TTable>>(
        column: TColumn,
        operator: WhereOperator,
        value: Extract<RowOf<TDatabase, TTable>[TColumn], RenderableValue>,
    ): this {
        if (this.conditions.length === 0) {
            return this.where(column, operator, value);
        }

        const condition = { column, operator, value, connector: "OR" } as Condition;

        this.conditions.push(condition);

        return this;
    }

    private buildSelectClause(): string {
        const columns = this.selectedColumns?.map((column) => String(column)).join(", ") ?? "*";
        return `SELECT ${columns} FROM ${String(this.table)}`;
    }

    private buildWhereClause(): string {
        if (this.conditions.length === 0) {
            return "";
        }

        const conditions: string[] = [];

        this.conditions.forEach((condition, index) => {
            const renderedCondition = `${condition.column} ${condition.operator} ${renderValue(condition.value)}`;
            if (index === 0) {
                conditions.push(renderedCondition);
            } else {
                conditions.push(`${condition.connector} ${renderedCondition}`);
            }
        });

        return `WHERE ${conditions.join(" ")}`;
    }

    toSQL() {
        const selectString = this.buildSelectClause();
        const whereString = this.buildWhereClause();

        const fullQuery = [selectString, whereString].join(" ").trim();

        return fullQuery;
    }
}
