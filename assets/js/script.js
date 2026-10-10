const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  setupNavScrollState();
  setupActiveSection();
  setupMobileMenu();
  setupThemeToggle();
  setupRoleDisclosure();
  setupMotion(typeWriter());
});

/* Theme is set synchronously in <head> (localStorage, falling back to the OS preference)
   to avoid a flash of the wrong theme; this just wires up the toggle + persistence.
   The label stays constant ("Dark mode") and aria-pressed carries the state, so screen
   readers don't announce the change twice. */
function setupThemeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  function reflect() {
    toggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
  }
  reflect();

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage unavailable (private mode): the choice just won't persist */
    }
    reflect();
  });

  // If the user has never explicitly chosen a theme, keep following the OS preference live.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (stored) return;
    root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    reflect();
  });
}

/* Sticky nav gains a soft blurred edge once the page has scrolled. */
function setupNavScrollState() {
  const nav = document.getElementById('site-nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Wayfinding: mark the nav link for the section currently under the header. */
function setupActiveSection() {
  const links = Array.from(document.querySelectorAll('.nav-links .nav-link, .mobile-menu .nav-link'))
    .filter((a) => a.getAttribute('href').startsWith('#'));
  const sections = ['about', 'experience', 'projects']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setCurrent(id) {
    links.forEach((a) => {
      if (a.getAttribute('href') === `#${id}`) {
        a.setAttribute('aria-current', 'true');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  // A thin band just under the nav: whichever section crosses it is "current".
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setCurrent(entry.target.id);
    });
  }, { rootMargin: '-72px 0px -60% 0px' });
  sections.forEach((section) => observer.observe(section));

  window.addEventListener('scroll', () => {
    if (window.scrollY < 200) setCurrent('');
  }, { passive: true });
}

/* Simple CSS-transition toggle — no animation library needed for a discrete open/close.
   Escape and tapping outside also close it, so the menu never traps the user. */
function setupMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const nav = document.getElementById('site-nav');

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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('pointerdown', (e) => {
    if (toggle.getAttribute('aria-expanded') === 'true' && !nav.contains(e.target)) {
      setOpen(false);
    }
  });
}

/* Progressive disclosure: show the first few bullets of each role, tuck the rest one tap
   deeper. Without JS every bullet stays visible. */
function setupRoleDisclosure() {
  const VISIBLE = 3;
  document.querySelectorAll('.role-desc').forEach((list, index) => {
    const items = Array.from(list.children);
    if (items.length <= VISIBLE + 1) return;

    const extra = items.slice(VISIBLE);
    const wrap = document.createElement('div');
    wrap.className = 'role-more';
    wrap.id = `role-more-${index}`;
    const inner = document.createElement('ul');
    inner.className = 'role-desc role-desc-more';
    extra.forEach((li) => inner.appendChild(li));
    wrap.appendChild(inner);
    list.after(wrap);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'role-toggle';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', wrap.id);
    const label = (open) => `${open ? 'Show less' : `Show ${extra.length} more`}`;
    button.textContent = label(false);
    wrap.after(button);

    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.textContent = label(open);
      wrap.classList.toggle('open', open);
    });
  });
}

/* Types out the hero headline with a blinking caret. The full text is already in the HTML
   (so crawlers, no-JS visitors and screen readers get it); this clears it and retypes it.
   Returns a promise that resolves when typing has finished, so the rest of the hero can
   enter at exactly that moment. */
function typeWriter() {
  const el = document.getElementById('hero-title');
  const text = el.textContent;

  if (prefersReducedMotion) return Promise.resolve();

  return new Promise((resolve) => {
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.classList.add('typing');
    let i = 0;
    (function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i += 1;
        setTimeout(tick, 55);
      } else {
        el.classList.remove('typing');
        el.removeAttribute('aria-label');
        resolve();
      }
    }());
  });
}

/* Spring-driven entrance + scroll reveals. Everything this touches is marked `.reveal` and
   sits inside `.js .reveal { opacity: 0 }`. If the library fails to load, or is slow
   (3s), we drop the `js` class so the stylesheet's hidden rule stops applying and all
   content is simply visible, unanimated. */
async function setupMotion(typing) {
  const MOTION_URL = 'https://cdn.jsdelivr.net/npm/motion@11.18.2/+esm';
  const root = document.documentElement;
  let animate;
  let inView;

  try {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('motion import timed out')), 3000);
    });
    ({ animate, inView } = await Promise.race([import(MOTION_URL), timeout]));
  } catch {
    root.classList.remove('js');
    return;
  }

  const spring = prefersReducedMotion
    ? { duration: 0.2, ease: 'linear' }
    : { type: 'spring', bounce: 0, duration: 0.4 };

  const rise = { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] };

  /* Hand the element back to the stylesheet once its entrance is done. Leaving the
     animation's inline transform on it would override :active/:hover transforms. The
     class keeps it visible; clearing the inline styles waits a frame because the library
     commits its final values just after the animation resolves. */
  function settle(el, animation) {
    el.classList.add('is-revealed');
    requestAnimationFrame(() => {
      animation.cancel();
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
    });
  }

  function enter(el, delay = 0) {
    const animation = animate(el, rise, { ...spring, delay });
    animation.then(() => settle(el, animation));
  }

  function reveal(el, delay = 0) {
    inView(
      el,
      () => {
        enter(el, delay);
      },
      { amount: 0.2 }
    );
  }

  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroActions = document.getElementById('hero-actions');
  const heroEls = [heroSubtitle, heroActions];
  const timelineItems = Array.from(document.querySelectorAll('.timeline-item.reveal'));
  const otherReveals = Array.from(document.querySelectorAll('.reveal')).filter(
    (el) => !heroEls.includes(el) && !timelineItems.includes(el)
  );

  otherReveals.forEach((el) => reveal(el));
  timelineItems.forEach((el, i) => reveal(el, i * 0.06));

  // Hero entrance fires once, the moment the typewriter finishes.
  await typing;
  enter(heroSubtitle);
  enter(heroActions, 0.1);
}
