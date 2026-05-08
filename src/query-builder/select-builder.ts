export class SelectQueryBuilder<
    TDatabase,
    TTable extends keyof TDatabase
> {
    private selectedColumns?: Array<keyof TDatabase[TTable]>;

    constructor(
        private table: TTable
    ) {}

    select(columns: Array<keyof TDatabase[TTable]>): SelectQueryBuilder<TDatabase, TTable> {
        this.selectedColumns = columns;
        return this;
    }

    toSQL() {
        const columns = this.selectedColumns?.map((column) => String(column)).join(", ") ?? "*";

        return `SELECT ${columns} FROM ${String(this.table)}`;
    }
}
