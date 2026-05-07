export class SelectQueryBuilder<
    TDatabase,
    TTable extends keyof TDatabase
> {
    constructor(
        private table: TTable
    ) {}

    toSql() {
        return `SELECT * FROM ${String(this.table)}`;
    }
}