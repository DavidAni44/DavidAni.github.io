const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  setupNavScrollState();
  setupMobileMenu();
  setupThemeToggle();
  typeWriter();
  setupMotion();
});

/* Theme is set synchronously in <head> (localStorage, falling back to the OS preference)
   to avoid a flash of the wrong theme; this just wires up the toggle + persistence. */
function setupThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  function reflect() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  reflect();

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    reflect();
  });

  // If the user has never explicitly chosen a theme, keep following the OS preference live.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme')) return;
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    reflect();
  });
}

/* Sticky nav gains a hairline + shadow once the page has scrolled past the hero. */
function setupNavScrollState() {
  const nav = document.getElementById('site-nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Simple CSS-transition toggle — no animation library needed for a discrete open/close. */
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  menu.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

/* Types out the hero headline with a blinking caret, pure CSS/JS — no dependency on the
   motion library, so it still works if the CDN import below fails. */
function typeWriter() {
  const el = document.getElementById('hero-title');
  const text = "Hey! I'm David.";

  if (prefersReducedMotion) {
    el.textContent = text;
    return;
  }

  el.classList.add('typing');
  let i = 0;
  (function tick() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i += 1;
      setTimeout(tick, 70);
    } else {
      el.classList.remove('typing');
    }
  }());
}

/* Spring-driven entrance + scroll reveals. Everything this touches is marked `.reveal` and
   sits inside `.js .reveal { opacity: 0 }` — if this import fails, we drop the `js` class so
   the stylesheet's hidden rule stops applying and all content is simply visible, unanimated. */
async function setupMotion() {
  let animate;
  let inView;
  try {
    ({ animate, inView } = await import('https://cdn.jsdelivr.net/npm/motion@11/+esm'));
  } catch (err) {
    document.documentElement.classList.remove('js');
    return;
  }

  const spring = prefersReducedMotion
    ? { duration: 0.2, ease: 'linear' }
    : { type: 'spring', bounce: 0, duration: 0.4 };

  const rise = { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] };

  function reveal(el, delay = 0) {
    inView(
      el,
      () => {
        animate(el, rise, { ...spring, delay });
      },
      { amount: 0.2 }
    );
  }

  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroCta = document.getElementById('hero-cta');
  const heroChip = document.getElementById('hero-chip');
  const heroEls = [heroSubtitle, heroCta, heroChip];
  const timelineItems = Array.from(document.querySelectorAll('.timeline-item.reveal'));
  const otherReveals = Array.from(document.querySelectorAll('.reveal')).filter(
    (el) => !heroEls.includes(el) && !timelineItems.includes(el)
  );

  // Hero entrance fires once, immediately after the typewriter finishes.
  const heroDelay = prefersReducedMotion ? 0 : 0.9;
  animate(heroSubtitle, rise, { ...spring, delay: heroDelay });
  animate(heroCta, rise, { ...spring, delay: heroDelay + 0.1 });
  animate(heroChip, rise, { ...spring, delay: heroDelay + 0.2 });

  otherReveals.forEach((el) => reveal(el));
  timelineItems.forEach((el, i) => reveal(el, i * 0.06));
}
