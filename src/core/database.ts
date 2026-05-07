import { SelectQueryBuilder } from "../query-builder/select-builder";

export class DatabaseClient<TDatabase> {
    selectFrom<TTable extends keyof TDatabase>(
        table: TTable
    ) {
        return new SelectQueryBuilder<TDatabase, TTable>(table);
    }
};

export function createDatabase<TDatabase>() {
    return new DatabaseClient<TDatabase>();
}