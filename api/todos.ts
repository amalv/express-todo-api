import { createPool } from "@vercel/postgres";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN NOT NULL
      );
    `);

    const todos = [
      { title: "Buy milk", completed: false },
      { title: "Walk the dog", completed: true },
      { title: "Do laundry", completed: false },
    ];

    for (const todo of todos) {
      await client.query(
        `
        INSERT INTO todos (title, completed)
        VALUES ($1, $2);
      `,
        [todo.title, todo.completed]
      );
    }
  } catch (error) {
    return response.status(500).json({ error });
  } finally {
    client.release();
  }

  const result = await client.query("SELECT * FROM todos;");
  const todos = result.rows;
  return response.status(200).json({ todos });
}
