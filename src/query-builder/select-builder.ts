export class SelectQueryBuilder<
    TDatabase,
    TTable extends keyof TDatabase
> {
    constructor(
        private table: TTable
    ) {}

    toSQL() {
        return `SELECT * FROM ${String(this.table)}`;
    }
}
