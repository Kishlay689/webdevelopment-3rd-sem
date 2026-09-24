const http = require('http');
const { parse } = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Request received: ${req.method} ${path}`);

  // Home page
  if (path === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(
      'Welcome! Try /greet?name=Rahul, /headers, or POST to /data'
    );
  }

  // Query parameters
  else if (path === '/greet' && req.method === 'GET') {
    const name = query.name || 'Guest';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`Hello, ${name}! Welcome to the server.`);
  }

  // Request headers
  else if (path === '/headers' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.headers, null, 2));
  }

  // POST data
  else if (path === '/data' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');

      res.end(
        JSON.stringify({
          message: 'Data received successfully',
          yourData: body
        })
      );
    });
  }

  // Error route
  else if (path === '/error') {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Simulated server error (500)');
  }

  // Route not found
  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 - Page Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});