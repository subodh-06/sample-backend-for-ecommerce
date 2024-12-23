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
;

// Sample data for demonstration (initially empty)
let products = [];

// Load products from db.json file
const loadProducts = () => {
  try {
    const data = fs.readFileSync('db.json');
    products = JSON.parse(data);
  } catch (err) {
    console.log('Error reading db.json:', err);
  }
};

// Load the products when the server starts
loadProducts();

// API Endpoints

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Add a new product
app.post('/api/products', (req, res) => {
  const product = req.body;
  product.id = Date.now(); // Add unique ID
  product.discount = product.mrp - product.currentPrice; // Calculate discount
  products.push(product);

  // Save to db.json
  fs.writeFileSync('db.json', JSON.stringify(products, null, 2));
  res.json({ message: 'Product added', product });
});

// Update product by ID
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedProduct = req.body;

  // Find the product by ID and update it
  let productIndex = products.findIndex((product) => product.id === id);

  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...updatedProduct };

    // Update discount
    products[productIndex].discount = products[productIndex].mrp - products[productIndex].currentPrice;

    // Save to db.json
    fs.writeFileSync('db.json', JSON.stringify(products, null, 2));

    res.json({ message: 'Product updated', product: products[productIndex] });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete product by ID
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  products = products.filter((product) => product.id !== id);

  // Save to db.json
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
