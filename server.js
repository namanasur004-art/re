const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Log requests
    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);
    
    // Serve index.html for root
    if (pathname === '/' || pathname === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading page');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }
    
    // API endpoint to log payment attempts (for testing)
    if (pathname === '/api/payment' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Payment attempt:', data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Payment logged (demo mode)',
                    timestamp: new Date().toISOString()
                }));
            } catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }
    
    // 404 for everything else
    res.writeHead(404);
    res.end('Not found');
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('Payment Gateway Demo Server');
    console.log('='.repeat(60));
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/?name=repay+app&amount=3660&upi=paytm.s12rb9h@pty`);
    console.log('='.repeat(60));
});
