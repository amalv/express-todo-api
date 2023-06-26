import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function (request: VercelRequest, response: VercelResponse) {
  const html = `
    <html>
      <head>
        <title>Hello API</title>
        <style>
          body {
            font-family: sans-serif;
            background-color: #f0f0f0;
          }
          h1 {
            color: #333;
          }
          p {
            margin-bottom: 1em;
          }
          a {
            color: #0077cc;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <h1>Welcome to the API!</h1>
        <p>This is the index page for the API.</p>
        <p>Check out the <a href="/api/hello">Say hello to the API</a> endpoint!</p>
        <p>Check out the <a href="/api/todos">todo list</a> endpoint!</p>
      </body>
    </html>
  `;
  response.setHeader("Content-Type", "text/html");
  response.send(html);
}
