const http = require("http");
const url = require("url");

const PORT = 2000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`Request received: ${req.method} $(path)`);

  if (path == "/" && req.method == "GET") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader("X-Powered-By", "plain-mode-http");
    res.end(
      "Hello World! Try /greet?name=Rahu; or /headers or POST to /data\n",
    );
  } else if (path == "/greet" && req.method == "GET") {
    const name = query.name || "Guest";
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end("Hello, $(name)! Welcome to the server.\n");
  } else if (path == "/headers" && req.method == "GET") {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.headers, null, 2));
  } else if (path == "/data" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({message: 'Data received successfully', yourData: body}));
    });

    
  }
  else if (path == "/error" ) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Simulated server error(500)\n');
  }

  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 - Page not found\n');
  }
});

server.listen(PORT, () => {
    console.log('Server running at http://localhost:$(PORT)');
})