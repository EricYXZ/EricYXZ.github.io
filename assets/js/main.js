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
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.textContent = '↑';
    document.body.appendChild(btn);
  }

  btn.type = 'button';
  if (!btn.hasAttribute('aria-label')) {
    btn.setAttribute(
      'aria-label',
      document.documentElement.lang.toLowerCase().startsWith('en') ? 'Back to top' : '回到顶部'
    );
  }

  const toggle = () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggle();
})();

// ===== Page Scroll Progress =====
(function () {
  const navigation = document.querySelector('.nav-wrap');
  if (!navigation) return;

  const progress = document.createElement('span');
  progress.className = 'page-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  navigation.appendChild(progress);

  let frameId = 0;
  const update = () => {
    frameId = 0;
    const root = document.documentElement;
    const scrollable = Math.max(0, root.scrollHeight - root.clientHeight);
    const ratio = scrollable ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    progress.style.transform = `scaleX(${ratio})`;
  };

  const scheduleUpdate = () => {
    if (!frameId) frameId = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleUpdate).observe(document.body);
  }
  update();
})();

// ===== Giscus 留言系统 =====
(function () {
  const container = document.getElementById('giscus-container');
  if (!container) return;

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function getGiscusTheme(theme) {
    const fileName = theme === 'dark' ? 'giscus-dark.css' : 'giscus-light.css';
    return `https://ericyxz.github.io/assets/css/${fileName}?v=20260926-b1`;
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
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', getGiscusTheme(theme));
    const pageLanguage = document.documentElement.lang || 'zh-CN';
    script.setAttribute('data-lang', pageLanguage.startsWith('en') ? 'en' : 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    container.appendChild(script);
  }

  // Initial load
  loadGiscus(getActiveTheme());

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

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let transitionTimer = 0;
  let explicitTheme = false;
  try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('theme')); } catch (_) {}
  updateIcon();

  function applyTheme(theme) {
    if (!reduceMotion.matches) {
      clearTimeout(transitionTimer);
      html.classList.add('theme-transition');
      // Commit the transition rules before changing the theme variables.
      void html.offsetWidth;
      transitionTimer = window.setTimeout(() => {
        html.classList.remove('theme-transition');
      }, 420);
    }
    html.setAttribute('data-theme', theme);
    updateIcon();
    if (typeof window.reloadGiscus === 'function') window.reloadGiscus(theme);
  }

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    explicitTheme = true;
    try { localStorage.setItem('theme', next); } catch (_) {}
    applyTheme(next);
  });

  systemTheme.addEventListener('change', (event) => {
    if (!explicitTheme) applyTheme(event.matches ? 'dark' : 'light');
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
  if (!canvas || getComputedStyle(canvas).display === 'none') return;

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

// ===== Lightbox =====
(function () {
  const photos = document.querySelectorAll('.photo-card');
  if (!photos.length) return;

  // Build lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="关闭">✕</button>
    <button class="lightbox-prev" aria-label="上一张">‹</button>
    <button class="lightbox-next" aria-label="下一张">›</button>
    <img src="" alt="">
    <div class="lightbox-counter"></div>
    <div class="lightbox-caption"></div>
  `;
  document.body.appendChild(lb);

  const img = lb.querySelector('img');
  const caption = lb.querySelector('.lightbox-caption');
  const counter = lb.querySelector('.lightbox-counter');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');

  let currentIdx = 0;
  const items = [];

  photos.forEach((card, i) => {
    const el = card.querySelector('img');
    const strong = card.querySelector('strong');
    const span = card.querySelector('figcaption span');
    if (!el) return;
    items.push({
      src: el.src,
      alt: el.alt || '',
      caption: strong ? strong.textContent : '',
      date: span ? span.textContent : ''
    });
    card.addEventListener('click', () => open(i));
  });

  function open(idx) {
    if (idx < 0 || idx >= items.length) return;
    currentIdx = idx;
    const item = items[idx];
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption + (item.date ? ' · ' + item.date : '');
    counter.textContent = (idx + 1) + ' / ' + items.length;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    prevBtn.style.display = items.length > 1 ? '' : 'none';
    nextBtn.style.display = items.length > 1 ? '' : 'none';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() {
    const idx = currentIdx > 0 ? currentIdx - 1 : items.length - 1;
    open(idx);
  }

  function next() {
    const idx = currentIdx < items.length - 1 ? currentIdx + 1 : 0;
    open(idx);
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // Update photo count
  const countEl = document.getElementById('photo-count');
  if (countEl) {
    const isEnglish = (document.documentElement.lang || '').startsWith('en');
    countEl.textContent = isEnglish
      ? `${items.length} ${items.length === 1 ? 'photo' : 'photos'}`
      : items.length + ' 张';
  }
})();

// ===== Momentum scrolling for compact homepage sections =====
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const normalizeWheelDelta = (event, element) => {
    const rawDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
    if (event.deltaMode === 1) return rawDelta * 16;
    if (event.deltaMode === 2) return rawDelta * element.clientHeight;
    return rawDelta;
  };

  const addMomentumScroller = ({ element, axis, getLoopSize, getStepSize, elastic }) => {
    if (!element) return;

    let velocity = 0;
    let animationFrame = 0;
    let wheelAccumulator = 0;
    let wheelResetTimer = 0;
    let overscroll = 0;
    let overscrollVelocity = 0;
    let bounceFrame = 0;
    const friction = 0.94;
    const wheelThreshold = 80;
    const maxVelocity = 48;
    const maxOverscroll = 64;
    const positionKey = axis === 'x' ? 'scrollLeft' : 'scrollTop';

    const renderOverscroll = () => {
      if (!elastic) return;
      element.style.setProperty('--honors-overscroll', `${overscroll.toFixed(2)}px`);
    };

    const animateBounce = () => {
      overscrollVelocity += -overscroll * 0.012;
      overscrollVelocity *= 0.78;
      overscroll += overscrollVelocity;
      overscroll = Math.max(-maxOverscroll, Math.min(maxOverscroll, overscroll));
      renderOverscroll();

      if (Math.abs(overscroll) < 0.08 && Math.abs(overscrollVelocity) < 0.08) {
        overscroll = 0;
        overscrollVelocity = 0;
        renderOverscroll();
        bounceFrame = 0;
        return;
      }
      bounceFrame = requestAnimationFrame(animateBounce);
    };

    const kickBounce = (delta) => {
      if (!elastic || reduceMotion) return;
      const projectedStretch = Math.abs(overscroll) + Math.abs(overscrollVelocity) * 1.6;
      const rubberBandResistance = Math.max(0.24, 1 - projectedStretch / maxOverscroll);
      const impulse = Math.max(-20, Math.min(20, -delta * 0.17));
      overscrollVelocity += impulse * rubberBandResistance;
      if (!bounceFrame) bounceFrame = requestAnimationFrame(animateBounce);
    };

    const stop = () => {
      velocity = 0;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const setPosition = (next) => {
      const loopSize = getLoopSize ? getLoopSize() : 0;
      if (loopSize > 0) {
        while (next >= loopSize) next -= loopSize;
        while (next < 0) next += loopSize;
      } else {
        const maxPosition = axis === 'x'
          ? element.scrollWidth - element.clientWidth
          : element.scrollHeight - element.clientHeight;
        next = Math.max(0, Math.min(maxPosition, next));
      }
      element[positionKey] = next;
      return next;
    };

    const animate = () => {
      const current = element[positionKey];
      const next = setPosition(current + velocity);
      const maxPosition = axis === 'x'
        ? element.scrollWidth - element.clientWidth
        : element.scrollHeight - element.clientHeight;
      const hitBoundary = !getLoopSize && (
        (next <= 0 && velocity < 0) ||
        (next >= maxPosition - 1 && velocity > 0)
      );
      velocity *= friction;

      if (hitBoundary || Math.abs(velocity) < 0.08) {
        if (hitBoundary) kickBounce(velocity * 12);
        stop();
        return;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const push = (distance) => {
      if (reduceMotion) {
        setPosition(element[positionKey] + distance);
        return;
      }
      const initialVelocity = distance * (1 - friction);
      velocity = Math.max(-maxVelocity, Math.min(maxVelocity, velocity + initialVelocity));
      if (!animationFrame) animationFrame = requestAnimationFrame(animate);
    };

    element.addEventListener('wheel', (event) => {
      const delta = normalizeWheelDelta(event, element);
      if (!delta) return;

      if (!getLoopSize) {
        const maxPosition = axis === 'x'
          ? element.scrollWidth - element.clientWidth
          : element.scrollHeight - element.clientHeight;
        const atStart = element[positionKey] <= 0 && delta < 0;
        const atEnd = element[positionKey] >= maxPosition - 1 && delta > 0;
        if (atStart || atEnd) {
          stop();
          if (elastic && !reduceMotion) {
            event.preventDefault();
            kickBounce(delta);
          }
          return;
        }
      }

      event.preventDefault();
      clearTimeout(wheelResetTimer);
      wheelResetTimer = setTimeout(() => { wheelAccumulator = 0; }, 140);

      let direction = Math.sign(delta);
      let steps = 0;
      if (Math.abs(delta) >= wheelThreshold) {
        steps = Math.max(1, Math.round(Math.abs(delta) / 120));
        wheelAccumulator = 0;
      } else {
        wheelAccumulator += delta;
        steps = Math.trunc(Math.abs(wheelAccumulator) / wheelThreshold);
        if (!steps) return;
        direction = Math.sign(wheelAccumulator);
        wheelAccumulator -= direction * steps * wheelThreshold;
      }

      const stepSize = getStepSize ? getStepSize() : 120;
      push(direction * stepSize * Math.min(steps, 3));
    }, { passive: false });

    element.addEventListener('keydown', (event) => {
      const backward = axis === 'x' ? event.key === 'ArrowLeft' : event.key === 'ArrowUp';
      const forward = axis === 'x' ? event.key === 'ArrowRight' : event.key === 'ArrowDown';
      if (!backward && !forward) return;
      event.preventDefault();
      const stepSize = getStepSize ? getStepSize() : 120;
      push(backward ? -stepSize : stepSize);
    });
  };

  document.querySelectorAll('.academic-home-content .home-honors-list, .cv-page .cv-honors-list').forEach((list) => {
    if (!list.hasAttribute('tabindex')) list.tabIndex = 0;
    addMomentumScroller({
      element: list,
      axis: 'y',
      elastic: true,
      getStepSize: () => list.children.length ? list.scrollHeight / list.children.length : 54
    });
  });

  document.querySelectorAll('.snapshot-marquee').forEach((marquee) => {
    const track = marquee.querySelector('.snapshot-track');
    const cards = track ? track.querySelectorAll('.snapshot-card') : [];
    if (!track || cards.length < 2) return;

    addMomentumScroller({
      element: marquee,
      axis: 'x',
      getStepSize: () => {
        const itemCount = Math.floor(cards.length / 2);
        const firstClone = cards[itemCount];
        const cycleWidth = firstClone ? firstClone.offsetLeft - cards[0].offsetLeft : 0;
        return itemCount && cycleWidth ? cycleWidth / itemCount : 240;
      },
      getLoopSize: () => {
        const firstClone = cards[Math.floor(cards.length / 2)];
        return firstClone ? firstClone.offsetLeft - cards[0].offsetLeft : 0;
      }
    });
  });
})();
