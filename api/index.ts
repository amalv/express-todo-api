import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function (request: VercelRequest, response: VercelResponse) {
  const html = `
    <html>
      <head>
        <title>Hello API</title>
      </head>
      <body>
        <h1>Welcome to the API!</h1>
        <p>Check out the <a href="/api/hello">/api/hello</a> endpoint!</p>
      </body>
    </html>
  `;
  response.setHeader("Content-Type", "text/html");
  response.send(html);
}
