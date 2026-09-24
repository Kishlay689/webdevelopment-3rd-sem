const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Construct a full WHATWG URL object using the request host header
  const baseURL = `http://${req.headers.host || 'localhost'}`;
  const parsedUrl = new URL(req.url, baseURL);
  
  const path = parsedUrl.pathname;
  // parsedUrl.searchParams replaces the old query object
  const searchParams = parsedUrl.searchParams; 

  console.log(`Request received: ${req.method} ${path}`);

  // 1. Home page
  if (path === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome! Try /greet?name=Rahul, /headers, or POST to /data');
  } 
  
  // 2. Query parameters
  else if (path === '/greet' && req.method === 'GET') {
    const name = searchParams.get('name') || 'Guest';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello, ${name}! Welcome to the server.`);
  } 
  
  // 3. Request headers
  else if (path === '/headers' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(req.headers, null, 2));
  } 
  
  // 4. POST data
  else if (path === '/data' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk;
    });
    
    req.on('end', () => {
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ 
          message: 'Data received successfully', 
          yourData: body 
        })
      );
    });
  } 
  
  // 5. Error route
  else if (path === '/error') {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Simulated server error (500)');
  } 
  
  // 6. Route not found
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Page Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
