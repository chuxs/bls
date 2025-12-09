/**
 * BLS - Best Land and Sea Services Limited
 * Website Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  initNavbar();
  initMobileMenu();
  initMobileDropdown();
  initHeroSlider();
  initScrollAnimations();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initActiveNavLink();
});

/**
 * Navbar scroll effect
 */
function initNavbar() {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking a link (but not dropdown toggle)
  const navLinks = navMenu.querySelectorAll(".nav-link:not(.dropdown-toggle)");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

/**
 * Mobile dropdown toggle
 */
function initMobileDropdown() {
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");

    if (toggle) {
      toggle.addEventListener("click", (e) => {
        // Only prevent default on mobile
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle("active");
        }
      });
    }
  });

  // Close dropdowns when clicking dropdown menu links on mobile
  const dropdownLinks = document.querySelectorAll(".dropdown-menu a");
  dropdownLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        const navToggle = document.getElementById("navToggle");
        const navMenu = document.getElementById("navMenu");
        navToggle?.classList.remove("active");
        navMenu?.classList.remove("active");
      }
    });
  });
}

/**
 * Hero Image Slider
 */
function initHeroSlider() {
  const slider = document.getElementById("heroSlider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slide");
  const dots = slider.querySelectorAll(".dot");
  const prevBtn = slider.querySelector(".slider-prev");
  const nextBtn = slider.querySelector(".slider-next");

  let currentSlide = 0;
  let autoSlideInterval;
  const slideInterval = 5000; // 5 seconds

  // Function to show a specific slide
  function showSlide(index) {
    // Handle wrap-around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  // Next slide
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // Previous slide
  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Start auto-slide
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, slideInterval);
  }

  // Stop auto-slide
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Reset auto-slide (stop and restart)
  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Event listeners for controls
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoSlide();
    });
  }

  // Event listeners for dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });
  });

  // Pause auto-slide on hover
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoSlide();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide(); // Swipe left - next slide
      } else {
        prevSlide(); // Swipe right - previous slide
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Only if slider is in viewport
    const rect = slider.getBoundingClientRect();
    const inViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (inViewport) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoSlide();
      }
    }
  });

  // Start the slider
  startAutoSlide();
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  // Add animate-on-scroll class to elements
  const animatedElements = document.querySelectorAll(
    ".stream-card, .visual-card, .operations-card, .client-logo, " +
      ".about-content, .about-visual, .operations-content, .operations-visual, " +
      ".safety-content, .safety-image, .contact-info, .contact-form-wrapper"
  );

  animatedElements.forEach((el) => {
    el.classList.add("animate-on-scroll");
  });

  // Create observer
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: Stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });

  // Stagger animation for grid items
  const staggerContainers = document.querySelectorAll(
    ".stream-grid, .clients-grid, .safety-points"
  );
  staggerContainers.forEach((container) => {
    const items = container.querySelectorAll(".animate-on-scroll");
    items.forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}

/**
 * Back to top button
 */
function initBackToTop() {
  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  const handleScroll = () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#") return;

      e.preventDefault();

      const target = document.querySelector(href);
      if (target) {
        const navbarHeight =
          document.getElementById("navbar")?.offsetHeight || 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Update active nav link based on scroll position
 */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length === 0 || navLinks.length === 0) return;

  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * Contact form handling
 */
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Simulate form submission (replace with actual API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      showNotification(
        "Message sent successfully! We'll get back to you soon.",
        "success"
      );
      form.reset();
    } catch (error) {
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

/**
 * Show notification toast
 */
function showNotification(message, type = "success") {
  // Remove existing notification
  const existing = document.querySelector(".notification");
  if (existing) {
    existing.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </button>
    `;

  // Add styles
  const styles = document.createElement("style");
  styles.textContent = `
        .notification {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 16px;
            font-size: 0.9375rem;
            font-weight: 500;
            z-index: 9999;
            animation: slideUp 0.3s ease forwards;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }
        .notification-success {
            background: #10B981;
            color: white;
        }
        .notification-error {
            background: #EF4444;
            color: white;
        }
        .notification-close {
            background: none;
            border: none;
            padding: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notification-close svg {
            width: 18px;
            height: 18px;
            color: white;
            opacity: 0.8;
        }
        .notification-close:hover svg {
            opacity: 1;
        }
        @keyframes slideUp {
            to {
                transform: translateX(-50%) translateY(0);
            }
        }
        @keyframes slideDown {
            to {
                transform: translateX(-50%) translateY(100px);
                opacity: 0;
            }
        }
    `;

  document.head.appendChild(styles);
  document.body.appendChild(notification);

  // Close button functionality
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.style.animation = "slideDown 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    });

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideDown 0.3s ease forwards";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/**
 * Counter animation for stats
 */
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.round(start + (target - start) * easeOutQuart);

    element.textContent = current + (element.dataset.suffix || "");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  };

  requestAnimationFrame(updateCounter);
}

// Initialize counter animations when stats come into view
document.addEventListener("DOMContentLoaded", () => {
  const stats = document.querySelectorAll(
    ".stat-number, .ops-number, .badge-number"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = "true";
          const text = entry.target.textContent;
          const match = text.match(/(\d+)/);
          if (match) {
            const target = parseInt(match[1]);
            const suffix = text.replace(/\d+/, "");
            entry.target.dataset.suffix = suffix;
            animateCounter(entry.target, target);
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
});
