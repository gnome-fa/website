// Alpine.js data objects
window.alpineData = {
  // Mobile menu
  mobileMenu() {
    return {
      open: false,
      toggle() {
        this.open = !this.open;
      },
      close() {
        this.open = false;
      }
    };
  },
  
  // Dark/light mode switch
  themeToggle() {
    return {
      isDark: (localStorage.getItem('theme') !== null) ? (localStorage.getItem('theme') === 'dark') : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
      init() {
        this.updateTheme();
      },
      toggle() {
        this.isDark = !this.isDark;
        this.updateTheme();
      },
      updateTheme() {
        if (this.isDark) {
          document.documentElement.classList.add('theme-dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('theme-dark');
          localStorage.setItem('theme', 'light');
        }
      }
    };
  },
  
  // Homepage state (placeholder to avoid runtime errors)
  homepage() {
    return {
      loading: false,
      init() {
        this.loading = false;
      }
    };
  },
  
  // Articles page state (basic scaffold for future filters/search)
  articlesSearch() {
    return {
      loading: false,
      searchQuery: '',
      selectedTag: '',
      visibleArticles: [],
      init() {
        this.loading = false;
      },
      selectTag(tag) {
        this.selectedTag = tag;
      },
      filterArticles() {
        // SSR renders the list; this is a placeholder for client filtering
      }
    };
  },
};

// Basic settings
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Element entrance animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards and sections for animations
  document.querySelectorAll('.card, .section').forEach(el => {
    observer.observe(el);
  });
  
  // Active link highlighting (Was separate idk why)
  try {
    const rawPath = location.pathname || '/';
    const path = rawPath.replace(/\/+$/g, '') || '/';
    const links = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-links .nav-link');
    links.forEach(anchor => {
      const href = anchor.getAttribute('href') || '';
      let target = href;
      if (href === '#' || href === '#home') target = '/';
      if (target.startsWith('/')) target = (target.replace(/\/+$/, '') || '/');
      if (target === '/') {
        if (path === '/') anchor.classList.add('active'); else anchor.classList.remove('active');
      } else {
        if (path === target || path.startsWith(target + '/')) anchor.classList.add('active'); else anchor.classList.remove('active');
      }
    });
  } catch (_) {

  }

  // Collapsible code blocks + toolbar (language + copy)
  try {
    const MAX_HEIGHT = 340;
    const languageColor = (lang) => {
      switch ((lang || '').toLowerCase()) {
        case 'js':
        case 'javascript': return 'var(--brand-orange)';
        case 'ts':
        case 'typescript': return 'var(--brand-primary)';
        case 'bash':
        case 'sh':
        case 'shell': return 'var(--brand-green)';
        case 'json': return 'var(--brand-green)';
        case 'xml': return 'var(--brand-purple, var(--brand-secondary))';
        case 'css': return 'var(--brand-green)';
        case 'html': return 'var(--brand-orange)';
        default: return 'currentColor';
      }
    };

    const detectLanguage = (pre) => {
      const attrLang = pre.getAttribute('data-language') || pre.getAttribute('data-lang') || pre.getAttribute('lang');
      if (attrLang) return attrLang;
      const preCls = Array.from(pre.classList);
      const preLang = preCls.find(c => c.startsWith('language-') || c.startsWith('lang-'));
      if (preLang) return preLang.replace(/^language-|^lang-/, '');
      const descendant = pre.querySelector('[class^="language-"], [class^="lang-"]');
      if (descendant) {
        const cls = Array.from(descendant.classList).find(c => c.startsWith('language-') || c.startsWith('lang-'));
        if (cls) return cls.replace(/^language-|^lang-/, '');
      }
      return '';
    };

    document.querySelectorAll('.content pre').forEach(pre => {
      let wrapper = pre.parentElement;
      if (!wrapper || !wrapper.classList.contains('code-block')) {
        wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        const parent = pre.parentElement;
        parent.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
      }

      if (!pre.querySelector('.code-toolbar')) {
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';

        const lang = detectLanguage(pre);
        if (lang) {
          const langBadge = document.createElement('span');
          langBadge.className = 'code-lang';
          langBadge.textContent = String(lang).toUpperCase();
          langBadge.style.color = languageColor(lang);
          toolbar.appendChild(langBadge);
        }

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'code-copy';
        const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        copyIcon.setAttribute('viewBox', '0 0 24 24');
        copyIcon.innerHTML = '<path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>';
        copyBtn.appendChild(copyIcon);

        copyBtn.addEventListener('click', async () => {
          try {
            const text = pre.innerText || '';
            await navigator.clipboard.writeText(text);
            const old = copyBtn.innerHTML;
            const checkIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            checkIcon.setAttribute('viewBox', '0 0 24 24');
            checkIcon.innerHTML = '<path d="M9 16.17l-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41z"/>';
            copyBtn.innerHTML = '';
            copyBtn.appendChild(checkIcon);
            setTimeout(() => (copyBtn.innerHTML = old), 1200);
          } catch (_) {}
        });

        toolbar.appendChild(copyBtn);
        pre.appendChild(toolbar);
      }

      const isLong = pre.scrollHeight > MAX_HEIGHT + 40;
      if (isLong && !pre.querySelector('.code-fade')) {
        wrapper.classList.add('collapsed');

        const fade = document.createElement('div');
        fade.className = 'code-fade';
        const bg = getComputedStyle(pre).backgroundColor || 'var(--bg-muted)';
        fade.style.background = `linear-gradient(to bottom, rgba(0,0,0,0), ${bg})`;
        pre.appendChild(fade);

        const toggle = document.createElement('span');
        toggle.className = 'code-toggle';
        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'نمایش بیشتر';
        pre.appendChild(toggle);

        const toggleAction = () => {
          const collapsed = wrapper.classList.toggle('collapsed');
          toggle.setAttribute('aria-expanded', (!collapsed).toString());
          toggle.textContent = collapsed ? 'نمایش بیشتر' : 'نمایش کمتر';
        };
        toggle.addEventListener('click', toggleAction);
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleAction();
          }
        });
      }
    });
  } catch (_) {}
});
