document.addEventListener('DOMContentLoaded', () => {
    // Handle delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.dataset.id;
  
        if (confirm('Are you sure you want to delete this product?')) {
          try {
            const response = await fetch(`/api/products/${productId}`, {
              method: 'DELETE'
            });
  
            if (response.ok) {
              // Redirect to products list or remove from DOM
              if (window.location.pathname === '/products') {
                // Remove from DOM if on list page
                const productCard = e.target.closest('.product-card');
                productCard.remove();
              } else {
                // Redirect if on detail page
                window.location.href = '/products';
              }
            } else {
              alert('Failed to delete the product');
            }
          } catch (err) {
            console.error('Error:', err);
            alert('An error occurred while deleting the product');
          }
        }
      });
    });
  
    // Handle search functionality
    const searchInput = document.getElementById('search');
    if (searchInput) {
      searchInput.addEventListener('input', filterProducts);
    }
  
    // Handle category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) { 
      categoryFilter.addEventListener('change', filterProducts);
    }
    // Filters products based 
    function filterProducts() {
      // get the item and category and set them to lowre case
      const searchTerm = searchInput.value.toLowerCase();
      const category = categoryFilter.value.toLowerCase();
      // for each product create a product card
      document.querySelectorAll('.product-card').forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        const productCategory = product.querySelector('.category').textContent.toLowerCase();
        const matchesSearch = name.includes(searchTerm);
        const matchesCategory = !category || productCategory.includes(category);
        // Either make the style block or none depeneding if it is in the category
        if (matchesSearch && matchesCategory) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    }
  
    // Handle form submission with validation
    const productForm = document.getElementById('productForm');
    if (productForm) { // Check if the product form exits
      productForm.addEventListener('submit', function (e) { // On form submit
        // Get the data name, price, category from the product form
        const nameInput = document.getElementById('name');
        const priceInput = document.getElementById('price');
        const categoryInput = document.getElementById('category');
        // Store isValid as true and errorMessage to an empty to string to change later
        let isValid = true;
        let errorMessage = '';
        // If the name of the product isnt valid (doesnt have a value) change isValid to false and set a valid error message
        if (!nameInput.value.trim()) {
          isValid = false;
          errorMessage += 'Product name is required\n';
        }
        // If the name of the product isnt valid (doesnt have a value, isnt a number, or price is less than or equal to zero)
        // change isValid to false and set a valid error message
        if (!priceInput.value || isNaN(priceInput.value) || Number(priceInput.value) <= 0) {
          isValid = false;
          errorMessage += 'Price must be a positive number\n';
        }
        // If the category isnt valid (doesnt have a value)
        //  change isValid to false and set a valid error message
        if (!categoryInput.value) {
          isValid = false;
          errorMessage += 'Please select a category\n';
        }
        // If isValid is false => stop the function from running and display the error message
        if (!isValid) {
          e.preventDefault();
          alert(errorMessage);
        }
      });
    }
  });