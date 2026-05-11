export type RowOf<TDatabase, TTable extends keyof TDatabase> = TDatabase[TTable];

export type Condition<TDatabase, TTable extends keyof TDatabase> = {
    [K in RenderableColumn<TDatabase, TTable>]: {
        column: K,
        operator: "=",
        value: TDatabase[TTable][K],
    }
}[RenderableColumn<TDatabase, TTable>];

export type RenderableValue = string | number;

export type RenderableColumn<TDatabase, TTable extends keyof TDatabase> = {
    [K in keyof TDatabase[TTable]]: TDatabase[TTable][K] extends RenderableValue ? K : never;
}[keyof TDatabase[TTable]];