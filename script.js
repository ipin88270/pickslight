/* ============================================================
   SCRIPT.JS – Picks Light Store
   ============================================================ */

'use strict';

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNavLink();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- REVEAL ON SCROLL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 1);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = (i % 4) * 80;
  revealObserver.observe(el);
});

// ---- PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const isBlue = Math.random() > 0.5;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${isBlue ? '#00d4ff' : '#39ff14'};
      box-shadow: 0 0 ${size * 3}px ${isBlue ? '#00d4ff' : '#39ff14'};
      animation-duration: ${Math.random() * 8 + 6}s;
      animation-delay: ${Math.random() * 6}s;
      opacity: ${Math.random() * 0.8 + 0.2};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ---- STATS COUNTER ANIMATION ----
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const duration = 2000;
  const step = (target - start) / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = (Number.isInteger(target) ? Math.floor(start) : start.toFixed(1)) + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(numEl => {
        const text = numEl.textContent.trim();
        if (text.includes('500')) animateCounter(numEl, 500, '+');
        else if (text.includes('1K')) {
          numEl.textContent = '0+';
          let n = 0;
          const t = setInterval(() => {
            n += 30;
            if (n >= 1000) { n = 1000; clearInterval(t); numEl.textContent = '1K+'; }
            else numEl.textContent = n + '+';
          }, 30);
        }
        else if (text.includes('4.9')) animateCounter(numEl, 4.9, '★');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---- GALLERY LIGHTBOX ----
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const label = item.querySelector('.gallery-overlay span');
    if (!img) return;
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.92); backdrop-filter:blur(10px);
      display:flex; align-items:center; justify-content:center; flex-direction:column;
      padding:2rem; cursor:zoom-out; animation:fadeIn .3s ease;
    `;
    lightbox.innerHTML = `
      <img src="${img.src}" alt="${img.alt}" style="max-width:90%; max-height:80vh; object-fit:contain; border-radius:12px; border:1px solid rgba(0,212,255,0.2);" />
      ${label ? `<p style="color:#7a87a3;margin-top:1rem;font-size:.9rem;">${label.textContent}</p>` : ''}
    `;
    document.body.appendChild(lightbox);
    lightbox.addEventListener('click', () => lightbox.remove());
  });
});

// ---- FLOATING WA PULSE ----
const floatingWa = document.querySelector('.floating-wa');
if (floatingWa) {
  let pulseRing = document.createElement('div');
  pulseRing.style.cssText = `
    position:absolute; inset:-8px; border-radius:50%;
    border:2px solid rgba(37,211,102,0.5);
    animation:wa-ring 2s ease-in-out infinite;
    pointer-events:none;
  `;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wa-ring {
      0%{transform:scale(1);opacity:1;}
      100%{transform:scale(1.5);opacity:0;}
    }
    @keyframes fadeIn {
      from{opacity:0;} to{opacity:1;}
    }
  `;
  document.head.appendChild(style);
  floatingWa.style.position = 'fixed';
  floatingWa.appendChild(pulseRing);
}

// ---- NAVBAR GLASS HOVER ----
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.2s ease';
  });
});

// ---- CATEGORY CARD INTERACTION ----
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('mouseenter', function () {
    const glow = this.querySelector('.cat-glow');
    if (glow) glow.style.transform = 'scale(2)';
  });
  card.addEventListener('mouseleave', function () {
    const glow = this.querySelector('.cat-glow');
    if (glow) glow.style.transform = 'scale(1)';
  });
  card.addEventListener('click', function () {
    const id = this.id.replace('cat-', '');
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ---- STAGGER ANIMATION FOR GRIDS ----
function staggerReveal(selector) {
  const items = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const parent = entry.target;
        const children = parent.querySelectorAll(':scope > *');
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 80}ms`;
        });
        observer.unobserve(parent);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(el => observer.observe(el));
}

staggerReveal('.features-grid');
staggerReveal('.categories-grid');
staggerReveal('.products-grid');
staggerReveal('.social-grid');

// ---- NEON GLOW ON SECTION TITLES ----
const sectionTitles = document.querySelectorAll('.section-title .gradient-text');
const glowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'none';
      entry.target.style.opacity = '1';
    }
  });
}, { threshold: 0.5 });
sectionTitles.forEach(el => glowObserver.observe(el));

// ---- HOURS BADGE LOGIC ----
function updateHoursBadge() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const isWeekday = day >= 1 && day <= 6; // Mon-Sat
  const isOpen = isWeekday && hour >= 9 && hour < 18;
  const badge = document.querySelector('.hours-badge');
  if (badge) {
    if (isOpen) {
      badge.innerHTML = '<span class="hours-dot"></span> Buka Sekarang';
      badge.style.color = '#39ff14';
      badge.style.background = 'rgba(57,255,20,0.1)';
    } else {
      badge.innerHTML = '<span class="hours-dot" style="background:#ff4444;box-shadow:0 0 5px #ff4444;"></span> Sedang Tutup';
      badge.style.color = '#ff4444';
      badge.style.background = 'rgba(255,68,68,0.1)';
    }
  }
}
updateHoursBadge();

// ---- PRODUCT CARD TILT EFFECT ----
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    this.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    this.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    this.style.transition = 'transform 0.4s ease';
  });
});

console.log('%c⚡ Picks Light Store', 'color:#00d4ff;font-size:20px;font-weight:900;');
console.log('%cModern Lighting & Automotive Solution', 'color:#39ff14;font-size:12px;');
