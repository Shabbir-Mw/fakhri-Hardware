// ===========================
// Fakhri Hardware & Plywood
// Main JavaScript
// ===========================

/* --- Mobile Nav Toggle --- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* --- Close nav when a link is clicked --- */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

/* --- Highlight active nav link --- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

/* --- Catalogue: Filter & Search --- */
function initCatalogue() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('searchInput');
  const productCards = document.querySelectorAll('.product-card');
  const catSections  = document.querySelectorAll('.cat-block');

  if (!filterBtns.length) return;

  function filterProducts() {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    productCards.forEach(card => {
      const cat   = card.dataset.cat || '';
      const text  = card.textContent.toLowerCase();
      const matchCat  = activeFilter === 'all' || cat === activeFilter;
      const matchText = text.includes(query);
      card.style.display = (matchCat && matchText) ? '' : 'none';
    });

    // Hide section title if all cards in it are hidden
    catSections.forEach(section => {
      const visible = section.querySelectorAll('.product-card:not([style*="display: none"])');
      section.style.display = visible.length ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }

  // Auto-filter from URL param ?cat=plywood
  const urlParam = new URLSearchParams(window.location.search).get('cat');
  if (urlParam) {
    const target = document.querySelector(`.filter-btn[data-cat="${urlParam}"]`);
    if (target) {
      filterBtns.forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      filterProducts();
      document.querySelector('.filter-bar')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

initCatalogue();

/* --- Scroll-reveal animation --- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cat-card, .why-card, .product-card, .info-item').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

/* ---- Add reveal CSS dynamically ---- */
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .reveal.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);
