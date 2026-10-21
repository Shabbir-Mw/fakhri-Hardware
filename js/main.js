// ===========================
// Fakhri Hardware & Plywood
// Main JavaScript
// ===========================

/* --- Mobile Navigation --- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function toggleMobileNav(forceState) {
  if (!navLinks) return;
  const isOpen = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', isOpen);
  if (navBackdrop) {
    navBackdrop.classList.toggle('active', isOpen);
  }
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
    }
  }
}

if (hamburger) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileNav();
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', () => {
    toggleMobileNav(false);
  });
}

/* Close nav when clicking outside */
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
      toggleMobileNav(false);
    }
  }
});

/* Close on Escape key */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
    toggleMobileNav(false);
  }
});

/* --- Close nav when a nav link is clicked --- */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    toggleMobileNav(false);
  });
});

/* --- Highlight active nav and bottom bar links --- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

document.querySelectorAll('.mobile-bottom-bar .bottom-bar-item').forEach(item => {
  const href = item.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
    item.classList.add('active');
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
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const cat   = card.dataset.cat || '';
      const text  = card.textContent.toLowerCase();
      const matchCat  = activeFilter === 'all' || cat === activeFilter;
      const matchText = !query || text.includes(query);
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
}, { threshold: 0.08 });

document.querySelectorAll('.cat-card, .why-card, .product-card, .info-item').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

/* ---- Add reveal CSS dynamically ---- */
const style = document.createElement('style');
style.textContent = `
  .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.45s ease, transform 0.45s ease; }
  .reveal.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);
