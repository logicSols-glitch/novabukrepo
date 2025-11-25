// Select all nav links
const navLinks = document.querySelectorAll('.nav-menu ul li a');

// Get current page path
const currentPath = window.location.pathname;

// Loop through links and set active class
navLinks.forEach(link => {
    if(link.getAttribute('href') === currentPath || link.getAttribute('href') === '.' + currentPath) {
        link.classList.add('active');
    }
});

// Select all buttons
const buttons = document.querySelectorAll('.button a');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // prevent default link action
        // Remove active from all buttons
        buttons.forEach(btn => btn.classList.remove('active'));
        // Add active to clicked button
        this.classList.add('active');
    });
});

function toggleMenu() {
    const menu = document.getElementById("navMenu");
    const btn = document.getElementById('navToggle') || document.querySelector('.hamburger');
    if (!menu) return;

    // Toggle class for CSS-driven behavior
    menu.classList.toggle('open');

    // For robustness, explicitly set inline display on small screens
    if (window.innerWidth <= 1023) {
        if (menu.classList.contains('open')) {
            menu.style.display = 'block';
            if (btn) btn.setAttribute('aria-expanded', 'true');
        } else {
            menu.style.display = 'none';
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    } else {
        // remove inline style on larger screens so desktop CSS remains authoritative
        menu.style.display = '';
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    console.log('toggleMenu executed — open:', menu.classList.contains('open'));
}

// Wire up hamburger toggle (if present)
const navToggleBtn = document.getElementById('navToggle');
if (navToggleBtn) {
    navToggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleMenu();
        this.classList.toggle('open');
    });
}

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.getElementById('navMenu');
        const toggle = document.getElementById('navToggle');
        if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
        }
        if (toggle && toggle.classList.contains('open')) {
            toggle.classList.remove('open');
        }
    });
});

    
    const mvpToggle = document.getElementById('mvp-toggle');
    const aiToggle = document.getElementById('ai-toggle');
    const mvpContent = document.getElementById('mvp-content');
    const aiContent = document.getElementById('ai-content');

    // Function to handle the state change
    function setActive(selectedToggle, unselectedToggle, selectedContent, unselectedContent) {
        // 1. Toggle the 'active' class on the buttons
        selectedToggle.classList.add('active');
        unselectedToggle.classList.remove('active');

        // 2. Toggle the 'active-content' class on the content panels
        selectedContent.classList.add('active-content');
        unselectedContent.classList.remove('active-content');
    }

    // Add event listeners to each button
    mvpToggle.addEventListener('click', () => {
        setActive(mvpToggle, aiToggle, mvpContent, aiContent);
    });

    aiToggle.addEventListener('click', () => {
        setActive(aiToggle, mvpToggle, aiContent, mvpContent);
    });

    // const Message = document.getElementById('message');

    // Message.addEventListener('input', (e) => {
    //     e.preventDefault();
    //         console.log('You are typing...');
        
    // });