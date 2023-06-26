# Todo API

This is a simple API for managing todos. It uses a PostgreSQL database to store todo data.

## Endpoints

### `GET /api/todos`

Retrieves all todos from the database.

### `POST /api/todos`

Adds a new todo to the database.

Example request:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "completed": false}' \
  http://localhost:3000/todos
```

## Setup

To set up the API, you'll need to:

- Create a PostgreSQL database in your Vercel project:

  - Go to your project page
  - Click on the "Storage" option in the top menu
  - Click "Create Database"
  - The database will be created inside your project

- Create a .env.development.local file in the root directory of your project:

  - Use the following command to create the file:

  ```bash
  vercel env pull .env.development.local
  ```

  - This file should contain the connection string for your PostgreSQL database, as well as any other environment variables you need for development

- Run the API using the following command:

```bash
vercel dev
```

## Deploying

To deploy the API, you can use the following command:

```bash
vercel deploy
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
