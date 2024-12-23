// DOM Elements
const productForm = document.getElementById('productForm');
const productTable = document.getElementById('productTableBody');

// Fetch and display all products
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Display products in the table
function displayProducts(products) {
  productTable.innerHTML = ''; // Clear table
  products.forEach((product) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.mrp}</td>
      <td>${product.currentPrice}</td>
      <td>${product.discount}</td>
      <td><img src="${product.imageUrl}" alt="Product Image" width="50"></td>
      <td>
        <button class="edit-btn" data-id="${product.id}">Edit</button>
        <button class="delete-btn" data-id="${product.id}">Delete</button>
      </td>
    `;

    productTable.appendChild(row);
  });

  // Attach event listeners to Edit and Delete buttons
  document.querySelectorAll('.edit-btn').forEach((button) =>
    button.addEventListener('click', handleEditProduct)
  );
  document.querySelectorAll('.delete-btn').forEach((button) =>
    button.addEventListener('click', handleDeleteProduct)
  );
}

// Add a new product
async function addProduct(product) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    const result = await response.json();
    console.log(result);
    fetchProducts(); // Refresh product list
  } catch (error) {
    console.error('Error adding product:', error);
  }
}

// Delete a product
async function handleDeleteProduct(event) {
  const productId = event.target.dataset.id;
  try {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    console.log(result);
    fetchProducts(); // Refresh product list
  } catch (error) {
    console.error('Error deleting product:', error);
  }
}

// Edit a product
function handleEditProduct(event) {
  const productId = event.target.dataset.id;

  // Fetch the row containing the product's data
  const row = event.target.closest('tr');
  const name = row.children[0].textContent;
  const category = row.children[1].textContent;
  const mrp = row.children[2].textContent;
  const currentPrice = row.children[3].textContent;
  const imageUrl = row.children[5].querySelector('img').src;

  // Prefill the form for editing
  productForm.elements['productId'].value = productId;
  productForm.elements['name'].value = name;
  productForm.elements['category'].value = category;
  productForm.elements['mrp'].value = mrp;
  productForm.elements['currentPrice'].value = currentPrice;
  productForm.elements['imageUrl'].value = imageUrl;

  document.getElementById('submitBtn').textContent = 'Update Product';
}

// Handle form submission (Add or Update product)
productForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const productId = productForm.elements['productId'].value;
  const name = productForm.elements['name'].value;
  const category = productForm.elements['category'].value;
  const mrp = parseFloat(productForm.elements['mrp'].value);
  const currentPrice = parseFloat(productForm.elements['currentPrice'].value);
  const imageUrl = productForm.elements['imageUrl'].value;

  const product = {
    name,
    category,
    mrp,
    currentPrice,
    discount: mrp - currentPrice,
    imageUrl,
  };

  if (productId) {
    // Handle product update (not implemented here for simplicity)
    console.log('Updating product is not implemented yet');
  } else {
    await addProduct(product);
  }

  // Reset the form
  productForm.reset();
  productForm.elements['productId'].value = '';
  document.getElementById('submitBtn').textContent = 'Add Product';
});

// Initial fetch to populate the table
fetchProducts();
