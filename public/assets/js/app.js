// ساده‌ترین کتابخانه رندر مارک‌داون
class SimpleMarkdown {
  static parse(text) {
    let html = text;
    
    // هدرها
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    
    // بولد و ایتالیک
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // لینک‌ها
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // کد
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // بلوک کد
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // لیست‌ها
    html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    
    // لیست‌های عددی
    html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
    
    // پاراگراف‌ها
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // تمیز کردن خطوط اضافی
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-6]>)/g, '$1');
    html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    html = html.replace(/<p>(<ul>)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p>(<pre>)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    
    return html;
  }
  
  static parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (!match) {
      return { frontMatter: {}, content: content };
    }
    
    const frontMatterText = match[1];
    const bodyContent = match[2];
    const frontMatter = {};
    
    // پارس ساده YAML
    frontMatterText.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > -1) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        frontMatter[key] = value;
      }
    });
    
    return { frontMatter, content: bodyContent };
  }
}

// توابع کمکی برای کار با داده‌ها
class DataLoader {
  static async loadJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('خطا در بارگذاری داده:', error);
      return null;
    }
  }
  
  static async loadMarkdown(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      return SimpleMarkdown.parseFrontMatter(content);
    } catch (error) {
      console.error('خطا در بارگذاری مارک‌داون:', error);
      return null;
    }
  }
}

// تبدیل تاریخ میلادی به شمسی (ساده)
class PersianDate {
  static toJalali(date) {
    const gDate = new Date(date);
    const year = gDate.getFullYear();
    const month = gDate.getMonth() + 1;
    const day = gDate.getDate();
    
    // تبدیل ساده - در پروژه واقعی از کتابخانه‌ای مثل moment-jalaali استفاده کنید
    const persianMonths = [
      'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
      'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];
    
    // تبدیل تقریبی برای نمایش
    let jYear = year - 621;
    let jMonth = month;
    let jDay = day;
    
    if (month > 3) {
      jMonth = month - 3;
    } else {
      jMonth = month + 9;
      jYear--;
    }
    
    return `${jDay} ${persianMonths[jMonth - 1]} ${jYear}`;
  }
  
  static toFarsiNumbers(str) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.toString().replace(/[0-9]/g, (w) => farsiDigits[+w]);
  }
}

// Alpine.js data objects
window.alpineData = {
  // منوی موبایل
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
  
  // سوئیچ تیره/روشن
  themeToggle() {
    return {
      isDark: localStorage.getItem('theme') === 'dark',
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
  
  // جستجو در مقالات
  articlesSearch() {
    return {
      articles: [],
      searchQuery: '',
      selectedTag: '',
      loading: true,
      
      async init() {
        await this.loadArticles();
      },
      
      async loadArticles() {
        this.loading = true;
        const data = await DataLoader.loadJSON('./posts/index.json');
        if (data) {
          this.articles = data.map(article => ({
            ...article,
            persianDate: PersianDate.toJalali(article.date),
            visible: true
          }));
        }
        this.loading = false;
        this.filterArticles();
      },
      
      filterArticles() {
        this.articles.forEach(article => {
          const matchesSearch = !this.searchQuery || 
            article.title.includes(this.searchQuery) || 
            article.excerpt.includes(this.searchQuery);
          
          const matchesTag = !this.selectedTag || 
            (article.tags && article.tags.includes(this.selectedTag));
          
          article.visible = matchesSearch && matchesTag;
        });
      },
      
      selectTag(tag) {
        this.selectedTag = this.selectedTag === tag ? '' : tag;
        this.filterArticles();
      },
      
      get visibleArticles() {
        return this.articles.filter(article => article.visible);
      },
      
      get allTags() {
        const tags = new Set();
        this.articles.forEach(article => {
          if (article.tags) {
            article.tags.forEach(tag => tags.add(tag));
          }
        });
        return Array.from(tags);
      }
    };
  },
  
  // جستجو در ارائه‌ها
  talksSearch() {
    return {
      talks: [],
      searchQuery: '',
      selectedYear: '',
      selectedSpeaker: '',
      loading: true,
      
      async init() {
        await this.loadTalks();
      },
      
      async loadTalks() {
        this.loading = true;
        const data = await DataLoader.loadJSON('./data/talks.json');
        if (data) {
          this.talks = data.map(talk => ({
            ...talk,
            persianDate: PersianDate.toJalali(talk.date),
            year: new Date(talk.date).getFullYear(),
            visible: true
          }));
        }
        this.loading = false;
        this.filterTalks();
      },
      
      filterTalks() {
        this.talks.forEach(talk => {
          const matchesSearch = !this.searchQuery || 
            talk.title.includes(this.searchQuery) || 
            talk.description.includes(this.searchQuery) ||
            talk.speaker.includes(this.searchQuery);
          
          const matchesYear = !this.selectedYear || 
            talk.year.toString() === this.selectedYear;
          
          const matchesSpeaker = !this.selectedSpeaker || 
            talk.speaker === this.selectedSpeaker;
          
          talk.visible = matchesSearch && matchesYear && matchesSpeaker;
        });
      },
      
      selectYear(year) {
        this.selectedYear = this.selectedYear === year ? '' : year;
        this.filterTalks();
      },
      
      selectSpeaker(speaker) {
        this.selectedSpeaker = this.selectedSpeaker === speaker ? '' : speaker;
        this.filterTalks();
      },
      
      get visibleTalks() {
        return this.talks.filter(talk => talk.visible);
      },
      
      get allYears() {
        const years = new Set();
        this.talks.forEach(talk => {
          years.add(talk.year);
        });
        return Array.from(years).sort((a, b) => b - a);
      },
      
      get allSpeakers() {
        const speakers = new Set();
        this.talks.forEach(talk => {
          speakers.add(talk.speaker);
        });
        return Array.from(speakers).sort();
      }
    };
  },
  
  // مقاله تکی
  singleArticle() {
    return {
      article: null,
      content: '',
      loading: true,
      error: false,
      
      async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (slug) {
          await this.loadArticle(slug);
        } else {
          this.error = true;
          this.loading = false;
        }
      },
      
      async loadArticle(slug) {
        this.loading = true;
        
        // بارگذاری اطلاعات مقاله
        const articlesData = await DataLoader.loadJSON('./posts/index.json');
        if (articlesData) {
          this.article = articlesData.find(article => article.slug === slug);
        }
        
        // بارگذاری محتوای مقاله
        const markdownData = await DataLoader.loadMarkdown(`./posts/${slug}.md`);
        if (markdownData) {
          this.content = SimpleMarkdown.parse(markdownData.content);
          
          // اگر اطلاعات مقاله از فایل بارگذاری نشده، از front matter استفاده کن
          if (!this.article && markdownData.frontMatter) {
            this.article = {
              ...markdownData.frontMatter,
              slug: slug
            };
          }
          
          if (this.article) {
            this.article.persianDate = PersianDate.toJalali(this.article.date);
            
            // تنظیم عنوان صفحه
            document.title = `${this.article.title} - گنوم فارسی`;
          }
        } else {
          this.error = true;
        }
        
        this.loading = false;
      }
    };
  },
  
  // داده‌های صفحه اصلی
  homepage() {
    return {
      contributors: [],
      recentArticles: [],
      featuredTalks: [],
      loading: true,
      
      async init() {
        await this.loadData();
      },
      
      async loadData() {
        this.loading = true;
        
        // بارگذاری مشارکت‌کنندگان
        const contributorsData = await DataLoader.loadJSON('./data/contributors.json');
        if (contributorsData) {
          this.contributors = contributorsData;
        }
        
        // بارگذاری مقالات اخیر
        const articlesData = await DataLoader.loadJSON('./posts/index.json');
        if (articlesData) {
          this.recentArticles = articlesData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map(article => ({
              ...article,
              persianDate: PersianDate.toJalali(article.date)
            }));
        }
        
        // بارگذاری ارائه‌های منتخب
        const talksData = await DataLoader.loadJSON('./data/talks.json');
        if (talksData) {
          this.featuredTalks = talksData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map(talk => ({
              ...talk,
              persianDate: PersianDate.toJalali(talk.date)
            }));
        }
        
        this.loading = false;
      }
    };
  }
};

// تنظیمات اولیه
document.addEventListener('DOMContentLoaded', function() {
  // اسکرول نرم
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
  
  // انیمیشن ورود المان‌ها
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
  
  // مشاهده کارت‌ها و بخش‌ها برای انیمیشن
  document.querySelectorAll('.card, .section').forEach(el => {
    observer.observe(el);
  });
});

// تابع کمکی برای ایجاد URL صفحه مقاله
function getArticleUrl(slug) {
  return `article.html?slug=${slug}`;
}

// تابع کمکی برای اعداد فارسی
function toFarsiNumber(num) {
  return PersianDate.toFarsiNumbers(num);
}