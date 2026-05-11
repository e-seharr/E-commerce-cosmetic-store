/* =========================================================
   NAVBAR LOADER
   Call loadNavbar() on any page inside /pages/
   The page must have: <div id="navbar-placeholder"></div>
   Works on GitHub Pages, live server, and file:// protocol.
   ========================================================= */
function loadNavbar() {
  /* Hardcoded navbar — always works regardless of protocol */
  var navHTML = '<nav>'
    + '<a href="../index.html">E-commerce Cosmetics Store</a>'
    + '<button class="menu-toggle" id="menuToggle" aria-expanded="false">'
    + '<span></span><span></span><span></span>'
    + '</button>'
    + '<ul id="navMenu">'
    + '<li><a href="../index.html">Home</a></li>'
    + '<li><a href="products.html">Products</a></li>'
    + '<li><a href="cart.html">Cart <span id="cartCount"></span></a></li>'
    + '<li><a href="contact.html">Contact</a></li>'
    + '<li><a href="login.html">Login</a></li>'
    + '<li><a href="dashboard.html">Dashboard</a></li>'
    + '</ul>'
    + '</nav>';

  var el = document.getElementById('navbar-placeholder');
  if (el) {
    el.innerHTML = navHTML;
    var toggle = document.getElementById('menuToggle');
    var menu   = document.getElementById('navMenu');
    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        menu.classList.toggle('open');
      });
    }
    updateCartCount();
  }
}

/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */
function showToast(message, type) {
  /* remove any existing toast */
  var old = document.getElementById('kiro-toast');
  if (old) old.remove();

  var toast = document.createElement('div');
  toast.id = 'kiro-toast';
  toast.textContent = message;
  toast.style.cssText = [
    'position:fixed',
    'bottom:28px',
    'left:50%',
    'transform:translateX(-50%)',
    'background:' + (type === 'error' ? '#e8527f' : '#ff6b9d'),
    'color:white',
    'padding:12px 28px',
    'border-radius:30px',
    'font-family:Poppins,sans-serif',
    'font-size:14px',
    'font-weight:600',
    'box-shadow:0 6px 20px rgba(0,0,0,0.18)',
    'z-index:9999',
    'opacity:1',
    'transition:opacity 0.4s ease'
  ].join(';');

  document.body.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    setTimeout(function() { toast.remove(); }, 400);
  }, 3000);
}

/* =========================================================
   CART FUNCTIONS
   ========================================================= */
function addToCart(name, price, btn) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  /* visual feedback on button */
  if (btn) {
    let original = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'linear-gradient(135deg, #c2185b, #e91e8c)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 1800);
  }
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let el = document.getElementById('cartCount');
  if (el) {
    el.textContent = cart.length > 0 ? '(' + cart.length + ')' : '';
  }
}

function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let tbody = document.getElementById('cartItems');
  let totalEl = document.getElementById('total');
  if (!tbody) return;

  let total = 0;
  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="table-empty">Cart is empty</td></tr>';
    if (totalEl) totalEl.textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>Rs. ${item.price}</td>
        <td><button onclick="removeItem(${index})">Remove</button></td>
      </tr>`;
  });

  if (totalEl) totalEl.textContent = total;
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

function clearCart() {
  localStorage.removeItem('cart');
  loadCart();
  updateCartCount();
}

function goCheckout() {
  window.location.href = 'checkout.html';
}

/* =========================================================
   CHECKOUT FUNCTIONS
   ========================================================= */
function loadOrderSummary() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let itemsEl   = document.getElementById('orderItems');
  let subtotalEl = document.getElementById('subtotal');
  let deliveryEl = document.getElementById('delivery');
  let totalEl    = document.getElementById('total');
  if (!itemsEl) return;

  let subtotal = 0;
  let html = '';
  cart.forEach(item => {
    subtotal += item.price;
    html += `<p>${item.name} — Rs. ${item.price}</p>`;
  });

  let delivery = subtotal >= 2000 ? 0 : (cart.length > 0 ? 200 : 0);
  itemsEl.innerHTML = html || '<p>No items</p>';
  if (subtotalEl) subtotalEl.textContent = subtotal;
  if (deliveryEl) deliveryEl.textContent = delivery;
  if (totalEl)    totalEl.textContent    = subtotal + delivery;
}

function placeOrder(event) {
  event.preventDefault();
  let name     = document.getElementById('fname').value.trim();
  let phone    = document.getElementById('phone').value.trim();
  let city     = document.getElementById('city').value.trim();
  let postal   = document.getElementById('postal').value.trim();
  let address  = document.getElementById('address').value.trim();
  let shipping = document.getElementById('shipping').value;
  let payment  = document.getElementById('payment').value;

  if (!name || !phone || !city || !postal || !address || !shipping || !payment) {
    alert('Please fill all fields');
    return;
  }
  if (phone.length < 11) {
    alert('Invalid phone number — must be 11 digits');
    return;
  }

  /* Save order to localStorage for dashboard */
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let subtotal = cart.reduce((s, i) => s + i.price, 0);
  let delivery = subtotal >= 2000 ? 0 : (cart.length > 0 ? 200 : 0);
  let total    = subtotal + delivery;

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  let orderId = 'ORD-' + Date.now();
  orders.push({
    id:       orderId,
    customer: name,
    phone:    phone,
    city:     city,
    address:  address,
    payment:  payment,
    shipping: shipping,
    items:    cart,
    subtotal: subtotal,
    delivery: delivery,
    total:    total,
    date:     new Date().toLocaleDateString(),
    status:   'New',
    seen:     false
  });
  localStorage.setItem('orders', JSON.stringify(orders));

  localStorage.removeItem('cart');
  alert('🎉 Order placed successfully! Thank you for shopping with E-commerce Cosmetics Store.');
  window.location.href = '../index.html';
}

/* =========================================================
   CONTACT FORM
   ========================================================= */
function sendMessage(event) {
  event.preventDefault();
  let name    = document.getElementById('cname').value.trim();
  let email   = document.getElementById('cemail').value.trim();
  let message = document.getElementById('cmessage').value.trim();

  if (!name || !email || !message) {
    alert('Please fill all fields');
    return;
  }
  alert('✅ Message sent! We will get back to you soon.');
  event.target.reset();
}

/* =========================================================
   NEWSLETTER
   ========================================================= */
function subscribe() {
  let email = document.getElementById('subEmail').value.trim();
  if (!email) {
    alert('Please enter your email');
    return;
  }
  alert('💕 Thank you for subscribing to E-commerce Cosmetics Store!');
  document.getElementById('subEmail').value = '';
}

/* =========================================================
   PRODUCT SEARCH (by name)
   ========================================================= */
function searchProduct(value) {
  let cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    let text = card.innerText.toLowerCase();
    card.style.display = text.includes(value.toLowerCase()) ? 'flex' : 'none';
  });
}

/* =========================================================
   FILTER BY CATEGORY
   ========================================================= */
function filterByCategory(category) {
  let cards = document.querySelectorAll('.card[data-category]');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  /* highlight active button */
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

/* =========================================================
   FILTER BY PRICE RANGE
   ========================================================= */
function filterByPrice() {
  let min = parseInt(document.getElementById('minPrice').value) || 0;
  let max = parseInt(document.getElementById('maxPrice').value) || 999999;
  let cards = document.querySelectorAll('.card[data-price]');
  cards.forEach(card => {
    let price = parseInt(card.getAttribute('data-price'));
    card.style.display = (price >= min && price <= max) ? 'flex' : 'none';
  });
}

function resetFilters() {
  document.querySelectorAll('.card').forEach(c => c.style.display = 'flex');
  let minEl = document.getElementById('minPrice');
  let maxEl = document.getElementById('maxPrice');
  if (minEl) minEl.value = '';
  if (maxEl) maxEl.value = '';
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
}

/* =========================================================
   HAMBURGER MENU TOGGLE
   ========================================================= */
function toggleMenu() {
  let menu = document.getElementById('navMenu');
  if (menu) menu.classList.toggle('open');
}

/* =========================================================
   LOGIN
   ========================================================= */
function loginUser(event) {
  event.preventDefault();
  let email    = document.getElementById('lemail').value.trim();
  let password = document.getElementById('lpassword').value.trim();

  if (!email || !password) { alert('Please fill all fields'); return; }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  let user  = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem('loggedIn', JSON.stringify(user));
    alert('✅ Welcome back, ' + user.name + '!');
    window.location.href = 'dashboard.html';
  } else {
    alert('❌ Invalid email or password');
  }
}

/* =========================================================
   REGISTER
   ========================================================= */
function registerUser(event) {
  event.preventDefault();
  let name     = document.getElementById('rname').value.trim();
  let email    = document.getElementById('remail').value.trim();
  let password = document.getElementById('rpassword').value.trim();
  let confirm  = document.getElementById('rconfirm').value.trim();

  if (!name || !email || !password || !confirm) { alert('Please fill all fields'); return; }
  if (password !== confirm) { alert('Passwords do not match'); return; }
  if (password.length < 6)  { alert('Password must be at least 6 characters'); return; }

  let users = JSON.parse(localStorage.getItem('users')) || [];
  if (users.find(u => u.email === email)) { alert('Email already registered'); return; }

  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('🎉 Account created! Please login.');
  window.location.href = 'login.html';
}

/* =========================================================
   DASHBOARD — STOCK MANAGEMENT
   ========================================================= */
function loadStock() {
  let stock = JSON.parse(localStorage.getItem('stock')) || getDefaultStock();
  let tbody = document.getElementById('stockTable');
  if (!tbody) return;

  tbody.innerHTML = '';
  stock.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td>Rs. ${item.price}</td>
        <td>${item.qty}</td>
        <td>
          <button onclick="editStock(${i})">Edit</button>
          <button onclick="deleteStock(${i})">Delete</button>
        </td>
      </tr>`;
  });
  drawChart(stock);
}

function getDefaultStock() {
  let stock = [
    { name: 'Matte Lipstick',    category: 'Makeup',    price: 1200, qty: 50 },
    { name: 'Foundation',        category: 'Makeup',    price: 2500, qty: 30 },
    { name: 'Mascara',           category: 'Makeup',    price: 1800, qty: 40 },
    { name: 'Face Cleanser',     category: 'Skincare',  price: 1500, qty: 25 },
    { name: 'Moisturizer',       category: 'Skincare',  price: 2000, qty: 35 },
    { name: 'Vitamin C Serum',   category: 'Skincare',  price: 1200, qty: 20 },
    { name: 'Shampoo',           category: 'Haircare',  price: 1200, qty: 45 },
    { name: 'Hair Oil',          category: 'Haircare',  price: 700,  qty: 60 },
    { name: 'Nail Polish',       category: 'Nailcare',  price: 700,  qty: 80 },
    { name: 'Eyeshadow Palette', category: 'Makeup',    price: 3500, qty: 15 },
  ];
  localStorage.setItem('stock', JSON.stringify(stock));
  return stock;
}

function deleteStock(index) {
  if (!confirm('Delete this item?')) return;
  let stock = JSON.parse(localStorage.getItem('stock')) || [];
  stock.splice(index, 1);
  localStorage.setItem('stock', JSON.stringify(stock));
  loadStock();
}

function editStock(index) {
  let stock = JSON.parse(localStorage.getItem('stock')) || [];
  let item  = stock[index];
  let newName  = prompt('Product Name:', item.name);
  let newPrice = prompt('Price:', item.price);
  let newQty   = prompt('Quantity:', item.qty);
  if (newName && newPrice && newQty) {
    stock[index] = { ...item, name: newName, price: parseInt(newPrice), qty: parseInt(newQty) };
    localStorage.setItem('stock', JSON.stringify(stock));
    loadStock();
  }
}

function insertStock(event) {
  event.preventDefault();
  let name     = document.getElementById('sname').value.trim();
  let category = document.getElementById('scategory').value;
  let price    = parseInt(document.getElementById('sprice').value);
  let qty      = parseInt(document.getElementById('sqty').value);

  if (!name || !category || !price || !qty) { alert('Fill all fields'); return; }

  let stock = JSON.parse(localStorage.getItem('stock')) || [];
  stock.push({ name, category, price, qty });
  localStorage.setItem('stock', JSON.stringify(stock));
  alert('✅ Product added to stock!');
  event.target.reset();
  loadStock();
}

/* =========================================================
   DASHBOARD CHART (pure JS canvas bar chart)
   ========================================================= */
function drawChart(stock) {
  let canvas = document.getElementById('stockChart');
  if (!canvas) return;
  let ctx = canvas.getContext('2d');

  /* group qty by category */
  let cats = {};
  stock.forEach(item => {
    cats[item.category] = (cats[item.category] || 0) + item.qty;
  });

  let labels = Object.keys(cats);
  let values = Object.values(cats);
  let colors = ['#ff4d6d','#ff8fa3','#ffccd5','#c9184a','#ff006e'];

  let maxVal  = Math.max(...values);
  let barW    = 60;
  let gap     = 30;
  let padL    = 50;
  let padB    = 50;
  let chartH  = canvas.height - padB - 20;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* Y axis */
  ctx.strokeStyle = '#ccc';
  ctx.beginPath();
  ctx.moveTo(padL, 10);
  ctx.lineTo(padL, canvas.height - padB);
  ctx.lineTo(canvas.width - 10, canvas.height - padB);
  ctx.stroke();

  labels.forEach((label, i) => {
    let x   = padL + i * (barW + gap) + gap;
    let barH = (values[i] / maxVal) * chartH;
    let y   = canvas.height - padB - barH;

    /* bar */
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x, y, barW, barH);

    /* value on top */
    ctx.fillStyle = '#333';
    ctx.font = '12px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values[i], x + barW / 2, y - 5);

    /* label */
    ctx.fillStyle = '#555';
    ctx.font = '11px Poppins, sans-serif';
    ctx.fillText(label, x + barW / 2, canvas.height - padB + 18);
  });
}

/* =========================================================
   BUY NOW
   ========================================================= */
function buyNow(name, price) {
  localStorage.setItem('cart', JSON.stringify([{ name, price }]));
  window.location.href = 'checkout.html';
}

/* =========================================================
   AUTO-INIT on page load
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
});

