export async function json(request, response) {
  const buffers = [];

  for await (const chunk of request) {
    console.log(chunk.toString());
    buffers.push(chunk);
  }

  try {
    request.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch (e) {
    request.body = null;
  }

  response.setHeader('Content-Type', 'application/json');
}
