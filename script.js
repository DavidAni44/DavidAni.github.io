document.addEventListener("DOMContentLoaded", function() {

    window.scrollTo(0, 0);

    const sections = [
        {
            menuId: 'menu',
            activeClass: 'curr_active',
            contentClass: 'resume-card'
        },
        {
            menuId: 'proj_menu',
            activeClass: 'proj_curr_active',
            contentClass: 'project-card'
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
                    document.querySelector(hash).style.display = 'block';
                }
            });
        }

        links.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const targetId = link.getAttribute('href');
                removeActiveClass();
                setActiveLink(targetId);
            });
        });

        window.addEventListener('hashchange', function() {
            const hash = window.location.hash;
            removeActiveClass();
            setActiveLink(hash);
        });

        // Initial check to set active link based on the current URL hash
        setActiveLink(window.location.hash);
    });
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