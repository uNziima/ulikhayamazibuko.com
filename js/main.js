    // ============================================
    // NAVIGATION — scroll state + mobile menu
    // ============================================

    const navWrapper  = document.getElementById('top').closest ? 
                        document.querySelector('.nav-wrapper') : 
                        document.querySelector('.nav-wrapper');
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');

    // Scroll state — adds blur/opacity on scroll
    window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navWrapper.classList.add('scrolled');
    } else {
        navWrapper.classList.remove('scrolled');
    }
    });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });
    });