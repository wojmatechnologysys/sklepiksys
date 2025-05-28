const API_URL = 'https://sklepik-backend.onrender.com/api'; // <-- podmień na swój adres
const app = document.getElementById('app');

function showLogin() {
  app.innerHTML = \`
    <h2>Logowanie</h2>
    <input id="login" class="form-control mb-2" placeholder="Login">
    <input id="password" type="password" class="form-control mb-2" placeholder="Hasło">
    <button class="btn btn-primary" onclick="login()">Zaloguj</button>
  \`;
}

async function login() {
  const username = document.getElementById('login').value;
  const password = document.getElementById('password').value;

  const res = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('user', JSON.stringify({ username, role: data.role }));
    showPanel();
  } else {
    alert('Błędny login lub hasło');
  }
}

function logout() {
  localStorage.removeItem('user');
  showLogin();
}

function showPanel() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return showLogin();

  app.innerHTML = \`
    <div class="d-flex justify-content-between align-items-center">
      <h2>Sklepik – ${user.role}</h2>
      <button class="btn btn-danger" onclick="logout()">Wyloguj</button>
    </div>
    <ul class="nav nav-tabs mt-3" id="tabs">
      <li class="nav-item"><a class="nav-link active" onclick="showProducts()">Magazyn</a></li>
      <li class="nav-item"><a class="nav-link" onclick="showTransactions()">Transakcje</a></li>
      \${user.role === 'admin' ? '<li class="nav-item"><a class="nav-link" onclick="showUsers()">Użytkownicy</a></li>' : ''}
    </ul>
    <div id="panel" class="mt-3"></div>
  \`;

  showProducts();
}

async function showProducts() {
  const res = await fetch(API_URL + '/products');
  const products = await res.json();
  let html = '<h4>Produkty</h4><ul class="list-group">';

  for (const p of products) {
    html += \`<li class="list-group-item d-flex justify-content-between align-items-center">
      \${p.name} – \${p.price} zł – \${p.stock} szt.
      <button class="btn btn-sm btn-danger" onclick="deleteProduct('\${p.id}')">Usuń</button>
    </li>\`;
  }
  html += '</ul>';

  html += \`
    <h5 class="mt-4">Dodaj nowy produkt</h5>
    <input id="nazwa" class="form-control mb-1" placeholder="Nazwa">
    <input id="cena" class="form-control mb-1" type="number" placeholder="Cena">
    <input id="ilosc" class="form-control mb-2" type="number" placeholder="Ilość">
    <button class="btn btn-success" onclick="addProduct()">Dodaj</button>
  \`;

  document.getElementById('panel').innerHTML = html;
}

async function addProduct() {
  const product = {
    name: document.getElementById('nazwa').value,
    price: parseFloat(document.getElementById('cena').value),
    stock: parseInt(document.getElementById('ilosc').value)
  };

  await fetch(API_URL + '/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });

  showProducts();
}

async function deleteProduct(id) {
  await fetch(API_URL + '/products/' + id, { method: 'DELETE' });
  showProducts();
}

function showTransactions() {
  document.getElementById('panel').innerHTML = '<p>(Tę zakładkę jeszcze robię... 😅)</p>';
}

function showUsers() {
  document.getElementById('panel').innerHTML = '<p>(Panel admina w przygotowaniu 👑)</p>';
}

showPanel();
