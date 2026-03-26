const http = require('http');
const app = require('./server');

const server = app.listen(0, () => {
  const port = server.address().port;
  http.get(`http://localhost:${port}/health`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const body = JSON.parse(data);
      if (body.status === 'healthy') {
        console.log('PASS: Health check returned healthy');
        server.close(() => process.exit(0));
      } else {
        console.log('FAIL: Unexpected response');
        server.close(() => process.exit(1));
      }
    });
  });
});
