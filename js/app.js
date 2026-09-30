/**
 * Blog de Café - Interactive Barista Suite & UI Controller (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileMenu();
  initBrewCalculator();
  initCourseModal();
  initNewsletterToast();
  initContactForm();
  initCategoryFilters();
});

/* --------------------------------------------------------------------------
   Sticky Navbar Shadow on Scroll
-------------------------------------------------------------------------- */
function initStickyNavbar() {
  const navbar = document.querySelector('.site-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   Mobile Menu Toggle
-------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.navegacion');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isExpanded = navMenu.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isExpanded);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }
  });
}

/* --------------------------------------------------------------------------
   Interactive Barista Brew Calculator (Ratio Tool)
-------------------------------------------------------------------------- */
function initBrewCalculator() {
  const slider = document.getElementById('brew-grams-slider');
  const gramsDisplay = document.getElementById('brew-grams-display');
  const waterDisplay = document.getElementById('brew-water-result');
  const timeDisplay = document.getElementById('brew-time-result');
  const methodBtns = document.querySelectorAll('.brew-method-btn');

  if (!slider || !gramsDisplay || !waterDisplay) return;

  // Brew specifications: ratio (1:X) and standard extraction time
  const brewProfiles = {
    v60: { ratio: 15, time: '2:45 min', name: 'V60 Drip' },
    chemex: { ratio: 16, time: '4:00 min', name: 'Chemex' },
    aeropress: { ratio: 12, time: '1:30 min', name: 'Aeropress' },
    prensa: { ratio: 12, time: '4:30 min', name: 'Prensa Francesa' },
    espresso: { ratio: 2, time: '0:28 seg', name: 'Espresso Pro' }
  };

  let currentMethod = 'v60';

  function updateCalculations() {
    const grams = parseInt(slider.value, 10);
    const profile = brewProfiles[currentMethod] || brewProfiles.v60;
    const totalWater = Math.round(grams * profile.ratio);

    gramsDisplay.textContent = `${grams}g`;
    waterDisplay.textContent = `${totalWater} ml`;
    if (timeDisplay) {
      timeDisplay.textContent = profile.time;
    }
  }

  slider.addEventListener('input', updateCalculations);

  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMethod = btn.dataset.method || 'v60';

      // Adjust slider default if espresso
      if (currentMethod === 'espresso') {
        slider.min = 14;
        slider.max = 24;
        slider.value = 18;
      } else {
        slider.min = 12;
        slider.max = 50;
        if (slider.value < 12 || slider.value > 50) slider.value = 20;
      }

      updateCalculations();
    });
  });

  // Initial calculation
  updateCalculations();
}

/* --------------------------------------------------------------------------
   Course Enrollment Modal Simulation
-------------------------------------------------------------------------- */
function initCourseModal() {
  const modalOverlay = document.getElementById('course-modal-overlay');
  const modalCourseTitle = document.getElementById('modal-course-title');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalForm = document.getElementById('modal-enrollment-form');
  const enrollBtns = document.querySelectorAll('[data-enroll-course]');

  if (!modalOverlay) return;

  enrollBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseName = btn.getAttribute('data-enroll-course') || 'Curso de Barista';
      if (modalCourseTitle) modalCourseTitle.textContent = courseName;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value || 'Estudiante';
      closeModal();
      showToast(`☕ ¡Felicidades ${name}! Tu cupo ha sido reservado. Te enviamos los detalles a tu email.`);
      modalForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   Newsletter Toast Notification
-------------------------------------------------------------------------- */
function initNewsletterToast() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        showToast(`📬 ¡Suscripción confirmada! Te enviaremos las mejores recetas a ${emailInput.value.trim()}.`);
        form.reset();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Contact Form Handler
-------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('.formulario-moderno');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nombre')?.value || 'Amigo del café';
    showToast(`✨ Gracias ${name}. Hemos recibido tu mensaje y te responderemos en breve.`);
    form.reset();
  });
}

/* --------------------------------------------------------------------------
   Course / Catalog Filter System
-------------------------------------------------------------------------- */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.curso-full-card');

  if (filterBtns.length === 0 || courseCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.dataset.filter;

      courseCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'grid';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   Toast Utility
-------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
