import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"

// Two backends behind one tiny interface:
// - DATABASE_URL set  -> hosted Postgres via `pg` (production / Vercel preview)
// - DATABASE_URL unset -> embedded Postgres (PGlite) persisted under .data/ (local development)
export type Queryable = {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>
}

export type Db = Queryable & {
  transaction<T>(run: (tx: Queryable) => Promise<T>): Promise<T>
}

const globalForDb = globalThis as unknown as { agreementsDb?: Promise<Db> }

async function readSchema(): Promise<string> {
  return readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8")
}

async function openHosted(connectionString: string): Promise<Db> {
  const { Pool } = await import("pg")
  const pool = new Pool({ connectionString, max: 3 })
  await pool.query(await readSchema())
  return {
    query: (sql, params) => pool.query(sql, params as unknown[]) as never,
    async transaction(run) {
      const client = await pool.connect()
      try {
        await client.query("BEGIN")
        const result = await run({ query: (sql, params) => client.query(sql, params as unknown[]) as never })
        await client.query("COMMIT")
        return result
      } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined)
        throw error
      } finally {
        client.release()
      }
    },
  }
}

async function openLocal(): Promise<Db> {
  const { PGlite } = await import("@electric-sql/pglite")
  const dataDir = process.env.PGLITE_DATA_DIR ?? path.join(process.cwd(), ".data", "pglite")
  const db = new PGlite(dataDir)
  await db.exec(await readSchema())
  return {
    query: (sql, params) => db.query(sql, params) as never,
    transaction: (run) => db.transaction((tx) => run({ query: (sql, params) => tx.query(sql, params) as never })),
  }
}

export function getDb(): Promise<Db> {
  const url = process.env.DATABASE_URL
  globalForDb.agreementsDb ??= url ? openHosted(url) : openLocal()
  return globalForDb.agreementsDb
}
