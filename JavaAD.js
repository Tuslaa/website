let editIndex = -1;

function showAddProductForm() {
  document.getElementById('add-product-form').classList.remove('hidden');
  document.getElementById('product-name').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-quantity').value = '';
  document.getElementById('product-image').value = '';
  editIndex = -1;
}

function saveProductsToStorage() {
  const rows = document.querySelectorAll('#product-table-body tr');
  const products = [];
  rows.forEach(row => {
    products.push({
      image: row.children[0].querySelector('img').src,
      name: row.children[1].textContent,
      price: row.children[2].textContent.replace('đ', ''),
      quantity: row.children[3].textContent
    });
  });
  localStorage.setItem('products', JSON.stringify(products));
}

function loadProductsFromStorage() {
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  const tbody = document.getElementById('product-table-body');
  tbody.innerHTML = '';
  products.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-2 border"><img src='${p.image}' alt='balo' class='w-12 h-12 object-cover rounded' /></td>
      <td class="p-2 border">${p.name}</td>
      <td class="p-2 border">${p.price}đ</td>
      <td class="p-2 border">${p.quantity}</td>
      <td class="p-2 border space-x-2"> 
      <button class='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600' onclick='editProduct(this)'>Sửa</button>
      <button class='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600' onclick='deleteProduct(this)'>Xóa</button>
      </td>`;
    tbody.appendChild(row);
  });
  updateStats();
}

function addProduct() {
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value);
  const imageUrl = document.getElementById('product-image').value || 'https://via.placeholder.com/50';

  if (!name || isNaN(price) || isNaN(quantity)) {
    alert("Vui lòng nhập đầy đủ và chính xác thông tin sản phẩm.");
    return;
  }

  if (editIndex === -1) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td class="p-2 border"><img src='${imageUrl}' alt='balo' class='w-12 h-12 object-cover rounded' /></td>
      <td class="p-2 border">${name}</td>
      <td class="p-2 border">${price}đ</td>
      <td class="p-2 border">${quantity}</td>
      <td class="p-2 border space-x-2">
        <button class='bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600' onclick='editProduct(this)'>Sửa</button>
        <button class='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600' onclick='deleteProduct(this)'>Xóa</button>
      </td>`;
    document.getElementById('product-table-body').appendChild(newRow);
  } else {
    const row = document.getElementById('product-table-body').children[editIndex];
    row.children[0].querySelector('img').src = imageUrl;
    row.children[1].textContent = name;
    row.children[2].textContent = price + 'đ';
    row.children[3].textContent = quantity;
    editIndex = -1;
  }
  document.getElementById('add-product-form').reset();
  document.getElementById('add-product-form').classList.add('hidden');
  saveProductsToStorage();
  updateStats();
}

function editProduct(btn) {
  const row = btn.parentElement.parentElement;
  editIndex = Array.from(document.getElementById('product-table-body').children).indexOf(row);
  document.getElementById('product-name').value = row.children[1].textContent;
  document.getElementById('product-price').value = row.children[2].textContent.replace('đ', '');
  document.getElementById('product-quantity').value = row.children[3].textContent;
  document.getElementById('product-image').value = row.children[0].querySelector('img').src;
  document.getElementById('add-product-form').classList.remove('hidden');
}

function deleteProduct(btn) {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
    const row = btn.parentElement.parentElement;
    row.remove();
    saveProductsToStorage();
    updateStats();
  }
}

function filterProducts() {
  const filterValue = document.getElementById('filter-input').value.toLowerCase();
  const rows = document.querySelectorAll('#product-table-body tr');
  rows.forEach(row => {
    const name = row.children[1].textContent.toLowerCase();
    row.style.display = name.includes(filterValue) ? '' : 'none';
  });
}

function updateStats() {
  const rows = document.querySelectorAll('#product-table-body tr');
  let totalProducts = 0;
  let totalQuantity = 0;
  let totalValue = 0;
  rows.forEach(row => {
    const quantity = parseInt(row.children[3].textContent);
    const price = parseInt(row.children[2].textContent.replace('đ', ''));
    totalProducts++;
    totalQuantity += quantity;
    totalValue += quantity * price;
  });
  document.getElementById('stat-products').textContent = totalProducts;
  document.getElementById('stat-quantity').textContent = totalQuantity;
  document.getElementById('stat-value').textContent = totalValue + 'đ';
}

function loginAdmin() {
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  if (username === 'admin' && password === '123') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('admin-panel').classList.remove('hidden');
  } else {
    alert('Sai tài khoản hoặc mật khẩu!');
  }
}

window.addEventListener('load', () => {
  loadProductsFromStorage();
});
