import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { json } from './middlewares/json.js';
import { Database } from './database.js';

const database = new Database();

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  if (method === 'GET' && url === '/users') {
    return response.end(JSON.stringify(database.select('users')));
  }

  if (method === 'POST' && url === '/users') {
    const { name, email } = request.body;
    database.insert('users', {
      id: randomUUID(),
      name: name,
      email: email,
    });
    return response.writeHead(201).end();
  }

  return response.writeHead(404).end();
});

server.listen(3333);
