/* ════════════════════════════════════════════════
   SHAHIN ALAM — PORTFOLIO JAVASCRIPT
   Organized: Data → Preloader → Cursor →
              Matrix → Typing → Nav → Reveal →
              Skills → Projects → Tilt → Magnetic →
              Counter → Back-to-top → Init
═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────
   1. SITE DATA
   Edit this section to update content
───────────────────────────────────── */
const DATA = {

  /* Typing messages in hero terminal */
  typing: [
    'Full-Stack Software Engineer...',
    'Building Robust REST APIs...',
    'Clean Code & Best Practices Advocate...',
    'Passionate Problem Solver...',
    'Continuous Learner & Tech Enthusiast...',
  ],
};

/* ─────────────────────────────────────
   2. PRELOADER
───────────────────────────────────── */
// ========== PRELOADER JS ==========

function initPreloader() {
  const loader = document.getElementById('preloader');
  const fill = document.getElementById('pre-bar-fill');
  const glow = document.getElementById('pre-bar-glow');
  const pctEl = document.getElementById('pre-pct');
  const statusEl = document.getElementById('pre-status');
  const terminal = document.getElementById('pre-terminal');
  if (!loader) return;

  // Log lines with threshold (fires when progress passes this %)
  const LOG_LINES = [
    { at: 0, cls: '', text: '<span class="dim">[init]</span> Initializing Shahu.dev environment...' },
    { at: 8, cls: 'ok', text: '<span class="tag">✓</span> Bootstrapping runtime environment...</span>' },
    { at: 18, cls: '', text: '<span class="dim">[cdn]</span>   Fetching assets — fonts, icons, svg...' },
    { at: 27, cls: 'ok', text: '<span class="tag">✓</span> WebGL context initialized' },
    { at: 36, cls: '', text: '<span class="dim">[ts]</span> Applying smooth animations (GSAP) </span>' },
    { at: 45, cls: 'ok', text: '<span class="tag">✓</span> Bundle optimized <span class="dim">(tree-shaking applied)</span>' },
    { at: 54, cls: 'warn', text: '<span class="tag">⚡</span> Lazy chunks hydrated' },
    { at: 64, cls: '', text: '<span class="dim">[gsap]</span>  Registering animation sequences...' },
    { at: 73, cls: 'ok', text: '<span class="tag">✓</span> DOM ready — mounting components' },
    { at: 84, cls: '', text: '<span class="dim">[perf]</span>  Everything looks clean & fast ✨ PWA enabled</span>' },
    { at: 93, cls: 'done-line', text: '<span class="tag">✓</span> Welcome, I’m Shahin — Let’s build something amazing. 🚀' },
  ];

  const STATUS_MAP = [
    { at: 0, text: 'Initializing...' },
    { at: 20, text: 'Loading assets...' },
    { at: 45, text: 'Compiling modules...' },
    { at: 70, text: 'Mounting components...' },
    { at: 90, text: 'Almost ready...' },
    { at: 100, text: 'Launching.' },
  ];

  let progress = 0;
  let logPointer = 0;
  let maxLines = 5; // max visible lines in terminal

  function addLine(cfg) {
    const div = document.createElement('div');
    div.className = 'pre-line ' + (cfg.cls || '');
    div.innerHTML = cfg.text;
    terminal.appendChild(div);
    // Keep only last maxLines visible
    while (terminal.children.length > maxLines) {
      terminal.removeChild(terminal.firstChild);
    }
  }

  function updateStatus(p) {
    let label = STATUS_MAP[0].text;
    for (const s of STATUS_MAP) { if (p >= s.at) label = s.text; }
    statusEl.textContent = label;
  }

  const interval = setInterval(() => {
    // Organic random increment (slows near 100)
    const remaining = 100 - progress;
    const step = Math.random() * Math.min(14, remaining * 0.35 + 2);
    progress = Math.min(progress + step, 100);

    // Update bar
    fill.style.width = progress + '%';
    glow.style.left = progress + '%';
    pctEl.textContent = Math.floor(progress) + '%';

    // Update status label
    updateStatus(progress);

    // Fire log lines
    while (logPointer < LOG_LINES.length && progress >= LOG_LINES[logPointer].at) {
      addLine(LOG_LINES[logPointer]);
      logPointer++;
    }

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('done');
        startAnimations(); // ← your existing hook
      }, 400);
    }
  }, 90);
}

/* ─────────────────────────────────────
   3. CUSTOM CURSOR
───────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0; /* mouse position */
  let rx = 0, ry = 0; /* ring position  */

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    /* Dot follows instantly */
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  /* Ring follows with lerp (smooth lag) */
  function animateRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  /* Enlarge cursor on interactive elements */
  const interactives = document.querySelectorAll('a, button, .proj-card, .tag');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ─────────────────────────────────────
   4. MATRIX RAIN CANVAS
───────────────────────────────────── */
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const chars = '01アイウエオカキクケコサシスセソハヒフ'.split('');
  const fontSize = 13;
  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5,10,14,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff9d';
    ctx.font = fontSize + 'px JetBrains Mono';

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 55);
}

/* ─────────────────────────────────────
   5. TYPING ANIMATION
───────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const messages = DATA.typing;
  let mIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const msg = messages[mIdx];
    if (deleting) { cIdx--; } else { cIdx++; }
    el.textContent = msg.slice(0, cIdx);

    let delay = deleting ? 38 : 75;
    if (!deleting && cIdx === msg.length) { delay = 2200; deleting = true; }
    if (deleting && cIdx === 0) { deleting = false; mIdx = (mIdx + 1) % messages.length; delay = 500; }

    setTimeout(type, delay);
  }
  setTimeout(type, 900);
}

/* ─────────────────────────────────────
   6. NAVIGATION
   - Scrolled state for border
   - Active link highlight on scroll
   - Mobile hamburger
   - Scroll progress bar
───────────────────────────────────── */
function initNav() {
  const navbar = document.getElementById('navbar');
  const ham = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const scrollBar = document.getElementById('scroll-bar');
  const navLinks = document.querySelectorAll('.nav-link');

  /* Hamburger toggle */
  if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      ham.classList.toggle('open', isOpen);
      ham.setAttribute('aria-expanded', isOpen);
    });

    /* Close mobile menu on link click */
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll events */
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;

    /* Scroll progress bar */
    if (scrollBar) scrollBar.style.width = (scrollY / docH * 100) + '%';

    /* Navbar border after scrolling */
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 20);

    /* Active nav link */
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.sec === current);
    });

    /* Back-to-top visibility */
    const btt = document.getElementById('back-top');
    if (btt) btt.classList.toggle('visible', scrollY > 400);
  });
}

/* ─────────────────────────────────────
   7. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');

      /* Trigger skill bars inside revealed element */
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });

      /* Trigger stat counters inside revealed element */
      entry.target.querySelectorAll('.stat-n').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });

      observer.unobserve(entry.target); /* animate once */
    });
  }, { threshold: 0.14 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────
   8. RENDER SKILLS
───────────────────────────────────── */
function renderSkills() {
  /* ── Skill bars ── */
  const skillList = document.getElementById('skill-list');
  if (skillList) {
    DATA.skills.forEach(s => {
      skillList.innerHTML += `
        <div class="skill-row">
          <div class="skill-row-top">
            <span class="skill-name">${s.name}</span>
            <span class="skill-pct">${s.pct}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" data-pct="${s.pct}"></div>
          </div>
        </div>`;
    });
  }

  /* ── Tag clouds ── */
  const renderTags = (id, items, isCyan = false) => {
    const el = document.getElementById(id);
    if (!el) return;
    items.forEach(t => {
      el.innerHTML += `<span class="tag${isCyan ? ' cyan' : ''}">${t}</span>`;
    });
  };

  renderTags('tags-core', DATA.tagsCore);
  renderTags('tags-devops', DATA.tagsDevops, true);
  renderTags('tags-learning', DATA.tagsLearning, true);
}

/* ─────────────────────────────────────
   9. RENDER PROJECTS
───────────────────────────────────── */
function renderProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  DATA.projects.forEach((p, i) => {
    const delay = (i * 0.07).toFixed(2) + 's';
    const linksHTML = [
      p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="proj-link">GitHub →</a>` : '',
      p.demo ? `<a href="${p.demo}"   target="_blank" rel="noopener" class="proj-link" style="color:var(--cyan)">Live ↗</a>` : '',
    ].filter(Boolean).join('');

    grid.innerHTML += `
      <div class="proj-card reveal tilt-card" style="transition-delay:${delay}">
        <div class="proj-header">
          <span class="proj-type" style="color:${p.color};border-color:${p.color}33">${p.type}</span>
          <span class="proj-icon">${p.icon}</span>
        </div>
        <h3 class="proj-name">${p.name}</h3>
        <p class="proj-desc">${p.desc}</p>
        <div class="proj-tags">
          ${p.tech.map(t => `<span class="tag-xs">${t}</span>`).join('')}
        </div>
        <div class="proj-links">${linksHTML}</div>
      </div>`;
  });
}

/* ─────────────────────────────────────
   10. 3D TILT EFFECT (project cards)
───────────────────────────────────── */
function initTilt() {
  /* Run after cards are rendered */
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xRel = (e.clientX - rect.left) / rect.width - 0.5; /* -0.5 → 0.5 */
      const yRel = (e.clientY - rect.top) / rect.height - 0.5;
      const rotX = (yRel * -10).toFixed(2);   /* max ±5deg */
      const rotY = (xRel * 10).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

/* ─────────────────────────────────────
   11. MAGNETIC BUTTON EFFECT
───────────────────────────────────── */
function initMagnetic() {
  const buttons = document.querySelectorAll('.magnetic');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const xRel = e.clientX - rect.left - rect.width / 2;
      const yRel = e.clientY - rect.top - rect.height / 2;
      const pull = 0.3; /* magnetic strength */
      btn.style.transform = `translate(${xRel * pull}px, ${yRel * pull}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });
}

/* ─────────────────────────────────────
   12. COUNTER ANIMATION
───────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  let start = 0;
  const step = target / duration * 16; /* ~60fps */

  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start);
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────
   13. BACK TO TOP BUTTON
───────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─────────────────────────────────────
   14. FLOATING PARTICLES
───────────────────────────────────── */
function initParticles() {
  function spawn() {
    const p = document.createElement('div');
    Object.assign(p.style, {
      position: 'fixed',
      width: '2px',
      height: '2px',
      background: Math.random() > 0.5 ? '#00ff9d' : '#00d4ff',
      borderRadius: '50%',
      left: Math.random() * 100 + 'vw',
      bottom: '-4px',
      opacity: '0',
      pointerEvents: 'none',
      zIndex: '1',
      animation: `particleFloat ${10 + Math.random() * 14}s linear forwards`,
    });
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 24000);
  }

  /* Inject keyframes once */
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes particleFloat {
      0%   { transform: translateY(0)    translateX(0);    opacity: 0; }
      10%  { opacity: 0.55; }
      90%  { opacity: 0.25; }
      100% { transform: translateY(-105vh) translateX(${Math.random() > .5 ? '' : '-'}${Math.floor(Math.random() * 40 + 10)}px); opacity: 0; }
    }`;
  document.head.appendChild(styleTag);

  setInterval(spawn, 1400);
}

/* ─────────────────────────────────────
   15. JS-BASED ORBIT ANIMATION
   Pure JS orbit — reliable across all
   browsers, text always stays readable.
───────────────────────────────────── */
function initOrbit() {
  const root = document.querySelector('.orbit-root');
  if (!root) return;

  /* Remove old orbit ring children (tag spans inside rings) */
  root.querySelectorAll('.orbit-ring').forEach(r => r.remove());

  /* Orbit config: label, radius (px), speed (deg/s), start angle */
  const config = [
    /* core backend (inner = strongest identity) */
    { label: 'PHP', r: 150, spd: 20, a: 0 },
    { label: 'Laravel', r: 150, spd: 20, a: 90 },
    { label: 'MySQL', r: 150, spd: 20, a: 180 },
    { label: 'REST APIs', r: 150, spd: 20, a: 270 },

    /* tools + ecosystem (outer = practical skills) */
    { label: 'API Security', r: 200, spd: -14, a: 0 },
    { label: 'AJAX', r: 200, spd: -14, a: 72 },
    { label: 'JavaScript', r: 200, spd: -14, a: 144 },
    { label: 'Git & GitHub', r: 200, spd: -14, a: 216 },
    { label: 'Postman', r: 200, spd: -14, a: 288 },
  ];

  /* Add decorative ring borders back (no children) */
  ['r1', 'r2'].forEach(cls => {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring ' + cls;
    root.appendChild(ring);
  });

  /* Create tag elements positioned via JS */
  const tagEls = config.map(t => {
    const el = document.createElement('span');
    el.className = 'orbit-tag' + (t.r > 130 ? ' sm' : '');
    el.textContent = t.label;
    el.style.cssText = `
      position:absolute; top:50%; left:50%;
      pointer-events:none; white-space:nowrap;
    `;
    root.appendChild(el);
    return { el, ...t };
  });

  /* Animation loop */
  let last = null;
  function frame(ts) {
    if (last === null) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05); /* cap dt to prevent jump */
    last = ts;

    tagEls.forEach(t => {
      t.a = (t.a + t.spd * dt) % 360;
      const rad = t.a * Math.PI / 180;
      const x = Math.cos(rad) * t.r;
      const y = Math.sin(rad) * t.r;
      t.el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ─────────────────────────────────────
   16. BOOT SEQUENCE
   startAnimations() is called by preloader
   after it finishes.
───────────────────────────────────── */

function startAnimations() {
  initCursor();
  initMatrix();
  initTyping();
  initNav();
  initReveal();
  initBackToTop();
  initParticles();
  initOrbit();

  // NOTE: renderProjects() is removed because projects are now in HTML

  /* Wait one tick so DOM is painted before attaching tilt/magnetic */
  requestAnimationFrame(() => {
    initTilt();
    initMagnetic();
  });
}

/* ─────────────────────────────────────
   17. ENTRY POINT
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('preloader');

  // If preloader exists in HTML, run it. Otherwise, directly start animations!
  if (loader) {
    initPreloader();
  } else {
    startAnimations();
  }
});