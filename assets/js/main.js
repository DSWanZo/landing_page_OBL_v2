(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  const scrollTop = document.querySelector('.scroll-top');

  if (scrollTop) {
    const toggleScrollTop = () => {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    };

    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('load', toggleScrollTop);
    document.addEventListener('scroll', toggleScrollTop);
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      startEvent: 'DOMContentLoaded',
      disable: false,
      anchorPlacement: 'top-bottom',
      offset: 120
    });

    // Force immediate refresh to ensure visible elements animate on page load
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }

  // Initialize AOS as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aosInit);
  } else {
    aosInit();
  }

  // Additional refresh on full page load to catch any late-loading elements
  window.addEventListener('load', () => {
    AOS.refresh();
  });

  // Reset scroll position and refresh AOS when navigating to page (including from cache)
  window.addEventListener('pageshow', (event) => {
    // If page is loaded from bfcache (back-forward cache), refresh AOS
    if (event.persisted) {
      window.scrollTo(0, 0);
      AOS.refresh();
    }
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /*
   * Pricing Toggle
   */

  const pricingContainers = document.querySelectorAll('.pricing-toggle-container');

  pricingContainers.forEach(function(container) {
    const pricingSwitch = container.querySelector('.pricing-toggle input[type="checkbox"]');
    const monthlyText = container.querySelector('.monthly');
    const yearlyText = container.querySelector('.yearly');
    const pricingItems = container.querySelectorAll('.pricing-item');

    const updatePricingDisplay = (showYearly) => {
      if (showYearly) {
        yearlyText.classList.add('active');
        monthlyText.classList.remove('active');
        pricingItems.forEach(item => {
          item.classList.add('yearly-active');
        });
      } else {
        yearlyText.classList.remove('active');
        monthlyText.classList.add('active');
        pricingItems.forEach(item => {
          item.classList.remove('yearly-active');
        });
      }
    };

    updatePricingDisplay(pricingSwitch.checked);

    pricingSwitch.addEventListener('change', function() {
      updatePricingDisplay(this.checked);
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Simple image viewer toggles
   */
  document.querySelectorAll('[data-image-viewer]').forEach((viewer) => {
    const slides = Array.from(viewer.querySelectorAll('[data-image-viewer-slide]'));
    if (!slides.length) {
      return;
    }

    let currentIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
    if (currentIndex === -1) {
      currentIndex = 0;
    }
    const prevButton = viewer.querySelector('[data-image-viewer-prev]');
    const nextButton = viewer.querySelector('[data-image-viewer-next]');
    const controls = viewer.querySelectorAll('[data-image-viewer-prev], [data-image-viewer-next]');

    const updateViewerHeight = () => {
      const activeSlide = slides[currentIndex];
      if (activeSlide && activeSlide.complete) {
        viewer.style.height = `${activeSlide.offsetHeight}px`;
      }
    };

    const syncSlides = () => {
      slides.forEach((slide, index) => {
        const isActive = index === currentIndex;

        if (isActive) {
          // Show the slide immediately by removing hidden attribute
          slide.removeAttribute('hidden');
          // Use requestAnimationFrame to ensure the transition triggers smoothly
          requestAnimationFrame(() => {
            slide.classList.add('is-active');
            updateViewerHeight();
          });
        } else {
          // Remove active class to trigger fade out
          slide.classList.remove('is-active');
          // Wait for transition to complete before hiding (300ms to match CSS)
          setTimeout(() => {
            slide.setAttribute('hidden', '');
          }, 300); // Match the CSS transition duration
        }
      });
    };

    const setActiveSlide = (newIndex) => {
      currentIndex = (newIndex + slides.length) % slides.length;
      syncSlides();
    };

    // Initialize height when images are loaded
    slides.forEach((slide) => {
      if (slide.complete) {
        updateViewerHeight();
      } else {
        slide.addEventListener('load', () => {
          if (slides[currentIndex] === slide) {
            updateViewerHeight();
          }
        });
      }
    });

    syncSlides();

    if (slides.length <= 1) {
      controls.forEach((control) => control.setAttribute('hidden', ''));
      return;
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        setActiveSlide(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        setActiveSlide(currentIndex + 1);
      });
    }
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();