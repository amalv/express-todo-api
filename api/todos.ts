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
    if (request.method === "GET") {
      const result = await client.query("SELECT * FROM todos");
      const todos = result.rows;
      response.status(200).json(todos);
    } else if (request.method === "POST") {
      const { title, completed } = request.body;
      await client.query(
        "INSERT INTO todos (title, completed) VALUES ($1, $2)",
        [title, completed]
      );
      response.status(201).send("Todo added successfully");
    } else {
      response.status(405).send("Method not allowed");
    }
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal server error");
  } finally {
    client.release();
  }
}
