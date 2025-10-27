/* RiskyMart V4 - script.js
   Features:
   - render product grid
   - search / filter / sort
   - cart (localStorage) with qty
   - fly-to-cart animation
   - toast notifications
   - responsive mobile menu
*/

// --- product data (dummy) ---
const PRODUCTS = [
  { id: 'p1', title: 'Vitamin C 1000mg', price: 85000, category: 'vitamin', img: 'https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880', desc: 'Meningkatkan daya tahan tubuh. 60 kapsul.' },
  { id: 'p2', title: 'Multivitamin Daily', price: 125000, category: 'vitamin', img: 'https://images.unsplash.com/photo-1662673143520-721ed4fbe965?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774', desc: 'Nutrisi lengkap untuk aktifitas harian.' },
  { id: 'p3', title: 'Serum Glow Skin', price: 98000, category: 'skincare', img: 'https://images.unsplash.com/photo-1746676266118-18e4d6d402a2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2VydW0lMjBwcm9kdWN0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800', desc: 'Mencerahkan & melembapkan wajah.' },
  { id: 'p4', title: 'Face Cleanse Gel', price: 65000, category: 'skincare', img: 'https://images.unsplash.com/photo-1691096673040-1632eb4b0a9d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z2VsJTIwcHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=800', desc: 'Membersihkan tanpa membuat kering.' },
  { id: 'p5', title: 'Tensi Monitor Mini', price: 450000, category: 'alat', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgaTMXLImOcdotkQfR6knxHhNgbDbbpPtKnqexsWTt4g&s=10', desc: 'Alat tensi portabel & akurat.' },
  { id: 'p6', title: 'Thermometer Digital', price: 120000, category: 'alat', img: 'https://plus.unsplash.com/premium_photo-1669898193574-9d41b04c4e7e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGhlbW9tZXRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=800', desc: 'Suhu cepat & hygienis.' },
  { id: 'p7', title: 'Ekstrak Herbal', price: 78000, category: 'herbal', img: 'https://images.unsplash.com/photo-1666288940470-b3634940bfe0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGV4dHJhY3QlMjBoZXJiYWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=800', desc: 'Racikan herbal tradisional.' },
  { id: 'p8', title: 'Oil Essential', price: 56000, category: 'herbal', img: 'https://images.unsplash.com/photo-1596470663178-dc2df28026f7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2lsJTIwZXNzZW50aWFsfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=800', desc: 'Aromaterapi relaksasi.' }
];

// --- helpers
const currency = v => 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const el = sel => document.querySelector(sel);
const elAll = sel => Array.from(document.querySelectorAll(sel));

// --- DOM refs
const grid = el('#productGrid');
const cartToggle = el('#cartToggle');
const cartSidebar = el('#cartSidebar');
const cartItemsEl = el('#cartItems');
const cartCount = el('#cartCount');
const cartTotal = el('#cartTotal');
const searchInput = el('#searchInput');
const filterCategory = el('#filterCategory');
const sortBy = el('#sortBy');
const toast = el('#toast');
const menuToggle = el('#menuToggle');
const mobileMenu = el('#mobileMenu');
const closeCartBtn = el('#closeCart');
const clearCartBtn = el('#clearCart');
const checkoutBtn = el('#checkoutBtn');
const shopNow = el('#shopNow');
const bubblesContainer = el('.bubbles');

// --- cart state (id -> { ...product, qty })
let cart = JSON.parse(localStorage.getItem('rm_cart_v4') || '{}');

// --- render helpers ---
function renderProducts(list){
  grid.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <div class="thumb"><img src="${p.img}" alt="${p.title}" loading="lazy"></div>
      <h4>${p.title}</h4>
      <p class="desc">${p.desc}</p>
      <div class="meta">
        <div class="price">${currency(p.price)}</div>
        <button class="add-btn" data-id="${p.id}">Tambah</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- filters / search / sort ---
function applyFilters(){
  let list = [...PRODUCTS];
  const q = searchInput.value.trim().toLowerCase();
  if (q) list = list.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
  const cat = filterCategory.value;
  if (cat !== 'all') list = list.filter(p => p.category === cat);
  if (sortBy.value === 'price-asc') list.sort((a,b)=>a.price-b.price);
  else if (sortBy.value === 'price-desc') list.sort((a,b)=>b.price-a.price);
  else list.sort((a,b)=>a.id.localeCompare(b.id)); // newest simulated
  renderProducts(list);
}

// --- cart logic ---
function saveCart(){ localStorage.setItem('rm_cart_v4', JSON.stringify(cart)); updateCartUI(); }

function updateCartUI(){
  // count & total
  const items = Object.values(cart);
  let total = 0, count = 0;
  cartItemsEl.innerHTML = '';
  items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${it.img}" alt="${it.title}">
      <div style="flex:1">
        <div style="font-weight:700">${it.title}</div>
        <div style="font-size:13px;color:#6b7280">${currency(it.price)} x ${it.qty}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        <button class="ghost decrease" data-id="${it.id}">-</button>
        <button class="ghost increase" data-id="${it.id}">+</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
    total += it.price * it.qty;
    count += it.qty;
  });

  cartCount.textContent = count;
  cartTotal.textContent = currency(total);
}

// add to cart (with fly animation)
function addToCart(id, sourceImgEl = null){
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (!cart[id]) cart[id] = {...p, qty: 0};
  cart[id].qty++;

  // fly-to-cart: clone image
  if (sourceImgEl){
    const imgRect = sourceImgEl.getBoundingClientRect();
    const cartRect = cartToggle.getBoundingClientRect();
    const fly = sourceImgEl.cloneNode(true);
    fly.className = 'fly-img';
    fly.style.width = imgRect.width + 'px';
    fly.style.height = imgRect.height + 'px';
    fly.style.left = imgRect.left + 'px';
    fly.style.top = imgRect.top + 'px';
    document.body.appendChild(fly);
    // force reflow then animate
    requestAnimationFrame(() => {
      fly.style.transform = `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.2)`;
      fly.style.opacity = '0.6';
    });
    setTimeout(()=> fly.remove(), 650);
  }

  saveCart();
  showToast('✅ Ditambahkan ke keranjang');
}

// remove / adjust
cartItemsEl.addEventListener('click', (e)=>{
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('decrease')){
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart();
  } else if (e.target.classList.contains('increase')){
    cart[id].qty++;
    saveCart();
  }
});

// clear & checkout
clearCartBtn.addEventListener('click', ()=>{
  cart = {};
  saveCart();
  showToast('Keranjang dikosongkan');
});
checkoutBtn.addEventListener('click', ()=>{
  if (Object.keys(cart).length === 0) {
    showToast('Keranjang kosong');
    return;
  }
  // demo checkout flow
  showToast('Simulasi checkout — frontend only');
  cart = {};
  saveCart();
});

// toggle cart
cartToggle.addEventListener('click', ()=> {
  cartSidebar.classList.toggle('open');
  cartSidebar.setAttribute('aria-hidden', !cartSidebar.classList.contains('open'));
});
closeCartBtn.addEventListener('click', ()=> {
  cartSidebar.classList.remove('open');
});

// render product click (delegation)
grid.addEventListener('click', (e)=>{
  if (e.target.matches('.add-btn')){
    const id = e.target.dataset.id;
    // find source img
    const card = e.target.closest('.product');
    const img = card && card.querySelector('img');
    addToCart(id, img);
  }
});

// search / filter events
searchInput.addEventListener('input', applyFilters);
filterCategory.addEventListener('change', applyFilters);
sortBy.addEventListener('change', applyFilters);

// mobile menu
menuToggle.addEventListener('click', ()=>{
  if (mobileMenu.hasAttribute('hidden')) mobileMenu.removeAttribute('hidden');
  else mobileMenu.setAttribute('hidden','');
});

// close cart on outside click
document.addEventListener('click', (e)=>{
  if (!e.target.closest('.cart-sidebar') && !e.target.closest('#cartToggle') && cartSidebar.classList.contains('open')){
    cartSidebar.classList.remove('open');
  }
});

// keyboard shortcut (c)
document.addEventListener('keydown', (e)=>{
  if (e.key.toLowerCase() === 'c') cartSidebar.classList.toggle('open');
});

// toast
let toastTimer = null;
function showToast(text){
  toast.textContent = text;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> toast.style.opacity = '0', 1600);
}

// generate subtle bubbles positions
function createBubbles(count=8){
  if (!bubblesContainer) return;
  bubblesContainer.innerHTML = '';
  for (let i=0;i<count;i++){
    const s = document.createElement('span');
    const size = (Math.random()*120)+40;
    s.style.width = size+'px';
    s.style.height = size+'px';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.background = i%2===0 ? 'rgba(7,198,184,0.06)' : 'rgba(121,230,201,0.04)';
    s.style.animationDelay = (Math.random()*6)+'s';
    bubblesContainer.appendChild(s);
  }
}

// initialize
document.addEventListener('DOMContentLoaded', ()=>{
  // set products
  applyFilters();

  // set cart UI
  updateCartUI();

  // attach add-to-cart fallback for keyboard / delegated buttons created after render
  document.addEventListener('click', (e)=>{
    if (e.target.matches('.add-btn')) return; // handled
  });

  // shop now smooth scroll
  shopNow && shopNow.addEventListener('click', (ev)=>{
    ev.preventDefault();
    document.getElementById('products').scrollIntoView({behavior:'smooth'});
  });

  // create bubbles
  createBubbles(10);
});