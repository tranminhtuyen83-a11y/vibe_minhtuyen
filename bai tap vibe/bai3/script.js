/**
 * VINHOMES GRAND PARK - LANDING PAGE INTERACTIVE SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Navbar Effect on Scroll
  const navbar = document.querySelector('.navbar-custom');
  
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Smooth Scroll & Active Link Highlight
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  const highlightNavLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.navbar-nav a[href*='${sectionId}']`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink);

  // 3. Auto Collapse Mobile Navbar on Click
  const navbarCollapse = document.getElementById('navbarNav');
  const bsCollapse = navbarCollapse ? new bootstrap.Collapse(navbarCollapse, { toggle: false }) : null;

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        bsCollapse.hide();
      }
    });
  });

  // 4. Scroll Reveal Animations via Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 5. Consultation Form Handling with Bootstrap Toast Feedback
  const consultForm = document.getElementById('consultForm');
  const consultModalEl = document.getElementById('consultModal');

  if (consultForm && consultModalEl) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple HTML5 validation check
      if (!consultForm.checkValidity()) {
        e.stopPropagation();
        consultForm.classList.add('was-validated');
        return;
      }

      // Get Form Data
      const submitBtn = consultForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Button Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang gửi...`;

      setTimeout(() => {
        // Reset Button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Hide Modal
        const modalInstance = bootstrap.Modal.getInstance(consultModalEl);
        if (modalInstance) {
          modalInstance.hide();
        }

        // Reset form
        consultForm.reset();
        consultForm.classList.remove('was-validated');

        // Show Toast Feedback
        const toastEl = document.getElementById('successToast');
        if (toastEl) {
          const toast = new bootstrap.Toast(toastEl, { delay: 5000 });
          toast.show();
        }
      }, 1000);
    });
  }
});
