import http from 'node:http';
import { json } from './middlewares/json.js';
import { match } from './routes.js';

const server = http.createServer(async (request, response) => {
  await json(request, response);

  const route = match(request);
  if (route) {
    const routeParams = request.url.match(route.path);
    request.params = { ...routeParams.groups };
    return route.handler(request, response);
  }

  return response.writeHead(404).end();
});

server.listen(3333);
