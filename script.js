document.addEventListener("DOMContentLoaded", function() {

    window.scrollTo(0, 0);

    const sections = [
        {
            menuId: 'menu',
            activeClass: 'curr_active',
            contentClass: 'resume-card',
            sectionId: 'two'
        },
        {
            menuId: 'proj_menu',
            activeClass: 'proj_curr_active',
            contentClass: 'project-card',
            sectionId: 'three'
        }
    ];

    sections.forEach(section => {
        const menu = document.getElementById(section.menuId);
        const links = menu.querySelectorAll('a');
        const contentBlocks = document.querySelectorAll(`.${section.contentClass}`);

        function removeActiveClass() {
            links.forEach(link => {
                link.parentElement.classList.remove(section.activeClass);
            });
            contentBlocks.forEach(block => {
                block.style.display = 'none';
            });
        }

        function setActiveLink(hash) {
            links.forEach(link => {
                if (link.getAttribute('href') === hash) {
                    link.parentElement.classList.add(section.activeClass);
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        targetElement.style.display = 'block';
                    }
                }
            });
        }

        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                removeActiveClass();
                setActiveLink(targetId);
                scrollToSection(targetId);
                window.location.hash = targetId;
            });
        });

        window.addEventListener('hashchange', function() {
            const hash = window.location.hash;
            const isInSection = hash && document.querySelector(hash) && document.querySelector(hash).classList.contains(section.contentClass);
            if (isInSection) {
                removeActiveClass();
                setActiveLink(hash);
                scrollToSection(hash);
            }
        });

        // Initial check to set active link based on the current URL hash
        const initialHash = window.location.hash;
        const isInSection = initialHash && document.querySelector(initialHash) && document.querySelector(initialHash).classList.contains(section.contentClass);
        if (isInSection) {
            setActiveLink(initialHash);
            scrollToSection(initialHash);
        }
    });

    function scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offset = -100; // Adjust this value to control the scroll position
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset + offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Change to 'smooth' if you want smooth scrolling
            });
        }
    }

    // Handle top-level navbar links without smooth scrolling
    const topNavbarLinks = document.querySelectorAll('.navbar .nav-link');
    topNavbarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            scrollToSection(targetId);
            window.location.hash = targetId;
        });
    });

    // Initial check to scroll to the section based on the current URL hash
    if (window.location.hash) {
        const section = document.querySelector(window.location.hash);
        if (section) {
            scrollToSection(window.location.hash);
        }
    }
});

function typeWriter(elementId, text, speed) {
    let i = 0;
    function type() {
      if (i < text.length) {
        document.getElementById(elementId).innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
}

function createObserver(targetId, callback) {
    let target = document.getElementById(targetId);
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target); // Stop observing after the effect starts
        }
      });
    }, options);
    observer.observe(target);
}

createObserver('main_page', () => typeWriter('page-title', "Hey! I'm David.", 100));

document.getElementById('menu-toggle').addEventListener('change', function () {
    document.getElementById('navbarNav').classList.toggle('show');
});
