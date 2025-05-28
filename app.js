const api = 'https://sklepik-backend.onrender.com'; // zmień na swój jeśli trzeba
let token = null;
let user = null;

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch(`${api}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    token = data.token;
    user = username;
    document.getElementById('user').textContent = user;
    document.getElementById('login').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    loadProducts();
  })
  .catch(() => alert('Błąd logowania'));
}

function logout() {
  token = null;
  user = null;
  document.getElementById('login').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function loadProducts() {
  fetch(`${api}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(products => {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} - ${p.price} zł (${p.stock} szt.)`;
      list.appendChild(li);
    });
  });
}

function addProduct() {
  const name = document.getElementById('new-name').value;
  const price = parseFloat(document.getElementById('new-price').value);
  const stock = parseInt(document.getElementById('new-stock').value);

  fetch(`${api}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name, price, stock })
  })
  .then(res => {
    if (res.ok) {
      loadProducts();
    } else {
      alert('Błąd dodawania produktu');
    }
  });
}
