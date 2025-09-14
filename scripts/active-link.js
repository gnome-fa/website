(function(){
    try {
        const rawPath = location.pathname || '/';
        const path = rawPath.replace(/\/+$|^\s+|\s+$/g, '') || '/';
        const links = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-links .nav-link');
        links.forEach(a=>{
            const href = a.getAttribute('href') || '';
            let target = href;
            if (href === '#' || href === '#home') target = '/';
            // Normalize to remove trailing slash except for root
            if (target.startsWith('/')) target = (target.replace(/\/+$/, '') || '/');
            // Mark active when path equals target or starts with it (for section pages)
            if (target === '/') {
                if (path === '/') a.classList.add('active'); else a.classList.remove('active');
            } else {
                if (path === target || path.startsWith(target + '/')) a.classList.add('active'); else a.classList.remove('active');
            }
        });
    } catch (e) {
        // fail silently
    }
})();