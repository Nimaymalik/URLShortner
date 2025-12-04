import { Pool, QueryResultRow } from "pg"

declare global {
    var _dbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
}

const pool =
    global._dbPool ??
    new Pool({
        connectionString,
        max: 5,
    });

if (process.env.NODE_ENV !== "production") {
    global._dbPool = pool;
}

export async function dbQuery<T extends QueryResultRow = any>(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query<T>(text, params);
        return res;
    } finally {
        client.release();
    }
}
