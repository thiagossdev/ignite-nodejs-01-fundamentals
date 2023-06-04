import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler: (request, response) =>
      response.end(JSON.stringify(database.select('users'))),
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler: (request, response) => {
      const { name, email } = request.body;
      database.insert('users', {
        id: randomUUID(),
        name: name,
        email: email,
      });
      return response.writeHead(201).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { name, email } = request.body;
      database.update('users', id, {
        name: name,
        email: email,
      });
      return response.writeHead(201).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      database.delete('users', id);
      return response.writeHead(204).end();
    },
  },
];

export function match(request) {
  const { method, url } = request;
  return routes.find(
    (route) => route.method === method && route.path.test(url),
  );
}
