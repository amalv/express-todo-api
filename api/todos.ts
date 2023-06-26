import { createPool } from "@vercel/postgres";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const pool = createPool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

type Handler = (
  request: VercelRequest,
  response: VercelResponse
) => Promise<void>;

interface Handlers {
  [key: string]: {
    [key: string]: Handler;
  };
}

const handlers: Handlers = {
  GET: {
    "/api/todos": async (request, response) => {
      const client = await pool.connect();

      try {
        const result = await client.query("SELECT * FROM todos");
        const todos = result.rows;

        response.status(200).json(todos);
      } catch (error) {
        console.error(error);
        response.status(500).send("Internal server error");
      } finally {
        client.release();
      }
    },
  },
  POST: {
    "/api/todos": async (request, response) => {
      const client = await pool.connect();

      try {
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
      } catch (error) {
        console.error(error);
        response.status(500).send("Internal server error");
      } finally {
        client.release();
      }
    },
  },
  PATCH: {
    "/api/todos": async (request, response) => {
      const client = await pool.connect();

      try {
        const id = request.query.id as string;
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
      } catch (error) {
        console.error(error);
        response.status(500).send("Internal server error");
      } finally {
        client.release();
      }
    },
  },
  DELETE: {
    "/api/todos": async (request, response) => {
      const client = await pool.connect();

      try {
        const id = request.query.id as string;

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
      } catch (error) {
        console.error(error);
        response.status(500).send("Internal server error");
      } finally {
        client.release();
      }
    },
  },
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const methodHandlers = handlers[request.method as keyof Handlers];

  if (!methodHandlers) {
    response.status(405).send("Method not allowed");
    return;
  }

  const url = request.url?.split("?")[0];
  const handler = methodHandlers[url as keyof Handlers];

  if (!handler) {
    response.status(404).send("Not found");
    return;
  }

  await handler(request, response);
}
