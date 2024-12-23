const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files (index.html, styles.css, script.js)
app.use(express.static(path.join(__dirname)));

// Sample data for demonstration
let products = [];

// API Endpoints
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const product = req.body;
  product.id = Date.now(); // Add unique ID
  product.discount = product.mrp - product.currentPrice; // Calculate discount
  products.push(product);

  // Save to `db.json`
  fs.writeFileSync('db.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Product added', product });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  products = products.filter((product) => product.id !== id);

  // Update `db.json`
  fs.writeFileSync('db.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Product deleted' });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send('404: Route Not Found');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
