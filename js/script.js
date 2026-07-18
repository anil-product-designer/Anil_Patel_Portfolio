
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
            name: "Dhruvin Somani",
            role: "Colleague · Zenisth AI",
            avatar: "https://ui-avatars.com/api/?name=Dhruvin+Somani&background=1e1b4b&color=a78bfa&size=200&bold=true",
            description: "Add Dhruvin's testimonial here."
        },
        {
            id: 2,
            name: "Jaydeep Darji",
            role: "Colleague · Zenisth AI",
            avatar: "https://ui-avatars.com/api/?name=Jaydeep+Darji&background=1e1b4b&color=a78bfa&size=200&bold=true",
            description: "Add Jaydeep's testimonial here."
        },
        {
            id: 3,
            name: "Sangeet Gupta",
            role: "Manager · Zenisth AI",
            avatar: "https://ui-avatars.com/api/?name=Sangeet+Gupta&background=312e81&color=c4b5fd&size=200&bold=true",
            description: "Add Sangeet's testimonial here."
        },
        {
            id: 4,
            name: "Hardik Soni",
            role: "Founder · Zenisth AI",
            avatar: "https://ui-avatars.com/api/?name=Hardik+Soni&background=4c1d95&color=ddd6fe&size=200&bold=true",
            description: "Add Hardik's testimonial here."
        }
    ];

    const track = document.getElementById('testimonialTrack');

    if (track && TESTIMONIAL_DATA.length > 0) {
        // Duplicate data to create a seamless infinite scrolling loop
        const duplicatedData = [...TESTIMONIAL_DATA, ...TESTIMONIAL_DATA];

        duplicatedData.forEach((t, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `
                <img src="${t.avatar}" alt="${t.name}" class="testimonial__avatar" draggable="false">
                <h3 class="testimonial__name">${t.name}</h3>
                <p class="testimonial__role">${t.role}</p>
                <p class="testimonial__desc">"${t.description}"</p>
            `;
            track.appendChild(card);
        });

        // Pause animation on hover
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }
});


document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if(navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
          link.style.color = 'var(--text)';
        }
      });
    });
  }
});
