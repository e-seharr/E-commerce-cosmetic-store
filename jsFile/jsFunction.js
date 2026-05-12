/* =========================================================
   ROOT NAVBAR LOADER (index.html only)
   ========================================================= */
function loadRootNavbar() {
  var navHTML = '<nav>'
    + '<a href="index.html">E-commerce Cosmetics Store</a>'
    + '<button class="menu-toggle" id="menuToggle" aria-expanded="false">'
    + '<span></span><span></span><span></span>'
    + '</button>'
    + '<ul id="navMenu">'
    + '<li><a href="index.html">Home</a></li>'
    + '<li><a href="pages/products.html">Products</a></li>'
    + '<li><a href="pages/cart.html">Cart <span id="cartCount"></span></a></li>'
    + '<li><a href="pages/contact.html">Contact</a></li>'
    + '<li><a href="pages/login.html">Login</a></li>'
    + '<li><a href="pages/dashboard.html">Dashboard</a></li>'
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
   HOME FILTER (index.html)
   ========================================================= */
function homeFilter(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#homeProducts .card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.home === type) ? 'flex' : 'none';
  });
}

/* =========================================================
   PRODUCTS PAGE — ACCORDION
   ========================================================= */
function toggleAcc(header) {
  let body = header.nextElementSibling;
  let sp = header.querySelector('span');
  let isOpen = sp.textContent === '−';
  document.querySelectorAll('.accordion-body').forEach(b => b.style.maxHeight = '');
  document.querySelectorAll('.accordion-header').forEach(h => {
    h.classList.remove('active');
    let s = h.querySelector('span'); if(s) s.textContent = '+';
  });
  if (!isOpen) {
    body.style.maxHeight = body.scrollHeight + 'px';
    header.classList.add('active');
    sp.textContent = '−';
  }
}

/* =========================================================
   PRODUCTS PAGE — FILTER BY CATEGORY / SUB / PRICE / SALE
   ========================================================= */
function setCat(cat, el) {
  document.querySelectorAll('.acc-link').forEach(a => a.classList.remove('active-link'));
  el.classList.add('active-link');
  document.querySelectorAll('.product-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'flex' : 'none';
  });
  showTag(cat === 'all' ? '' : cat.charAt(0).toUpperCase() + cat.slice(1));
}

function setSub(sub, el) {
  document.querySelectorAll('.acc-link').forEach(a => a.classList.remove('active-link'));
  el.classList.add('active-link');
  document.querySelectorAll('.product-card').forEach(c => {
    c.style.display = c.dataset.sub === sub ? 'flex' : 'none';
  });
  showTag(sub.charAt(0).toUpperCase() + sub.slice(1));
}

function applyPrice() {
  let min = parseInt(document.getElementById('minPrice').value) || 0;
  let max = parseInt(document.getElementById('maxPrice').value) || 999999;
  document.querySelectorAll('.product-card').forEach(c => {
    c.style.display = (parseInt(c.dataset.price) >= min && parseInt(c.dataset.price) <= max) ? 'flex' : 'none';
  });
  showTag('Rs.' + min + ' – Rs.' + (max === 999999 ? '∞' : max));
}

function showSaleOnly(el) {
  document.querySelectorAll('.acc-link').forEach(a => a.classList.remove('active-link'));
  el.classList.add('active-link');
  document.querySelectorAll('.product-card').forEach(c => {
    c.style.display = c.dataset.sale === 'true' ? 'flex' : 'none';
  });
  showTag('On Sale');
}

function showTag(label) {
  let t = document.getElementById('activeTags');
  if (!t) return;
  t.innerHTML = label ? `<div class="filter-tag">${label} <button onclick="clearAllFilters()">✕</button></div>` : '';
}

function clearAllFilters() {
  document.querySelectorAll('.product-card').forEach(c => c.style.display = 'flex');
  document.querySelectorAll('.acc-link').forEach(a => a.classList.remove('active-link'));
  let first = document.querySelector('.acc-link');
  if (first) first.classList.add('active-link');
  let minEl = document.getElementById('minPrice');
  let maxEl = document.getElementById('maxPrice');
  let searchEl = document.getElementById('searchInput');
  let tagsEl = document.getElementById('activeTags');
  if (minEl) minEl.value = '';
  if (maxEl) maxEl.value = '';
  if (searchEl) searchEl.value = '';
  if (tagsEl) tagsEl.innerHTML = '';
}

function liveSearch(val) {
  document.querySelectorAll('.product-card').forEach(c => {
    c.style.display = c.innerText.toLowerCase().includes(val.toLowerCase()) ? 'flex' : 'none';
  });
}

function sortProducts(val) {
  let grid = document.getElementById('productList');
  if (!grid) return;
  let cards = Array.from(grid.querySelectorAll('.product-card'));
  cards.sort((a, b) => {
    if (val === 'low')  return +a.dataset.price - +b.dataset.price;
    if (val === 'high') return +b.dataset.price - +a.dataset.price;
    if (val === 'name') return a.dataset.name.localeCompare(b.dataset.name);
    return 0;
  });
  cards.forEach(c => grid.appendChild(c));
}

/* =========================================================
   CART PAGE — ENHANCED loadCart
   ========================================================= */
function loadCart() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let tbody = document.getElementById('cartItems');

  /* simple cart (cart.html uses its own version below, but this covers basic pages) */
  if (!tbody) return;

  let subtotal = 0;
  tbody.innerHTML = '';

  let countEl = document.getElementById('cartItemCount');
  if (countEl) countEl.textContent = cart.length + (cart.length === 1 ? ' item' : ' items');

  if (cart.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">
          <div class="cart-empty-state">
            <div class="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <button onclick="window.location.href='products.html'">Shop Now</button>
          </div>
        </td>
      </tr>`;
    ['subtotalAmt','deliveryAmt','total'].forEach(id => {
      let el = document.getElementById(id); if (el) el.textContent = 0;
    });
    if (countEl) countEl.textContent = '0 items';
    let cc = document.getElementById('cartCount'); if (cc) cc.textContent = '';
    let giftEl = document.getElementById('freeGiftMsg');
    let progressEl = document.getElementById('giftProgress');
    if (giftEl) giftEl.classList.add('hidden');
    if (progressEl) { progressEl.classList.add('hidden'); progressEl.textContent = ''; }
    return;
  }

  /* group same items */
  let grouped = {};
  cart.forEach(item => {
    if (grouped[item.name]) {
      grouped[item.name].qty++;
      grouped[item.name].subtotal += item.price;
    } else {
      grouped[item.name] = { name: item.name, price: item.price, qty: 1, subtotal: item.price };
    }
  });

  Object.values(grouped).forEach(item => {
    subtotal += item.subtotal;
    tbody.innerHTML += `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>Rs. ${item.price}</td>
        <td>
          <div class="qty-control">
            <button onclick="changeQty('${item.name}', ${item.price}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty('${item.name}', ${item.price}, 1)">+</button>
          </div>
        </td>
        <td>Rs. ${item.subtotal}</td>
        <td><button class="btn-remove" onclick="removeByName('${item.name}')">🗑️</button></td>
      </tr>`;
  });

  let delivery = subtotal >= 2000 ? 0 : (subtotal > 0 ? 200 : 0);
  let subtotalEl = document.getElementById('subtotalAmt');
  let deliveryEl = document.getElementById('deliveryAmt');
  let totalEl    = document.getElementById('total');
  if (subtotalEl) subtotalEl.textContent = subtotal;
  if (deliveryEl) deliveryEl.textContent = delivery === 0 && subtotal > 0 ? 'FREE 🚚' : delivery;
  if (totalEl)    totalEl.textContent    = subtotal + delivery;

  let progressEl = document.getElementById('giftProgress');
  let giftEl     = document.getElementById('freeGiftMsg');
  if (subtotal >= 10000) {
    if (giftEl)     giftEl.classList.remove('hidden');
    if (progressEl) { progressEl.textContent = ''; progressEl.classList.add('hidden'); }
  } else {
    if (giftEl)     giftEl.classList.add('hidden');
    if (progressEl) { progressEl.textContent = `Spend Rs. ${10000 - subtotal} more for a FREE gift! 🎁`; progressEl.classList.remove('hidden'); }
  }
  updateCartCount();
}

function changeQty(name, price, delta) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (delta === 1) {
    cart.push({ name, price });
  } else {
    let idx = cart.findIndex(i => i.name === name);
    if (idx > -1) cart.splice(idx, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

function removeByName(name) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(i => i.name !== name);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

/* =========================================================
   DASHBOARD — SHOW TAB
   ========================================================= */
function showTab(name, scroll) {
  document.querySelectorAll('.dash-tab').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  var sec = document.getElementById('section-' + name);
  var btn = document.getElementById('tab-' + name);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  if (name === 'chart') {
    var s = JSON.parse(localStorage.getItem('stock')) || getDefaultStock();
    drawChart(s);
    drawOrdersChart();
  }
  if (name === 'categories') loadCategoryTable();
  if (name === 'orders') loadOrders();
  if (name === 'log') renderLog();
  if (scroll) {
    var el = document.getElementById('section-' + name);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* =========================================================
   DASHBOARD — STOCK WITH STATUS
   ========================================================= */
function loadStockWithStatus() {
  var stock = JSON.parse(localStorage.getItem('stock')) || getDefaultStock();
  var tbody = document.getElementById('stockTable');
  if (!tbody) return;
  tbody.innerHTML = '';
  stock.forEach(function(item, i) {
    var status = item.qty <= 5
      ? '<span class="status-low">Low Stock</span>'
      : item.qty <= 15
        ? '<span class="status-mid">Medium</span>'
        : '<span class="status-good">Good</span>';
    tbody.innerHTML += '<tr><td>' + (i+1) + '</td><td><strong>' + item.name + '</strong></td><td>' + item.category + '</td><td>Rs. ' + item.price + '</td><td>' + item.qty + '</td><td>' + status + '</td><td><button onclick="editStock(' + i + ')">Edit</button> <button onclick="deleteStockNew(' + i + ')">Delete</button></td></tr>';
  });
  var tp = document.getElementById('totalProducts');
  var tq = document.getElementById('totalQty');
  var tc = document.getElementById('totalCats');
  if (tp) tp.textContent = stock.length;
  if (tq) tq.textContent = stock.reduce(function(s, i) { return s + i.qty; }, 0);
  var cats = [...new Set(stock.map(function(i) { return i.category; }))];
  if (tc) tc.textContent = cats.length;
  drawChart(stock);
}

/* =========================================================
   DASHBOARD — ORDERS
   ========================================================= */
function loadOrders() {
  var orders = JSON.parse(localStorage.getItem('orders')) || [];
  var nt = document.getElementById('newOrdersTable');
  var at = document.getElementById('allOrdersTable');
  if (!nt || !at) return;
  var newO = orders.filter(function(o) { return !o.seen; });
  var badge = document.getElementById('newOrdersBadge');
  if (badge) badge.textContent = newO.length;
  nt.innerHTML = '';
  if (newO.length === 0) {
    nt.innerHTML = '<tr><td colspan="9" class="table-empty">No new orders</td></tr>';
  } else {
    newO.forEach(function(o) {
      var items = o.items.map(function(it) { return it.name; }).join(', ');
      nt.innerHTML += '<tr><td>' + o.id + '</td><td>' + o.customer + '</td><td>' + o.city + '</td><td class="order-items-small">' + items + '</td><td><strong>Rs. ' + o.total + '</strong></td><td>' + o.payment + '</td><td>' + o.date + '</td><td class="order-new">New</td><td><button onclick="markSeen(\'' + o.id + '\')">Mark Seen</button></td></tr>';
    });
  }
  at.innerHTML = '';
  if (orders.length === 0) {
    at.innerHTML = '<tr><td colspan="10" class="table-empty">No orders yet</td></tr>';
  } else {
    orders.forEach(function(o) {
      var items = o.items.map(function(it) { return it.name + ' (Rs.' + it.price + ')'; }).join(', ');
      var sc = o.seen ? 'order-seen' : 'order-new';
      var st = o.seen ? 'Seen' : 'New';
      at.innerHTML += '<tr><td>' + o.id + '</td><td>' + o.customer + '</td><td>' + o.phone + '</td><td class="order-items-small">' + items + '</td><td>Rs. ' + o.subtotal + '</td><td>Rs. ' + o.delivery + '</td><td><strong>Rs. ' + o.total + '</strong></td><td>' + o.payment + '</td><td>' + o.date + '</td><td class="' + sc + '">' + st + '</td></tr>';
    });
  }
}

function markSeen(id) {
  var orders = JSON.parse(localStorage.getItem('orders')) || [];
  var idx = orders.findIndex(function(o) { return o.id === id; });
  if (idx > -1) { orders[idx].seen = true; localStorage.setItem('orders', JSON.stringify(orders)); }
  loadOrders();
  updateOrderBadge();
}

function updateOrderBadge() {
  var orders = JSON.parse(localStorage.getItem('orders')) || [];
  var n = orders.filter(function(o) { return !o.seen; }).length;
  var badge = document.getElementById('newBadge');
  var cnt   = document.getElementById('newOrdersCount');
  var tot   = document.getElementById('totalOrders');
  if (badge) { badge.textContent = n; badge.style.display = n > 0 ? 'inline-block' : 'none'; }
  if (cnt) cnt.textContent = n;
  if (tot) tot.textContent = orders.length;
}

function loadCategoryTable() {
  var stock = JSON.parse(localStorage.getItem('stock')) || getDefaultStock();
  var tbody = document.getElementById('categoryTable');
  if (!tbody) return;
  var cats = {};
  stock.forEach(function(item) {
    if (!cats[item.category]) cats[item.category] = { count: 0, prices: [], qty: 0 };
    cats[item.category].count++;
    cats[item.category].prices.push(item.price);
    cats[item.category].qty += item.qty;
  });
  tbody.innerHTML = '';
  Object.entries(cats).forEach(function(e) {
    var cat = e[0], d = e[1];
    var min = Math.min(...d.prices), max = Math.max(...d.prices);
    var avg = Math.round(d.prices.reduce(function(a, b) { return a + b; }, 0) / d.prices.length);
    tbody.innerHTML += '<tr><td><strong>' + cat + '</strong></td><td>' + d.count + '</td><td>Rs. ' + min + '</td><td>Rs. ' + max + '</td><td>Rs. ' + avg + '</td><td>' + d.qty + '</td></tr>';
  });
}

function addLog(msg, icon) {
  var logs = JSON.parse(localStorage.getItem('activityLog')) || [];
  var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  logs.unshift({ msg: msg, icon: icon, time: time });
  if (logs.length > 20) logs = logs.slice(0, 20);
  localStorage.setItem('activityLog', JSON.stringify(logs));
}

function renderLog() {
  var logs = JSON.parse(localStorage.getItem('activityLog')) || [];
  var ul = document.getElementById('activityLog');
  if (!ul) return;
  if (logs.length === 0) { ul.innerHTML = '<li><span class="log-icon">📋</span> No activity yet.</li>'; return; }
  ul.innerHTML = logs.map(function(l) { return '<li><span class="log-icon">' + l.icon + '</span>' + l.msg + '<span class="log-time">' + l.time + '</span></li>'; }).join('');
}

function insertStockNew(event) {
  event.preventDefault();
  var name     = document.getElementById('sname').value.trim();
  var category = document.getElementById('scategory').value;
  var price    = parseInt(document.getElementById('sprice').value);
  var qty      = parseInt(document.getElementById('sqty').value);
  if (!name || !category || !price || !qty) { alert('Fill all fields'); return; }
  var stock = JSON.parse(localStorage.getItem('stock')) || [];
  stock.push({ name: name, category: category, price: price, qty: qty });
  localStorage.setItem('stock', JSON.stringify(stock));
  addLog('Added: ' + name + ' (' + category + ')', '➕');
  alert('✅ Product added!');
  event.target.reset();
  loadStockWithStatus();
}

function deleteStockNew(index) {
  if (!confirm('Delete this item?')) return;
  var stock = JSON.parse(localStorage.getItem('stock')) || [];
  var name = stock[index].name;
  stock.splice(index, 1);
  localStorage.setItem('stock', JSON.stringify(stock));
  addLog('Deleted: ' + name, '🗑️');
  loadStockWithStatus();
}

/* =========================================================
   DASHBOARD ORDERS CHART
   ========================================================= */
function drawOrdersChart() {
  var orders = JSON.parse(localStorage.getItem('orders')) || [];
  var total = orders.length;
  var newO  = orders.filter(function(o) { return !o.seen; }).length;
  var seen  = orders.filter(function(o) { return o.seen; }).length;
  var canvas = document.getElementById('ordersChart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var labels = ['Total Orders', 'New Orders', 'Seen Orders'];
  var values = [total, newO, seen];
  var colors = ['#ff6b9d', '#e8527f', '#ffd6e8'];
  var maxVal = Math.max(...values) || 1;
  var barW = 80, gap = 60, padL = 60, padB = 50, chartH = canvas.height - padB - 20;
  ctx.strokeStyle = '#eee';
  ctx.beginPath();
  ctx.moveTo(padL, 10);
  ctx.lineTo(padL, canvas.height - padB);
  ctx.lineTo(canvas.width - 10, canvas.height - padB);
  ctx.stroke();
  for (var i = 0; i < 3; i++) {
    var x = padL + i * (barW + gap) + gap;
    var barH = (values[i] / maxVal) * chartH;
    var y = canvas.height - padB - barH;
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Poppins,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values[i], x + barW / 2, y - 8);
    ctx.fillStyle = '#555';
    ctx.font = '12px Poppins,sans-serif';
    ctx.fillText(labels[i], x + barW / 2, canvas.height - padB + 18);
  }
}

/* =========================================================
   CONTACT FORM (contact.html — uses cfname, clname fields)
   ========================================================= */
function sendMessage(e) {
  e.preventDefault();
  /* contact.html has cfname + clname; fallback to cname for other pages */
  var fname = document.getElementById('cfname') ? document.getElementById('cfname').value.trim() : '';
  var name  = document.getElementById('cname')  ? document.getElementById('cname').value.trim()  : fname;
  var email = document.getElementById('cemail').value.trim();
  var msg   = document.getElementById('cmessage').value.trim();
  if ((!fname && !name) || !email || !msg) {
    if (typeof showToast === 'function') showToast('Please fill required fields', 'error');
    else alert('Please fill all fields');
    return;
  }
  if (typeof showToast === 'function') showToast('✅ Message sent! We will get back to you soon.');
  else alert('✅ Message sent! We will get back to you soon.');
  e.target.reset();
}

/* =========================================================
   AUTO-INIT on page load
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  updateCartCount();
});

