
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
});

