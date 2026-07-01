// ===== Typewriter Effect =====
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = JSON.parse(el.dataset.phrases || '[]');
  if (!phrases.length) return;

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 80;
  const deleteSpeed = 40;
  const pauseBetween = 2000;

  function tick() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === current.length) {
      setTimeout(() => { isDeleting = true; tick(); }, pauseBetween);
      return;
    }

    if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(tick, 400);
      return;
    }

    setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
  }

  tick();
})();

// ===== Scroll Reveal =====
(function () {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ===== Mobile Hamburger Menu =====
(function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a nav link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ===== Back to Top Button =====
(function () {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== Giscus 留言系统 =====
(function () {
  const container = document.getElementById('giscus-container');
  if (!container) return;

  function getGiscusTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return 'dark';
    if (saved === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function loadGiscus(theme) {
    // Remove existing iframe
    const existing = container.querySelector('iframe.giscus-frame');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'EricYXZ/EricYXZ.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOTJfLng');
    script.setAttribute('data-category', 'Guestbook');
    script.setAttribute('data-category-id', 'DIC_kwDOTJfLns4DARSG');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);
  }

  // Initial load
  loadGiscus(getGiscusTheme());

  // Expose reload function for theme toggle
  window.reloadGiscus = function (theme) {
    loadGiscus(theme);
  };
})();

// ===== Theme Toggle =====
(function () {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const html = document.documentElement;
  const iconSun = toggle.querySelector('.icon-sun');
  const iconMoon = toggle.querySelector('.icon-moon');

  // Load saved preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  }
  updateIcon();

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon();

    // Reload Giscus with new theme
    if (typeof window.reloadGiscus === 'function') {
      window.reloadGiscus(next);
    }
  });

  function updateIcon() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (iconSun) iconSun.style.display = isDark ? 'none' : '';
    if (iconMoon) iconMoon.style.display = isDark ? '' : 'none';
  }
})();

// ===== Hero Particle Canvas =====
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;
  const maxParticles = 50;

  function resize() {
    const header = canvas.parentElement;
    canvas.width = header.offsetWidth;
    canvas.height = header.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.5 + 0.15,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();
