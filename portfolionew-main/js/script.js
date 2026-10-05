// Header scroll effect — throttled with rAF
        const header = document.getElementById('header');
        let headerTicking = false;
        window.addEventListener('scroll', () => {
            if (!headerTicking) {
                requestAnimationFrame(() => {
                    header.classList.toggle('scrolled', window.scrollY > 60);
                    headerTicking = false;
                });
                headerTicking = true;
            }
        }, { passive: true });

        // Hero parallax effect — desktop only
        const heroSection = document.querySelector('.hero');
        const heroImage = document.querySelector('.hero-image');
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (!isMobile && heroSection && heroImage) {
            let parallaxTicking = false;
            window.addEventListener('scroll', () => {
                if (!parallaxTicking) {
                    requestAnimationFrame(() => {
                        const rect = heroSection.getBoundingClientRect();
                        if (rect.bottom > 0) {
                            const scrolled = window.scrollY;
                            const maxShift = heroSection.offsetHeight * 0.25;
                            const shift = Math.min(scrolled * 0.3, maxShift);
                            heroImage.style.transform = `translate3d(0, ${shift}px, 0)`;
                        }
                        parallaxTicking = false;
                    });
                    parallaxTicking = true;
                }
            }, { passive: true });
        }

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        let savedScrollY = 0;

        function openMobile() {
            savedScrollY = window.scrollY;
            hamburger.classList.add('active');
            mobileMenu.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.width = '100%';
        }

        function closeMobile() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, savedScrollY);
        }
        window.closeMobile = closeMobile;

        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMobile();
            } else {
                openMobile();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMobile();
            }
        });

        // Mobile nav: close menu then scroll to section
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && !href.startsWith('#')) {
                    // Link to another page — let the browser navigate normally
                    return;
                }
                e.preventDefault();
                // Update active state
                document.querySelectorAll('.mobile-nav-item').forEach(el => el.classList.remove('active'));
                this.classList.add('active');
                closeMobile();
                // Scroll after menu close transition
                setTimeout(() => {
                    if (href === '#') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else {
                        const target = document.querySelector(href);
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 350);
            });
        });

        // Close button inside mobile menu
        document.getElementById('mobileMenuClose').addEventListener('click', closeMobile);

        // CV download button closes menu
        const mobileCvBtn = document.querySelector('.mobile-cv-btn');
        if (mobileCvBtn) {
            mobileCvBtn.addEventListener('click', closeMobile);
        }

        // Smooth scroll back to top
        document.querySelector('.back-to-top').addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Project hover image follow cursor
        const projectRows = document.querySelectorAll('.project-row');
        const hoverImg = document.getElementById('projectHoverImg');
        const hoverImgTag = hoverImg ? hoverImg.querySelector('img') : null;

        // Infinite text scroll on page scroll — pauses when tab hidden
        const scrollTrack = document.getElementById('scrollTrack');
        let scrollPos = 0;
        let lastScroll = window.scrollY;

        function updateScrollText() {
            if (!document.hidden) {
                const currentScroll = window.scrollY;
                const delta = currentScroll - lastScroll;
                lastScroll = currentScroll;

                scrollPos -= delta * 0.5;

                const halfWidth = scrollTrack.scrollWidth / 2;

                if (Math.abs(scrollPos) >= halfWidth) {
                    scrollPos = scrollPos % halfWidth;
                }

                scrollTrack.style.transform = `translateX(${scrollPos}px)`;
            } else {
                lastScroll = window.scrollY;
            }
            requestAnimationFrame(updateScrollText);
        }

        requestAnimationFrame(updateScrollText);

        // Loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loader = document.getElementById('loader');
                loader.classList.add('hidden');
                document.body.classList.remove('loading');
                loader.addEventListener('transitionend', () => {
                    loader.remove();
                });
            }, 2200);
        });

        // Animate skill bars — IntersectionObserver instead of scroll listener
        const skillBars = document.querySelectorAll('.skill-bar-item');
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animated');
                    const percent = parseInt(entry.target.dataset.percent);
                    const fill = entry.target.querySelector('.skill-bar-fill');
                    fill.style.width = percent + '%';
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        skillBars.forEach(bar => barObserver.observe(bar));

        // Custom Cursor
        const cursorDot = document.getElementById('cursorDot');
        const cursorRing = document.getElementById('cursorRing');
        const cursorLabel = document.getElementById('cursorLabel');

        if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing && cursorLabel) {
            let cx = 0, cy = 0;
            let rx = 0, ry = 0;
            let lx = 0, ly = 0;
            let cursorVisible = false;

            document.addEventListener('mousemove', (e) => {
                cx = e.clientX;
                cy = e.clientY;
                if (!cursorVisible) {
                    cursorDot.style.opacity = '1';
                    cursorRing.style.opacity = '1';
                    cursorVisible = true;
                }
            }, { passive: true });

            document.addEventListener('mousedown', () => {
                cursorDot.classList.add('clicking');
                cursorRing.classList.add('clicking');
            });

            document.addEventListener('mouseup', () => {
                cursorDot.classList.remove('clicking');
                cursorRing.classList.remove('clicking');
            });

            document.addEventListener('mouseleave', () => {
                cursorDot.classList.add('hidden');
                cursorRing.classList.add('hidden');
                cursorLabel.classList.remove('visible');
            });

            document.addEventListener('mouseenter', () => {
                cursorDot.classList.remove('hidden');
                cursorRing.classList.remove('hidden');
            });

            function getCursorText(el) {
                if (el.matches('a[href], .project-row, .hero-image, img, .project-hover-img')) return 'view';
                if (el.matches('button, .hamburger, .header-cta, [role="button"], .mobile-menu-close, .back-to-top')) return 'press';
                return 'view';
            }

            const hoverTargets = document.querySelectorAll('a, button, .hamburger, .project-row, [role="button"], .header-cta, .back-to-top');
            hoverTargets.forEach(el => {
                el.style.cursor = 'none';
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hover');
                    cursorRing.classList.add('hover');
                    cursorLabel.textContent = getCursorText(el);
                    cursorLabel.classList.add('visible');
                });
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hover');
                    cursorRing.classList.remove('hover');
                    cursorLabel.classList.remove('visible');
                });
            });

            // Initial hidden state
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';

            function animateCursor() {
                if (!document.hidden) {
                    cursorDot.style.left = cx + 'px';
                    cursorDot.style.top = cy + 'px';
                    rx += (cx - rx) * 0.15;
                    ry += (cy - ry) * 0.15;
                    cursorRing.style.left = rx + 'px';
                    cursorRing.style.top = ry + 'px';
                    lx += (cx - lx) * 0.12;
                    ly += (cy - ly) * 0.12;
                    cursorLabel.style.left = lx + 'px';
                    cursorLabel.style.top = (ly + 50) + 'px';
                }
                requestAnimationFrame(animateCursor);
            }
            requestAnimationFrame(animateCursor);
        }

        if (window.innerWidth > 768 && hoverImg && hoverImgTag) {
            let mouseX = 0, mouseY = 0;
            let imgX = 0, imgY = 0;
            let imgScale = 0.5;
            let rotX = 0, rotY = 0;
            let hoverActive = false;
            let isFirstMove = true;

            const lerp = (start, end, factor) => start + (end - start) * factor;

            const updateMouse = (e) => {
                const targetX = e.clientX + 20;
                const targetY = e.clientY - 120;
                
                mouseX = targetX;
                mouseY = targetY;

                if (isFirstMove) {
                    imgX = targetX;
                    imgY = targetY;
                    isFirstMove = false;
                }
            };

            window.addEventListener('mousemove', updateMouse, { passive: true });

            function animateHoverImg() {
                if (!document.hidden) {
                    const diffX = mouseX - imgX;
                    const diffY = mouseY - imgY;

                    // Smooth position
                    imgX = lerp(imgX, mouseX, 0.08);
                    imgY = lerp(imgY, mouseY, 0.08);

                    // Calculate rotation based on cursor movement speed
                    const targetRotX = diffY * -0.05;
                    const targetRotY = diffX * 0.05;
                    
                    rotX = lerp(rotX, targetRotX, 0.1);
                    rotY = lerp(rotY, targetRotY, 0.1);
                    
                    // Clamp rotation to avoid flipping
                    rotX = Math.max(-15, Math.min(15, rotX));
                    rotY = Math.max(-15, Math.min(15, rotY));
                    
                    // Smooth scale
                    const targetScale = hoverActive ? 1 : 0.6;
                    imgScale = lerp(imgScale, targetScale, 0.08);

                    hoverImg.style.transform = `translate3d(${imgX}px, ${imgY}px, 0) scale(${imgScale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                }
                requestAnimationFrame(animateHoverImg);
            }
            requestAnimationFrame(animateHoverImg);

            projectRows.forEach(row => {
                row.addEventListener('mouseenter', (e) => {
                    updateMouse(e); // Ensure position is known on enter
                    const src = row.dataset.img;
                    if (src) {
                        hoverImgTag.src = src;
                        hoverImg.classList.add('visible');
                        hoverActive = true;
                    }
                });

                row.addEventListener('mouseleave', () => {
                    hoverImg.classList.remove('visible');
                    hoverActive = false;
                });
            });
        }
