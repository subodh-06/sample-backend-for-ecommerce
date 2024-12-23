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
async function handleEditProduct(event) {
  try {
    // Step 1: Fetch the JSON data
    const response = await fetch('/api/products'); // Fetch from the API, not from db.json
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Step 2: Parse the JSON data
    const products = await response.json();
    console.log('Original Products:', products);

    // Step 3: Fetch the user product name
    const productId = event.target.dataset.id;
    const row = event.target.closest('tr');
    const name = row.children[0].textContent;
    console.log(name);

    // Step 4: Find and update the product in the JSON array
    const product = products.find(item => item.id == productId); // Find product by ID

    if (product) {
      const category = row.children[1].textContent;
      const mrp = parseFloat(row.children[2].textContent);
      const currentPrice = parseFloat(row.children[3].textContent);
      const imageUrl = row.children[5].querySelector('img').src;

      // Prefill the form with the current product details
      const productForm = document.getElementById('productForm');
      productForm.elements['productId'].value = productId;
      productForm.elements['name'].value = name;
      productForm.elements['category'].value = category;
      productForm.elements['mrp'].value = mrp;
      productForm.elements['currentPrice'].value = currentPrice;
      productForm.elements['imageUrl'].value = imageUrl;

      alert("Enter your new data");

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.addEventListener("click", async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Update the product with new values from the form
        product.name = productForm.elements['name'].value;
        product.category = productForm.elements['category'].value;
        product.mrp = parseFloat(productForm.elements['mrp'].value);
        product.currentPrice = parseFloat(productForm.elements['currentPrice'].value);
        product.discount = product.mrp - product.currentPrice;
        product.imageUrl = productForm.elements['imageUrl'].value;

        console.log('Updated Product:', product);

        // Step 5: Send the updated JSON to the server using the PUT request
        const updateResponse = await fetch(`/api/products/${productId}`, {
          method: 'PUT', // Use PUT to update the product
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product), // Send the updated product Saswat Credit
        });

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! Status: ${updateResponse.status}`);
        }

        alert('Product successfully updated!');
        console.log('File successfully updated on the server.');
      });
    } else {
      console.log(`Product with ID ${productId} not found.`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
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
