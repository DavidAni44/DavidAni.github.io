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
                window.location.hash = targetId;
            });
        });

        window.addEventListener('hashchange', function() {
            const hash = window.location.hash;
            const isInSection = hash && document.querySelector(hash) && document.querySelector(hash).classList.contains(section.contentClass);
            if (isInSection) {
                removeActiveClass();
                setActiveLink(hash);
            }
        });

        // Initial check to set active link based on the current URL hash
        const initialHash = window.location.hash;
        const isInSection = initialHash && document.querySelector(initialHash) && document.querySelector(initialHash).classList.contains(section.contentClass);
        if (isInSection) {
            setActiveLink(initialHash);
        }
    });

    // Handle top-level navbar links for smooth scrolling to sections
    const topNavbarLinks = document.querySelectorAll('.navbar .nav-link');
    topNavbarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            window.location.hash = targetId;
        });
    });

    // Initial check to scroll to the section based on the current URL hash
    if (window.location.hash) {
        const section = document.querySelector(window.location.hash);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

var i = 0;
var txt = "Hey! I'm David.";
var speed = 90;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("page-title").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}
