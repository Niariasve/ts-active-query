export type RowOf<TDatabase, TTable extends keyof TDatabase> = TDatabase[TTable];

export type RenderableValue = string | number;

export type RenderableRow<TDatabase, TTable extends keyof TDatabase> = {
    [K in keyof RowOf<TDatabase, TTable> as RowOf<TDatabase, TTable>[K] extends RenderableValue
    ? K
    : never]: RowOf<TDatabase, TTable>[K];
};

type StringKeyOf<T> = Extract<keyof T, string>;

export type RenderableColumn<TDatabase, TTable extends keyof TDatabase> = {
    [K in StringKeyOf<RowOf<TDatabase, TTable>>]:
    RowOf<TDatabase, TTable>[K] extends RenderableValue ? K : never;
}[StringKeyOf<RowOf<TDatabase, TTable>>];

export type Condition = {
    column: string;
    operator: "=";
    value: RenderableValue;
}
