const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let items = [
  { id: 1, name: 'Learn Docker', status: 'done' },
  { id: 2, name: 'Deploy to ECS', status: 'in-progress' }
];

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(),
             version: process.env.APP_VERSION || '1.0.0' });
});

app.get('/api/items', (req, res) => res.json(items));

app.post('/api/items', (req, res) => {
  const item = { id: items.length + 1, ...req.body };
  items.push(item);
  res.status(201).json(item);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;

File: application/test.js
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