// ============================================
// UTILITY — Debounce
// Limits how often a function fires on scroll
// ============================================

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ============================================
// READING PROGRESS BAR
// Injected via JS — no HTML changes needed
// ============================================

const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

function updateReadingProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

// ============================================
// NAVIGATION — scroll state + mobile menu
// ============================================

const navWrapper = document.querySelector('.nav-wrapper');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.nav-mobile-link');

// Scroll state + progress bar — debounced to fire max every 10ms
window.addEventListener('scroll', debounce(() => {
  navWrapper?.classList.toggle('scrolled', window.scrollY > 20);
  updateReadingProgress();
}, 10));

// Hamburger toggle
hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Prevent body scroll when menu is open
  document.body.classList.toggle('menu-open', mobileMenu.classList.contains('open'));
});

// Close mobile menu on link click
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

// ============================================
// ACTIVE NAV LINK
// Highlights nav link matching current section
// Works on index.html (anchor-based)
// Works on inner pages (path-based)
// ============================================

const navLinks = document.querySelectorAll('.nav-links a');

// Path-based highlighting for inner pages
const currentPath = window.location.pathname;
navLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (!href) return;
  const linkPath = href.split('#')[0];
  if (
    linkPath &&
    linkPath !== '/' &&
    linkPath !== 'index.html' &&
    currentPath.includes(linkPath)
  ) {
    link.classList.add('active');
  }
});

// Anchor-based highlighting for landing page sections
const sections = document.querySelectorAll('section[id]');

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '-80px 0px 0px 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));
}

// ============================================
// SCROLL REVEAL — Intersection Observer
// Elements with class "reveal" fade up on scroll
// Stagger with reveal-delay-1/2/3/4 classes
// ============================================

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length) {
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Make everything visible immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

// ============================================
// HERO HEADLINE — staggered line reveal
// Each .hero-line appears in sequence on load
// ============================================

const heroLines = document.querySelectorAll('.hero-line');

if (heroLines.length) {
  if (!prefersReducedMotion) {
    heroLines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.add('visible');
      }, 150 + i * 180);
    });
  } else {
    heroLines.forEach(line => line.classList.add('visible'));
  }
}

// ============================================
// LAZY LOADING — native support check
// Adds loading="lazy" to any image missing it
// ============================================

if ('loading' in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    // Only lazy load images below the fold
    if (!img.closest('.hero')) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

// ============================================
// SCROLL TO TOP BUTTON
// Appears after scrolling 400px from top
// ============================================

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
  window.addEventListener('scroll', debounce(() => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, 100));

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}