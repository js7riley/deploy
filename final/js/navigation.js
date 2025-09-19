/* IBM Z OMEGAMON AI Technical Documentation - Navigation Logic */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section-content');

    // Mobile menu toggle
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Update button icon
            const icon = mobileMenuButton.querySelector('svg path');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        });
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    const icon = mobileMenuButton.querySelector('svg path');
                    icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                }
                
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation
                updateActiveNavigation(targetId);
            }
        });
    });

    // Update active navigation based on scroll position
    function updateActiveNavigation(activeId = null) {
        if (activeId) {
            // Manual update when clicking navigation
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === activeId) {
                    link.classList.add('active');
                }
            });
        } else {
            // Automatic update based on scroll position
            let currentSection = '';
            const scrollPosition = window.scrollY + 200; // Offset for header

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = '#' + section.id;
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Scroll spy functionality
    let ticking = false;
    
    function updateScrollSpy() {
        updateActiveNavigation();
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollSpy);
            ticking = true;
        }
    });

    // Breadcrumb navigation
    function updateBreadcrumb() {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) return;

        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            const sectionName = activeLink.textContent.trim();
            breadcrumb.innerHTML = `
                <a href="#overview" class="text-blue-600 hover:text-blue-800">Home</a>
                <span class="mx-2 text-gray-400">/</span>
                <span class="text-gray-600">${sectionName}</span>
            `;
        }
    }

    // Quick jump menu functionality
    function createQuickJumpMenu() {
        const quickJump = document.createElement('div');
        quickJump.className = 'fixed bottom-6 right-6 z-40';
        quickJump.innerHTML = `
            <div class="relative">
                <button id="quick-jump-btn" class="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
                    </svg>
                </button>
                <div id="quick-jump-menu" class="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48 hidden">
                    <div class="p-2">
                        <a href="#overview" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Overview</a>
                        <a href="#implementation" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Implementation</a>
                        <a href="#configuration" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Configuration</a>
                        <a href="#virtual-cics" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Virtual CICS</a>
                        <a href="#monitoring" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Monitoring</a>
                        <a href="#security" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Security</a>
                        <a href="#resources" class="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">Resources</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(quickJump);

        // Quick jump menu toggle
        const quickJumpBtn = document.getElementById('quick-jump-btn');
        const quickJumpMenu = document.getElementById('quick-jump-menu');

        quickJumpBtn.addEventListener('click', function() {
            quickJumpMenu.classList.toggle('hidden');
        });

        // Close quick jump menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!quickJump.contains(e.target)) {
                quickJumpMenu.classList.add('hidden');
            }
        });

        // Handle quick jump menu links
        quickJumpMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    updateActiveNavigation(targetId);
                    quickJumpMenu.classList.add('hidden');
                }
            });
        });
    }

    // Back to top functionality
    function createBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.className = 'fixed bottom-6 left-6 bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 opacity-0 invisible z-40';
        backToTop.innerHTML = `
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        `;

        document.body.appendChild(backToTop);

        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.remove('opacity-0', 'invisible');
                backToTop.classList.add('opacity-100', 'visible');
            } else {
                backToTop.classList.add('opacity-0', 'invisible');
                backToTop.classList.remove('opacity-100', 'visible');
            }
        });

        // Back to top click handler
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Progress indicator for reading progress
    function createProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Section visibility animation
    function initSectionAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Keyboard navigation
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Alt + number keys for quick section navigation
            if (e.altKey && e.key >= '1' && e.key <= '7') {
                e.preventDefault();
                const sectionIndex = parseInt(e.key) - 1;
                const sectionIds = ['#overview', '#implementation', '#configuration', '#virtual-cics', '#monitoring', '#security', '#resources'];
                
                if (sectionIds[sectionIndex]) {
                    const targetSection = document.querySelector(sectionIds[sectionIndex]);
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        updateActiveNavigation(sectionIds[sectionIndex]);
                    }
                }
            }

            // Escape key to close mobile menu
            if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('svg path');
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });
    }

    // Initialize all navigation features
    function init() {
        createQuickJumpMenu();
        createBackToTop();
        createProgressIndicator();
        initSectionAnimations();
        initKeyboardNavigation();
        
        // Set initial active navigation
        updateActiveNavigation();
        
        // Update breadcrumb initially
        updateBreadcrumb();
        
        // Update breadcrumb when navigation changes
        const observer = new MutationObserver(updateBreadcrumb);
        navLinks.forEach(link => {
            observer.observe(link, { attributes: true, attributeFilter: ['class'] });
        });
    }

    // Initialize navigation
    init();

    // Expose navigation functions globally for other scripts
    window.navigationUtils = {
        updateActiveNavigation,
        updateBreadcrumb,
        scrollToSection: function(sectionId) {
            const section = document.querySelector(sectionId);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                updateActiveNavigation(sectionId);
            }
        }
    };
});