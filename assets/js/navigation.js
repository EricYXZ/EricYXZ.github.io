(() => {
  if (window.__siteNavigationReady) return;
  window.__siteNavigationReady = true;

  const routes = new Set([
    '/', '/cv/', '/projects/', '/publications/', '/gallery/',
    '/en/', '/en/cv/', '/en/projects/', '/en/publications/', '/en/gallery/'
  ]);
  const scriptCache = new Map();
  let navigationToken = 0;

  const normalizePath = path => path.endsWith('/') ? path : `${path}/`;
  const isSitePage = url => url.origin === location.origin && routes.has(normalizePath(url.pathname));

  async function runPageScript(src) {
    const url = new URL(src, location.origin);
    if (!/\/(main|gallery|details)\.js$/.test(url.pathname)) return;
    let source = scriptCache.get(url.pathname);
    if (!source) {
      const response = await fetch(url.href, {credentials:'same-origin'});
      if (!response.ok) throw new Error(`Unable to load ${url.pathname}`);
      source = await response.text();
      scriptCache.set(url.pathname, source);
    }
    Function(`${source}\n//# sourceURL=${url.href}`)();
  }

  function syncHead(nextDocument) {
    document.title = nextDocument.title;
    ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:url"]','link[rel="canonical"]'].forEach(selector => {
      const current = document.head.querySelector(selector);
      const next = nextDocument.head.querySelector(selector);
      if (current && next) {
        if (current.tagName === 'LINK') current.href = next.href;
        else current.content = next.content;
      }
    });
  }

  async function navigate(url, {push=true}={}) {
    const token = ++navigationToken;
    document.documentElement.setAttribute('aria-busy','true');
    try {
      const response = await fetch(url.href, {credentials:'same-origin'});
      if (!response.ok) throw new Error(`Navigation failed: ${response.status}`);
      const html = await response.text();
      if (token !== navigationToken) return;
      const nextDocument = new DOMParser().parseFromString(html,'text/html');
      const player = document.querySelector('.music-player');
      const scripts = [...nextDocument.body.querySelectorAll('script[src]')]
        .map(script => script.getAttribute('src'))
        .filter(Boolean);

      syncHead(nextDocument);
      document.documentElement.lang = nextDocument.documentElement.lang;
      document.body.className = nextDocument.body.className;
      [...document.body.children].forEach(child => { if (child !== player) child.remove(); });
      [...nextDocument.body.children].forEach(child => {
        if (child.tagName !== 'SCRIPT') document.body.insertBefore(document.importNode(child,true),player);
      });

      if (push) history.pushState({siteNavigation:true},'',url.href);
      scrollTo({top:0,left:0,behavior:'instant'});
      for (const src of scripts) await runPageScript(src);
      document.dispatchEvent(new CustomEvent('site:navigation',{detail:{url:url.href}}));
    } catch (error) {
      if (token === navigationToken) location.href = url.href;
    } finally {
      if (token === navigationToken) document.documentElement.removeAttribute('aria-busy');
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || link.target || link.getAttribute('rel') === 'external') return;
    const url = new URL(link.href,location.href);
    if (!isSitePage(url)) return;
    event.preventDefault();
    if (url.pathname === location.pathname && url.search === location.search) {
      scrollTo({top:0,behavior:'smooth'});
      return;
    }
    navigate(url);
  });

  document.addEventListener('pointerover', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href,location.href);
    if (isSitePage(url)) fetch(url.href,{credentials:'same-origin'}).catch(()=>{});
  },{passive:true});

  addEventListener('popstate', () => navigate(new URL(location.href),{push:false}));
})();
