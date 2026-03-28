const profileBtn = document.getElementById('userProfileBtn');
const dropdownMenu = document.getElementById('settingsDropdown');
// Added a check here to prevent the 'querySelector' error if button is missing
const icon = profileBtn ? profileBtn.querySelector('i') : null;

if (profileBtn && dropdownMenu && icon) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    icon.classList.toggle('fa-angle-down');
    icon.classList.toggle('fa-angle-up');
  });
}

// Select all nav links
const navLinks = document.querySelectorAll(".nav-menu ul li a");
const navToggleBtn = document.getElementById("navToggle");
const navToggleIcon = navToggleBtn ? navToggleBtn.querySelector("i") : null;

const currentPath = window.location.pathname;

navLinks.forEach((link) => {
  if (
    link.getAttribute("href") === currentPath ||
    link.getAttribute("href") === "." + currentPath
  ) {
    link.classList.add("active");
  }
});

const heroButtons = document.querySelectorAll(".button a");

heroButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    heroButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
  });
});

function toggleMenu() {
  const menu = document.getElementById("navMenu");
  if (!menu || !navToggleBtn || !navToggleIcon) return;

  menu.classList.toggle("open");
  const isMenuOpen = menu.classList.contains("open");

  if (isMenuOpen) {
    navToggleIcon.classList.remove("fa-bars");
    navToggleIcon.classList.add("fa-xmark");
    navToggleBtn.setAttribute("aria-expanded", "true");
  } else {
    navToggleIcon.classList.remove("fa-xmark");
    navToggleIcon.classList.add("fa-bars");
    navToggleBtn.setAttribute("aria-expanded", "false");
  }

  if (window.innerWidth <= 1023) {
    menu.style.display = isMenuOpen ? "block" : "none";
  } else {
    menu.style.display = "";
  }
}

if (navToggleBtn) {
  navToggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    toggleMenu();
    this.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("navMenu");
    if (menu && menu.classList.contains("open")) {
      toggleMenu();
    }
  });
});

const mvpToggle = document.getElementById("mvp-toggle");
const aiToggle = document.getElementById("ai-toggle");
const mvpContent = document.getElementById("mvp-content");
const aiContent = document.getElementById("ai-content");

if (mvpToggle && aiToggle && mvpContent && aiContent) {
  function setActive(selectedToggle, unselectedToggle, selectedContent, unselectedContent) {
    selectedToggle.classList.add("active");
    unselectedToggle.classList.remove("active");
    selectedContent.classList.add("active-content");
    unselectedContent.classList.remove("active-content");
  }

  mvpToggle.addEventListener("click", () => {
    setActive(mvpToggle, aiToggle, mvpContent, aiContent);
  });

  aiToggle.addEventListener("click", () => {
    setActive(aiToggle, mvpToggle, aiContent, mvpContent);
  });
}

// ── FIXING THE PASSWORD TOGGLE ERRORS ──
const togglePwd = document.getElementById("togglePassword");
const pwd = document.getElementById("signinPassword");
const signPwd = document.getElementById('signupPassword');
// const confirmPwd = document.getElementById('signupConfirm'); // Kept commented as requested

// Only add listeners if BOTH the eye icon and the password field exist
if (togglePwd) {
  if (pwd) {
    togglePwd.addEventListener("click", () => {
      if (pwd.type === "password") {
        pwd.type = "text";
        togglePwd.classList.remove('fa-eye');
        togglePwd.classList.add('fa-eye-slash');
      } else {
        pwd.type = 'password';
        togglePwd.classList.remove('fa-eye-slash');
        togglePwd.classList.add('fa-eye');
      }
    });
  }

  if (signPwd) {
    togglePwd.addEventListener("click", () => {
      if (signPwd.type === "password") {
        signPwd.type = "text";
        togglePwd.classList.remove('fa-eye');
        togglePwd.classList.add('fa-eye-slash');
      } else {
        signPwd.type = 'password';
        togglePwd.classList.remove('fa-eye-slash');
        togglePwd.classList.add('fa-eye');
      }
    });
  }
}

// ============================================================
// NOVABUK — PERSISTENT NAV BUTTONS FOR ALL APP PAGES
// ============================================================

(function initAppNav() {
  const profileBtn = document.getElementById('userProfileBtn');
  const navAvatarEl = document.getElementById('navAvatar');

  if (!profileBtn) return;

  const user = JSON.parse(localStorage.getItem('novabuk_user') || '{}');

  if (navAvatarEl && user.fullName) {
    navAvatarEl.textContent = user.fullName.charAt(0).toUpperCase();
  }

  window.handleMenuSelect = function(value) {
    if (value === 'logout') {
      localStorage.removeItem('novabuk_token');
      localStorage.removeItem('novabuk_user');
      localStorage.removeItem('selectedClinic');
      window.location.href = './sign-in.html';
    } else if (value === 'profile') {
      window.location.href = './app-setting.html?tab=profile';
    } else if (value === 'settings') {
      window.location.href = './app-setting.html?tab=privacy';
    } else if (value === 'notification') {
      window.location.href = './app-setting.html?tab=notification';
    }
  };

  const token = localStorage.getItem('novabuk_token');
  const isAuthPage = ['sign-in', 'sign-up', 'forgot-password', 'reset-password', 'send-email', 'index']
    .some(p => window.location.pathname.includes(p));

  if (!token && !isAuthPage) {
    window.location.href = './sign-in.html';
  }
})(); // Fixed: Added () to execute the function

(function syncIndexNavbar() {
    const token = localStorage.getItem('novabuk_token');
    const user = JSON.parse(localStorage.getItem('novabuk_user') || '{}');
    
    const authBtns = document.getElementById('authBtns');
    const appNavBtns = document.getElementById('appNavBtns');
    const navAvatar = document.getElementById('navAvatar');

    if (token) {
        if (authBtns) authBtns.style.display = 'none';
        if (appNavBtns) appNavBtns.style.display = 'flex';
        if (navAvatar && user.fullName) {
            navAvatar.textContent = user.fullName.charAt(0).toUpperCase();
        }
    }
})();
