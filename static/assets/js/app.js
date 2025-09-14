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
});
