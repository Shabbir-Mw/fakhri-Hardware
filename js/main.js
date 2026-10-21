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

/* --- About Page: Shop Photo Slider --- */
function initAboutSlider() {
  const slider = document.getElementById('aboutSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');

  if (!slides.length) return;

  let currentIndex = 0;
  let autoTimer = null;
  const intervalTime = 4500; // 4.5 seconds

  // Generate dynamic dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('active');
    if (dots[currentIndex]) dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  // Auto-play
  function startAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, intervalTime);
  }

  function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Mobile Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  startAutoPlay();
}

initAboutSlider();

/* --- Image Lightbox Popup Modal --- */
function initLightbox() {
  const modal = document.getElementById('lightboxModal');
  const backdrop = document.getElementById('lightboxBackdrop');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const modalImg = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const counterEl = document.getElementById('lightboxCounter');

  const items = Array.from(document.querySelectorAll('.stack-item'));
  if (!items.length || !modal) return;

  let currentIndex = 0;

  function openLightbox(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;

    const currentItem = items[currentIndex];
    const img = currentItem.querySelector('img');
    const captionSpan = currentItem.querySelector('.stack-item-caption span:first-child');
    const badgeSpan = currentItem.querySelector('.stack-badge');

    if (!img) return;

    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt || 'Enlarged Image';

    const titleText = captionSpan ? captionSpan.textContent.trim() : (img.alt || '');
    const badgeText = badgeSpan ? ` • ${badgeSpan.textContent.trim()}` : '';

    if (titleEl) titleEl.textContent = titleText + badgeText;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} of ${items.length}`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showNext() {
    openLightbox((currentIndex + 1) % items.length);
  }

  function showPrev() {
    openLightbox((currentIndex - 1 + items.length) % items.length);
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) showNext();
      else showPrev();
    }
  }, { passive: true });
}

initLightbox();

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
