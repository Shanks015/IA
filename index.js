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
    // MULTIPLE GALLERY EXPERIMENTAL ANIMATION STYLES (GSAP PIN)
    // ==========================================
    if (typeof gsap !== 'undefined') {
        
        // --- Style 1: 3D Depth Tunnel ---
        const tunnelTrack = document.querySelector('#gallery-style-1 .tunnel-track');
        const tunnelCards = document.querySelectorAll('#gallery-style-1 .tunnel-card');
        const tunnelIntro = document.querySelector('#gallery-style-1 .tunnel-intro');
        
        if (tunnelTrack && tunnelCards.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#gallery-style-1",
                    start: "top top",
                    end: "+=2000",
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
            
            tl.to(tunnelIntro, { opacity: 0, y: -50, duration: 0.5 }, 0);
            
            tunnelCards.forEach((card, index) => {
                const initialZ = -1200 + (index * 300);
                const initialX = index % 2 === 0 ? -20 : 18;
                const initialY = index % 2 === 0 ? -15 : 12;
                
                gsap.set(card, {
                    xPercent: -50,
                    yPercent: -50,
                    z: initialZ,
                    x: `${initialX}vw`,
                    y: `${initialY}vh`,
                    opacity: 0
                });
                
                tl.to(card, {
                    z: 500,
                    opacity: 1,
                    ease: "power1.inOut",
                    onUpdate: function() {
                        const progress = this.progress();
                        if (progress > 0.8) {
                            card.style.opacity = (1 - (progress - 0.8) * 5);
                        } else {
                            card.style.opacity = Math.min(1, progress * 4);
                        }
                    }
                }, index * 0.3);
            });
        }


        // --- Style 3: Inertial Tilting Horizontal Strip ---
        const tiltTrack = document.querySelector('#gallery-style-3 .tilt-track');
        const tiltCards = document.querySelectorAll('#gallery-style-3 .tilt-card');
        
        if (tiltTrack) {
            const getScrollAmount = () => -(tiltTrack.scrollWidth - window.innerWidth);
            
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#gallery-style-3",
                    start: "top top",
                    end: () => `+=${tiltTrack.scrollWidth - window.innerWidth}`,
                    pin: true,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        const velocity = self.getVelocity();
                        const skew = velocity / 180;
                        
                        tiltCards.forEach(card => {
                            gsap.to(card, {
                                skewX: skew,
                                rotation: skew * 0.4,
                                overwrite: "auto",
                                duration: 0.4,
                                ease: "power1.out"
                            });
                        });
                    },
                    onToggle: (self) => {
                        if (!self.isActive) {
                            tiltCards.forEach(card => {
                                gsap.to(card, { skewX: 0, rotation: 0, duration: 0.5 });
                            });
                        }
                    }
                }
            });
            
            tl.to(tiltTrack, {
                x: getScrollAmount,
                ease: "none"
            });
        }

        // --- Style 4: Floating Multi-directional Collage ---
        const collageTrack = document.querySelector('#gallery-style-4 .collage-track');
        const collageCards = document.querySelectorAll('#gallery-style-4 .collage-card');
        
        if (collageTrack && collageCards.length > 0) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#gallery-style-4",
                    start: "top top",
                    end: "+=1500",
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
            
            collageCards.forEach(card => {
                const speedX = parseFloat(card.getAttribute('data-speed-x')) || 0;
                const speedY = parseFloat(card.getAttribute('data-speed-y')) || 0;
                
                tl.fromTo(card,
                    { x: 0, y: 0 },
                    { 
                        x: speedX, 
                        y: speedY, 
                        rotation: speedX * 0.05,
                        ease: "none" 
                    },
                    0
                );
            });
        }
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
