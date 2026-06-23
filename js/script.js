
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav__links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav__links--active');

            // Optional: Animate hamburger to X
            menuToggle.classList.toggle('menu-toggle--active');
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav__links--active');
                menuToggle.classList.remove('menu-toggle--active');
            });
        });
    }



    // Scroll Reveal Observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                // Once visible, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };

    // Setup .reveal-text elements
    const revealTextElements = document.querySelectorAll('.reveal-text');
    revealTextElements.forEach(el => {
        function splitTextNodes(node) {
            if (node.nodeType === 3) { // Text node
                const words = node.nodeValue.split(/(\s+)/);
                const fragment = document.createDocumentFragment();
                let hasWord = false;
                words.forEach(word => {
                    if (word.trim().length > 0) {
                        hasWord = true;
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'reveal-text-word';
                        const innerSpan = document.createElement('span');
                        innerSpan.textContent = word;
                        wordSpan.appendChild(innerSpan);
                        fragment.appendChild(wordSpan);
                    } else {
                        fragment.appendChild(document.createTextNode(word));
                    }
                });
                if (hasWord) {
                    node.parentNode.replaceChild(fragment, node);
                }
            } else if (node.nodeType === 1 && node.nodeName !== 'BR' && !node.classList.contains('reveal-text-word')) {
                Array.from(node.childNodes).forEach(splitTextNodes);
            }
        }
        
        Array.from(el.childNodes).forEach(splitTextNodes);

        // Assign transition delays
        const innerSpans = el.querySelectorAll('.reveal-text-word span');
        innerSpans.forEach((span, i) => {
            span.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    const revealElements = document.querySelectorAll('.reveal, .reveal-text');
    revealElements.forEach(el => revealObserver.observe(el));

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const animationDuration = 2000; // Total animation time in ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(animationDuration / frameDuration);

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let frame = 0;

                const countTo = () => {
                    frame++;
                    // EaseOutQuad function for smooth deceleration
                    const progress = frame / totalFrames;
                    const currentCount = Math.round(target * (1 - Math.pow(1 - progress, 3)));

                    if (frame < totalFrames) {
                        counter.innerText = currentCount;
                        requestAnimationFrame(countTo);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                countTo();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Testimonial Carousel
    const TESTIMONIAL_DATA = [
        {
            id: 1,
            name: "John Doe",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
            description: "Amazing experience working with this team! The results exceeded my expectations."
        },
        {
            id: 2,
            name: "Jane Smith",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
            description: "Highly recommended! Great service and professional approach. Built incredible UI."
        },
        {
            id: 3,
            name: "Mike Johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
            description: "Exceptional quality and professionalism. Would definitely work with them again."
        }
    ];

    const carouselContainer = document.getElementById('testimonialCarousel');
    const dotsContainer = document.getElementById('testimonialDots');
    const btnPrev = document.querySelector('.t-prev');
    const btnNext = document.querySelector('.t-next');

    if (carouselContainer && TESTIMONIAL_DATA.length > 0) {
        let currentIndex = 0;

        // Create Cards
        TESTIMONIAL_DATA.forEach((t, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.dataset.index = index;
            card.innerHTML = `
                <img src="${t.avatar}" alt="${t.name}" class="testimonial__avatar" draggable="false">
                <h3 class="testimonial__name">${t.name}</h3>
                <p class="testimonial__desc">"${t.description}"</p>
            `;
            carouselContainer.appendChild(card);

            // Create Dot
            const dot = document.createElement('div');
            dot.className = 't-dot';
            dot.dataset.index = index;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const cards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.t-dot');

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.className = 'testimonial-card'; // reset classes
                
                if (index === currentIndex) {
                    card.classList.add('active');
                } else if (index === (currentIndex + 1) % cards.length) {
                    card.classList.add('prev');
                } else if (index === (currentIndex + 2) % cards.length) {
                    card.classList.add('next');
                }
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Controls
        const goNext = () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        };

        const goPrev = () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        };

        btnNext.addEventListener('click', goNext);
        btnPrev.addEventListener('click', goPrev);

        // Basic Drag/Swipe support
        let startX = 0;
        let isDragging = false;

        carouselContainer.addEventListener('mousedown', e => {
            isDragging = true;
            startX = e.pageX;
        });

        window.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;
            const diffX = e.pageX - startX;
            if (diffX > 50) goPrev();
            else if (diffX < -50) goNext();
        });

        carouselContainer.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });

        carouselContainer.addEventListener('touchend', e => {
            const diffX = e.changedTouches[0].clientX - startX;
            if (diffX > 50) goPrev();
            else if (diffX < -50) goNext();
        });

        // Initialize
        updateCarousel();
    }
});
