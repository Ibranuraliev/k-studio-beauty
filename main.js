/* ============================================
   MAIN.JS — Interactions & Animations
   К Студия — Beauty Salon Website
   ============================================ */

'use strict';

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initGalleryFilter();
  initLightbox();
  initFAQ();
  initSmoothScroll();
  initActiveNav();
});

/* ─── 1. HEADER — transparent → solid on scroll ─── */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.remove('header--transparent');
      header.classList.add('header--scrolled');
    } else {
      header.classList.add('header--transparent');
      header.classList.remove('header--scrolled');
    }
  }

  // Initial state
  if (header.classList.contains('header--transparent')) {
    updateHeader();
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* ─── 2. MOBILE NAV ─── */
function initMobileNav() {
  const burger   = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const overlay  = document.querySelector('.mobile-nav__overlay');
  const closeBtn = document.querySelector('.mobile-nav__close');

  if (!burger || !mobileNav) return;

  function openNav() {
    burger.classList.add('is-open');
    mobileNav.classList.add('is-open');
    overlay?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    burger.classList.contains('is-open') ? closeNav() : openNav();
  });

  closeBtn?.addEventListener('click', closeNav);
  overlay?.addEventListener('click', closeNav);

  // Close on nav link click
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ─── 3. SCROLL REVEAL ─── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── 4. GALLERY FILTER ─── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('[data-category]');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      // Show/hide items with animation
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;

        if (match) {
          item.style.display = '';
          // Trigger reflow then animate in
          requestAnimationFrame(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            if (!match) item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Init all items
  galleryItems.forEach(item => {
    item.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  });
}

/* ─── 5. LIGHTBOX ─── */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__image');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const closeBtn = document.querySelector('.lightbox__close');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src, caption = '') {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    // Clear src after animation
    setTimeout(() => { lightboxImg.src = ''; }, 300);
  }

  // Trigger on gallery items
  document.addEventListener('click', e => {
    const galleryItem = e.target.closest('[data-lightbox]');
    if (galleryItem) {
      const src = galleryItem.dataset.lightbox;
      const caption = galleryItem.dataset.caption || '';
      openLightbox(src, caption);
    }
  });

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

/* ─── 6. FAQ ACCORDION ─── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      faqItems.forEach(i => {
        i.classList.remove('is-open');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ─── 7. SMOOTH SCROLL ─── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const headerH = document.querySelector('.header')?.offsetHeight || 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ─── 8. ACTIVE NAV LINK ─── */
function initActiveNav() {
  const links = document.querySelectorAll('.header__nav-link');
  const currentPath = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
      link.classList.add('is-active');
    }
  });
}
