// Ensure GSAP plugins are registered
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // INITIALIZE LENIS SMOOTH SCROLL (SLOW & SMOOTH)
    // ==========================================
    const lenis = new Lenis({
        duration: 1.8, // Speed of scroll (slower and smoother scroll inertia)
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing profile
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis frame updates with GSAP global ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable lag smoothing in GSAP to avoid alignment jumps during scroll pinning
    gsap.ticker.lagSmoothing(0);

    // ==========================================
    // SITE HEADER SCROLL CLASS TOGGLE
    // ==========================================
    const siteHeader = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('header-scrolled');
        } else {
            siteHeader.classList.remove('header-scrolled');
        }
    });

    // ==========================================
    // FLOATING KEYCHAINS & BADGES PARALLAX EFFECT
    // ==========================================
    if (typeof gsap !== 'undefined') {
        document.querySelectorAll('.floating-badge').forEach(badge => {
            const depth = parseFloat(badge.getAttribute('data-depth')) || 0.2;
            const parentSection = badge.closest('section');
            
            gsap.to(badge, {
                scrollTrigger: {
                    trigger: parentSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                },
                y: () => -window.innerHeight * depth * 0.7,
                ease: "none"
            });
        });
    }

    // ==========================================
    // PROBLEM CARDS SCROLL REVEAL (FADE IN UP)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.from(".problem-card", {
            scrollTrigger: {
                trigger: ".problem-grid",
                start: "top bottom-=100px",
                toggleActions: "play none none none"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out"
        });
    }

    // ==========================================
    // CURRICULUM ACCORDION LOGIC
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all accordion panels
            accordionItems.forEach(i => {
                i.classList.remove('active');
                const icon = i.querySelector('.accordion-toggle-icon i');
                if (icon) {
                    icon.className = 'fa-solid fa-plus';
                }
            });
            
            // If it was not active, open it
            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('.accordion-toggle-icon i');
                if (icon) {
                    icon.className = 'fa-solid fa-minus';
                }
            }
        });
    });

    // ==========================================
    // SCROLL REVEAL TEXT MASK ANIMATION (GSAP PIN)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.timeline({
            scrollTrigger: {
                trigger: ".reveal-scroll-section",
                start: "top top",
                end: "+=1200", // Duration of scrolling/pinning
                pin: true,
                scrub: true,
                anticipatePin: 1
            }
        })
        .to(".reveal-image-wrapper", {
            width: "0px",
            borderRadius: "0px",
            ease: "none"
        });
    }

    // ==========================================
    // INTERACTIVE DEVELOPMENT PHASES SELECTOR
    // ==========================================
    const planOptions = document.querySelectorAll('.plan-option');
    const featureItems = document.querySelectorAll('.pricing-features-list li');
    const enrollActionBtn = document.querySelector('.enroll-action-btn');
    
    // Set initial button text based on active plan
    const initialActive = document.querySelector('.plan-option.active');
    if (initialActive) {
        const price = initialActive.getAttribute('data-price');
        enrollActionBtn.textContent = `Explore Phase ${price} Details`;
    }

    planOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove active class from all options
            planOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            
            const planName = option.getAttribute('data-plan');
            const planPrice = option.getAttribute('data-price');
            
            // Highlight applicable features, disable others
            featureItems.forEach(item => {
                const applicablePlans = item.getAttribute('data-plans').split(' ');
                if (applicablePlans.includes(planName)) {
                    item.classList.remove('disabled');
                } else {
                    item.classList.add('disabled');
                }
            });
            
            // Update button text
            enrollActionBtn.textContent = `Explore Phase ${planPrice} Details`;
            
            // Trigger a quick micro-animation on details panel
            gsap.fromTo(".pricing-details-col", 
                { opacity: 0.8, x: 10 }, 
                { opacity: 1, x: 0, duration: 0.3, ease: "power1.out" }
            );
        });
    });

    // ==========================================
    // VIDEO VIEWPORT AUTOPLAY & HOVER INTERACTION
    // ==========================================
    const videoElements = document.querySelectorAll('.video-card video');
    
    // Autoplay videos when they cross into viewport
    if ('IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(error => {
                        console.log("Autoplay prevented on this device, waiting for interaction.");
                    });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });
        
        videoElements.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // Toggle overlay and manual playback click
    document.querySelectorAll('.video-card').forEach(card => {
        const video = card.querySelector('video');
        const overlay = card.querySelector('.video-overlay');
        
        card.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '0.8';
            }
        });
        
        card.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
            overlay.style.opacity = '0';
        });
        
        card.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0.8';
        });
    });

    // ==========================================
    // FAQ ACCORDION LOGIC
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(i => {
                i.classList.remove('active');
                const icon = i.querySelector('.faq-toggle-icon i');
                if (icon) {
                    icon.className = 'fa-solid fa-plus';
                }
            });
            
            // Open clicked item if not active
            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('.faq-toggle-icon i');
                if (icon) {
                    icon.className = 'fa-solid fa-minus';
                }
            }
        });
    });
});
