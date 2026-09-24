const http = require('http');

let items = ['Apple', 'Banana'];

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // GET request
    if (req.method === 'GET') {
        res.end(JSON.stringify(items));
    }

    // POST request
    else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            items.push(body);
            res.end('Item added: ' + body);
        });
    }

    // PUT request
    else if (req.method === 'PUT') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const data = JSON.parse(body);

            if (data.index !== undefined && data.item !== undefined) {
                items[data.index] = data.item;
                res.end('Item updated');
            } else {
                res.statusCode = 400;
                res.end('Invalid data');
            }
        });
    }

    // DELETE request
    else if (req.method === 'DELETE') {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const index = parseInt(body);

            if (!isNaN(index) && index >= 0 && index < items.length) {
                items.splice(index, 1);
                res.end('Item deleted');
            } else {
                res.statusCode = 400;
                res.end('Invalid index');
            }
        });
    }

    // Invalid method
    else {
        res.statusCode = 405;
        res.end('Method Not Allowed');
    }
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
