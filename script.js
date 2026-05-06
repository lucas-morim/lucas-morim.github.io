/* ═══════════════════════════════════════════════════════════════
   Lucas Morim — Portfolio Script
   ═══════════════════════════════════════════════════════════════ */

// ─── Nav scroll behavior ──────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── Mobile menu ──────────────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
  }
});

// ─── Typing animation ─────────────────────────────────────────────
const phrases = [
  'scalable web applications',
  'clean, maintainable APIs',
  'full-stack solutions',
  'enterprise-grade software',
];

const typedEl  = document.getElementById('typedText');
const cursorEl = document.getElementById('cursor');

let phraseIdx  = 0;
let charIdx    = 0;
let deleting   = false;
let paused     = false;

function type() {
  const phrase = phrases[phraseIdx];

  if (paused) return;

  if (!deleting) {
    typedEl.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) {
      paused = true;
      setTimeout(() => { paused = false; deleting = true; }, 2200);
      setTimeout(type, 2400);
      return;
    }
    setTimeout(type, 68);
  } else {
    typedEl.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 350);
      return;
    }
    setTimeout(type, 38);
  }
}

// Start after hero reveal settles
setTimeout(type, 800);

// ─── Scroll reveal (Intersection Observer) ───────────────────────
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -48px 0px',
});

reveals.forEach(el => observer.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll('.hero .reveal').forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), i * 120);
});

// ─── Active nav link highlight on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinksAll.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ─── Video modal ──────────────────────────────────────────────────
const modal       = document.getElementById('videoModal');
const modalVideo  = document.getElementById('modalVideo');
const modalClose  = document.getElementById('modalClose');
const modalBg     = document.getElementById('modalBackdrop');

function openModal(src, portrait = false) {
  modal.classList.add('open');
  modal.classList.toggle('modal--portrait', portrait);
  document.body.style.overflow = 'hidden';
  if (src) {
    modalVideo.src = src;
    modalVideo.play().catch(() => {});
  }
}

function closeModal() {
  modal.classList.remove('open', 'modal--portrait');
  modalVideo.pause();
  modalVideo.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.proj__video').forEach(videoBox => {
  if (!videoBox.dataset.video) return;
  videoBox.addEventListener('click', () => {
    const isPortrait = videoBox.classList.contains('proj__video--portrait');
    openModal(videoBox.dataset.video, isPortrait);
  });
});

modalClose.addEventListener('click', closeModal);
modalBg.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── Smooth anchor scroll with offset for fixed nav ──────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Cursor blink pause while typing ─────────────────────────────
let blinkTimer;
function resetCursorBlink() {
  cursorEl.style.animationPlayState = 'paused';
  cursorEl.style.opacity = '1';
  clearTimeout(blinkTimer);
  blinkTimer = setTimeout(() => {
    cursorEl.style.animationPlayState = 'running';
  }, 600);
}

const origType = type;
// Pause blink during active typing
const typeObserver = new MutationObserver(resetCursorBlink);
typeObserver.observe(typedEl, { childList: true, characterData: true, subtree: true });
