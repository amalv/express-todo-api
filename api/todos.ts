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

      if (!title) {
        response.status(400).send("Title is required");
        return;
      }

      const result = await client.query(
        "INSERT INTO todos (title, completed) VALUES ($1, $2) RETURNING *",
        [title, completed || false]
      );
      const todo = result.rows[0];

      response.status(201).json(todo);
    } else if (request.method === "DELETE") {
      const { id } = request.query;

      if (!id) {
        response.status(400).send("ID is required");
        return;
      }

      const result = await client.query(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        [id]
      );
      const todo = result.rows[0];

      if (!todo) {
        response.status(404).send("Todo not found");
        return;
      }

      response.status(200).json(todo);
    } else if (request.method === "PATCH") {
      const { id } = request.query;
      const { title, completed } = request.body;

      if (!id) {
        response.status(400).send("ID is required");
        return;
      }

      const result = await client.query(
        "UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *",
        [title, completed, id]
      );
      const todo = result.rows[0];

      if (!todo) {
        response.status(404).send("Todo not found");
        return;
      }

      response.status(200).json(todo);
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
