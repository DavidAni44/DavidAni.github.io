window.scroll({
    top: 2500, 
    left: 0, 
    behavior: 'smooth'
  });
  
  // Scroll certain amounts from current position 
  window.scrollBy({ 
    top: 100, // could be negative value
    left: 0, 
    behavior: 'smooth' 
  });


document.addEventListener("DOMContentLoaded", function() {
    // Get all nav links
    var links = document.querySelectorAll('.experience-nav a');
    
    // Function to remove active class from all links
    function removeActiveClass() {
        links.forEach(function(link) {
            link.classList.remove('active');
        });
    }
    
    // Get current hash from URL
    var currentHash = window.location.hash;
    
    // Highlight the appropriate link
    links.forEach(function(link) {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
    
    // Optionally, you can add an event listener for hash change
    window.addEventListener('hashchange', function() {
        removeActiveClass();
        
        // Get updated hash
        var updatedHash = window.location.hash;
        
        links.forEach(function(link) {
            if (link.getAttribute('href') === updatedHash) {
                link.classList.add('active');
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('.experience-nav a');
    var contentBlocks = document.querySelectorAll('.resume-card');
    
    function removeActiveClass() {
        links.forEach(function(link) {
            link.classList.remove('active');
        });
        contentBlocks.forEach(function(block) {
            block.style.display = 'none';
        });
    }

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            var targetId = link.getAttribute('id') + '-content'; // Get target content ID
            var targetContent = document.getElementById(targetId);
            
            removeActiveClass();
            
            link.classList.add('active'); // Highlight the clicked link
            targetContent.style.display = 'block'; // Show the corresponding content
        });
    });
});


const myMenu = document.getElementById('menu');

myMenu.onclick = e => {
  if (e.target.tagName.toLowerCase() !== 'a') return; // only process <a> clicks
  e.preventDefault(); // prevent the default action (navigating to the anchor)
  
  let LI = e.target.parentElement;

  if (!LI.classList.contains('curr_active')) {
    myMenu.querySelector('li.curr_active').classList.remove('curr_active');
  }
  LI.classList.add('curr_active');
};


//project nav section


document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('.project-nav a');
    var contentBlocks = document.querySelectorAll('.project-card');
    
    function removeActiveClass() {
        links.forEach(function(link) {
            link.classList.remove('active');
        });
        contentBlocks.forEach(function(block) {
            block.style.display = 'none';
        });
    }

    links.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default anchor behavior
            
            var targetId = link.getAttribute('id') + '-content'; // Get target content ID
            var targetContent = document.getElementById(targetId);
            
            removeActiveClass();
            
            link.classList.add('active'); // Highlight the clicked link
            targetContent.style.display = 'block'; // Show the corresponding content
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Get all nav links
    var links = document.querySelectorAll('.project-nav a');
    
    // Function to remove active class from all links
    function removeActiveClass() {
        links.forEach(function(link) {
            link.classList.remove('active');
        });
    }
    
    // Get current hash from URL
    var currentHash = window.location.hash;
    
    // Highlight the appropriate link
    links.forEach(function(link) {
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
    
    // Optionally, you can add an event listener for hash change
    window.addEventListener('hashchange', function() {
        removeActiveClass();
        
        // Get updated hash
        var updatedHash = window.location.hash;
        
        links.forEach(function(link) {
            if (link.getAttribute('href') === updatedHash) {
                link.classList.add('active');
            }
        });
    });
});

const myMenuproj = document.getElementById('proj_menu');

myMenuproj.onclick = e => {
  if (e.target.tagName.toLowerCase() !== 'a') return; // only process <a> clicks
  e.preventDefault(); // prevent the default action (navigating to the anchor)
  
  let LI = e.target.parentElement;

  if (!LI.classList.contains('proj_curr_active')) {
    myMenuproj.querySelector('li.proj_curr_active').classList.remove('proj_curr_active');
  }
  LI.classList.add('proj_curr_active');
};

window.onload = function() {
    var defaultSection = document.getElementById("main_page");
    defaultSection.scrollIntoView({ behavior: 'smooth' });
};
