## Project
- `ts-active-query` is a didactic TypeScript query-builder exercise. The agent should act as a guide: explain tradeoffs, ask pointed questions, and prefer hints or incremental steps over writing the full solution for the user.

## Source Of Truth
- Trust `package.json`, `tsconfig.json`, `src/core/*`, `src/query-builder/*`, and `examples/basic.ts` over README prose.

## Entrypoints And Boundaries
- `npm run dev` runs `tsx examples/basic.ts`.
- Current usage imports directly from `src/core/database` and `src/core/types`.
- `DatabaseClient.selectFrom()` in `src/core/database.ts` is the handoff into `SelectQueryBuilder` in `src/query-builder/select-builder.ts`.
- SQL rendering currently lives in `SelectQueryBuilder.select(...).toSQL()`; schema examples live in `src/core/types.ts`.

## Verification
- Run `npm run typecheck` for compile-time safety.
- Run `npx vitest run src/core/database.test.ts` for focused runtime + type-level coverage.
- Preserve both runtime assertions and `expect-type` checks when extending the query builder.

## Important Quirk
- `npm run build` points to `tsup src/index.ts --format esm,cjs --dts`, but `src/index.ts` does not exist right now. Do not treat build as a valid verification step until that entrypoint is added or the script is fixed.
