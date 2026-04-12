/**
 * ArcticAir — AC Contractor Landing Page
 * main.js | GSAP Animations, Gallery Grid, Form Validation, Modals
 *
 * Modules:
 *  1. Init & GSAP Registration
 *  2. Navbar (scroll + mobile drawer)
 *  3. Hero GSAP Timeline
 *  4. Counter Animation (Stats)
 *  5. Marquee (GSAP infinite scroller)
 *  6. About Section Animations
 *  7. Services Card Animations
 *  8. Gallery Grid + Pagination
 *  9. Scroll Animations (generic)
 * 10. Contact Form + Anti-Spam + WhatsApp dispatch
 * 11. Google Maps lazy loader
 * 12. FAB scroll visibility
 * 13. Footer year
 * 14. Smooth anchor scrolling
 * 15. Modals (Privacy & Terms)
 */

/* ============================================================
   1. INIT & GSAP REGISTRATION
   ============================================================ */
(function () {
  'use strict';

  // Data galeri (edit sesuai kebutuhan)
  const galleryItems = [
    {
      img: '', // kosongkan untuk placeholder
      title: 'Pemasangan AC di Apartemen',
      desc: 'Jakarta Selatan • 2 unit 1 PK',
    },
    {
      img: '',
      title: 'Cuci AC Rumah Tinggal',
      desc: 'Tangerang • 3 unit sekaligus',
    },
    {
      img: '',
      title: 'Perbaikan AC Kantor',
      desc: 'Jakarta Pusat • AC Cassette',
    },
    {
      img: '',
      title: 'Maintenance Bulanan',
      desc: 'Bekasi • Kontrak 6 bulan',
    },
    {
      img: '',
      title: 'Instalasi AC Standing Floor',
      desc: 'Depok • Gedung Perkantoran',
    },
    {
      img: '',
      title: 'Servis AC Inverter',
      desc: 'Jakarta Barat • Perbaikan modul',
    },
    {
      img: '',
      title: 'Cuci AC + Disinfektan',
      desc: 'Tangerang Selatan • 4 unit',
    },
    {
      img: '',
      title: 'Bongkar Pasang AC',
      desc: 'Jakarta Timur • Pindahan rumah',
    },
    {
      img: '',
      title: 'Isi Freon R32',
      desc: 'Jakarta Utara • AC tidak dingin',
    },
  ];

  // Wait for GSAP to load
  window.addEventListener('DOMContentLoaded', function () {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Kick off all modules
    initNavbar();
    initHeroTimeline();
    initCounters();
    initMarquee();
    initAboutAnimations();
    initServicesAnimations();
    initGallery();                // ← ganti carousel dengan gallery grid
    initScrollAnimations();
    initContactForm();
    initMapLazyLoad();
    initFAB();
    setFooterYear();
    initSmoothAnchors();
    initModals();                 // ← modul modal baru
  });

  /* ============================================================
     2. NAVBAR — Scroll effect + Mobile Drawer
     ============================================================ */
  function initNavbar() {
    const navbar   = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = mobileMenu
      ? mobileMenu.querySelectorAll('.mobile-menu__link, .btn')
      : [];

    // Scroll shadow
    const observer = new IntersectionObserver(
      ([entry]) => navbar.classList.toggle('scrolled', !entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    const hero = document.getElementById('hero');
    if (hero) observer.observe(hero);

    // Mobile drawer toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', toggleMenu);

      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (
          !navbar.contains(e.target) &&
          mobileMenu.classList.contains('is-open')
        ) closeMenu();
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
      });
    }

    function toggleMenu() {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /* ============================================================
     3. HERO GSAP TIMELINE
     ============================================================ */
  function initHeroTimeline() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ delay: 0.15 });

    // Set initial states
    gsap.set('#hero-badge', { opacity: 0, y: -20 });
    gsap.set('#hero-sub',   { opacity: 0, y: 30 });
    gsap.set('#hero-ctas',  { opacity: 0, y: 20 });
    gsap.set('#hero-stats', { opacity: 0 });

    tl
      .to('#hero-badge', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
      .from('.hero__headline-line', {
        opacity: 0, y: 60, duration: 0.7, stagger: 0.12, ease: 'power3.out'
      }, '-=0.3')
      .to('#hero-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to('#hero-ctas', { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
      .to('#hero-stats', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.25');
  }

  /* ============================================================
     4. COUNTER ANIMATION — Hero Stats
     ============================================================ */
  function initCounters() {
    if (typeof gsap === 'undefined') return;

    const counters = document.querySelectorAll('.hero__stat-value[data-target]');
    if (!counters.length) return;

    ScrollTrigger.create({
      trigger: '#hero-stats',
      start: 'top 90%',
      once: true,
      onEnter: () => {
        counters.forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 1.8,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].innerText);
              }
            }
          );
        });
      }
    });
  }

  /* ============================================================
     5. MARQUEE — GSAP Infinite Horizontal Scroller
     ============================================================ */
  function initMarquee() {
    const inner = document.getElementById('marquee-inner');
    if (!inner) return;

    const clone = inner.cloneNode(true);
    inner.parentNode.appendChild(clone);

    if (typeof gsap === 'undefined') {
      inner.style.animation = 'marquee-scroll 20s linear infinite';
      return;
    }

    const singleWidth = inner.scrollWidth;
    gsap.set([inner, clone], { x: 0 });

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
    tl.to(inner, { x: -singleWidth, duration: 28 });
    tl.to(clone, { x: -singleWidth, duration: 28 }, 0);

    tl.set(inner, { x: 0 });
    tl.set(clone, { x: 0 });

    const wrapper = document.querySelector('.marquee-wrapper');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => tl.pause());
      wrapper.addEventListener('mouseleave', () => tl.play());
    }
  }

  /* ============================================================
     6. ABOUT SECTION — GSAP ScrollTrigger Animations
     ============================================================ */
  function initAboutAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from('#about-image', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
        once: true,
      },
      opacity: 0,
      x: -60,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('#about-copy > *', {
      scrollTrigger: {
        trigger: '#about-copy',
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      x: 40,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out'
    });

    gsap.from('.about__pillar', {
      scrollTrigger: {
        trigger: '.about__pillars',
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  /* ============================================================
     7. SERVICES CARD ANIMATIONS
     ============================================================ */
  function initServicesAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      y: 50,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  /* ============================================================
     8. GALLERY — Grid + Pagination
     ============================================================ */
  function initGallery() {
    const grid = document.getElementById('gallery-grid');
    const pagination = document.getElementById('gallery-pagination');
    if (!grid || !pagination) return;

    const itemsPerPage = window.innerWidth >= 900 ? 6 : 4; // desktop 3 kolom x 2 baris, mobile 2 kolom x 2 baris
    let currentPage = 1;
    const totalPages = Math.ceil(galleryItems.length / itemsPerPage);

    function renderPage(page) {
      const start = (page - 1) * itemsPerPage;
      const end = Math.min(start + itemsPerPage, galleryItems.length);
      const pageItems = galleryItems.slice(start, end);

      // Render cards
      grid.innerHTML = '';
      pageItems.forEach((item, index) => {
        const card = document.createElement('article');
        card.className = 'gallery__card';
        card.setAttribute('data-index', start + index);

        // Gambar (placeholder jika tidak ada URL)
        const imgHtml = item.img
          ? `<img src="${item.img}" alt="${item.title}" loading="lazy" />`
          : `<div class="gallery__card-overlay" aria-hidden="true">
               <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(56,189,248,0.4)" stroke-width="1.5">
                 <rect x="2" y="2" width="20" height="20" rx="2" />
                 <circle cx="8.5" cy="8.5" r="1.5" fill="rgba(56,189,248,0.3)" />
                 <circle cx="15.5" cy="15.5" r="1.5" fill="rgba(56,189,248,0.3)" />
                 <path d="M21 15l-5-5L5 21" stroke="rgba(56,189,248,0.4)" />
               </svg>
               <span style="margin-top: 8px; font-size: 0.75rem;">Foto Pekerjaan</span>
             </div>`;

        card.innerHTML = `
          <div class="gallery__card-img">
            ${imgHtml}
          </div>
          <div class="gallery__card-caption">
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
          </div>
        `;
        grid.appendChild(card);
      });

      // Render pagination buttons
      renderPagination(page);

      // Animasi masuk dengan GSAP (opsional)
      if (typeof gsap !== 'undefined') {
        gsap.from('.gallery__card', {
          opacity: 0,
          y: 30,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'all'
        });
      }
    }

    function renderPagination(activePage) {
      pagination.innerHTML = '';

      // Prev button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'gallery__page-btn';
      prevBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        Sebelumnya
      `;
      prevBtn.disabled = activePage === 1;
      prevBtn.addEventListener('click', () => {
        if (activePage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
      });
      pagination.appendChild(prevBtn);

      // Page numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `gallery__page-btn${i === activePage ? ' is-active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.setAttribute('aria-label', `Halaman ${i}`);
        pageBtn.addEventListener('click', () => {
          currentPage = i;
          renderPage(currentPage);
        });
        pagination.appendChild(pageBtn);
      }

      // Next button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'gallery__page-btn';
      nextBtn.innerHTML = `
        Selanjutnya
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      `;
      nextBtn.disabled = activePage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (activePage < totalPages) {
          currentPage++;
          renderPage(currentPage);
        }
      });
      pagination.appendChild(nextBtn);

      // Page info (optional)
      const info = document.createElement('span');
      info.className = 'gallery__page-info';
      info.textContent = `${activePage} / ${totalPages}`;
      pagination.appendChild(info);
    }

    // Initial render
    renderPage(currentPage);

    // Update items per page on resize (jika diperlukan)
    window.addEventListener('resize', () => {
      const newItemsPerPage = window.innerWidth >= 900 ? 6 : 4;
      if (newItemsPerPage !== itemsPerPage) {
        // Recalculate current page agar tidak kelebihan
        const newTotalPages = Math.ceil(galleryItems.length / newItemsPerPage);
        if (currentPage > newTotalPages) currentPage = newTotalPages;
        renderPage(currentPage);
      }
    });
  }

  /* ============================================================
     9. SCROLL ANIMATIONS (generic)
     ============================================================ */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Gallery section header
    gsap.from('.gallery .section-header', {
      scrollTrigger: {
        trigger: '.gallery',
        start: 'top 80%',
        once: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Contact form
    gsap.from('#contact-form-wrap', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
        once: true,
      },
      opacity: 0,
      x: -40,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('#contact-map-wrap', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 75%',
        once: true,
      },
      opacity: 0,
      x: 40,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Footer CTA
    gsap.from('.footer__cta-content', {
      scrollTrigger: {
        trigger: '.footer__cta-banner',
        start: 'top 85%',
        once: true,
      },
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out'
    });
  }

  /* ============================================================
     10. CONTACT FORM — Validation + Anti-Spam + WhatsApp
     ============================================================ */
  function initContactForm() {
    const form       = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn  = document.getElementById('submit-btn');
    const btnLock    = document.getElementById('btn-lock');
    const formSuccess = document.getElementById('form-success');
    const questionEl = document.getElementById('antispam-question');

    // State untuk soal anti-spam
    let currentCorrectAnswer = 0;

    function generateQuestion() {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      currentCorrectAnswer = a + b;
      if (questionEl) questionEl.textContent = `${a} + ${b} = ?`;
    }
    generateQuestion(); // inisialisasi awal

    const antispamInput = document.getElementById('antispam');
    const privacyCheck  = document.getElementById('privacy');

    const fields = {
      name:     { el: document.getElementById('name'),     error: document.getElementById('name-error') },
      phone:    { el: document.getElementById('phone'),    error: document.getElementById('phone-error') },
      message:  { el: document.getElementById('message'),  error: document.getElementById('message-error') },
      antispam: { el: antispamInput,                       error: document.getElementById('antispam-error') },
      privacy:  { el: privacyCheck,                        error: document.getElementById('privacy-error') },
    };

    function checkFormValidity() {
      const nameOk     = fields.name.el && fields.name.el.value.trim().length >= 2;
      const phoneOk    = fields.phone.el && isValidPhone(fields.phone.el.value.trim());
      const messageOk  = fields.message.el && fields.message.el.value.trim().length >= 10;
      const spamOk     = antispamInput && parseInt(antispamInput.value, 10) === currentCorrectAnswer;
      const privacyOk  = privacyCheck && privacyCheck.checked;

      const allOk = nameOk && phoneOk && messageOk && spamOk && privacyOk;
      submitBtn.disabled = !allOk;
      if (btnLock) btnLock.style.display = allOk ? 'none' : 'inline-flex';
      return allOk;
    }

    Object.values(fields).forEach(({ el }) => {
      if (el) {
        el.addEventListener('input', checkFormValidity);
        el.addEventListener('change', checkFormValidity);
      }
    });

    fields.name.el?.addEventListener('blur', () => validateField('name', 'Nama minimal 2 karakter.', v => v.trim().length >= 2));
    fields.phone.el?.addEventListener('blur', () => validateField('phone', 'Nomor HP tidak valid.', v => isValidPhone(v.trim())));
    fields.message.el?.addEventListener('blur', () => validateField('message', 'Pesan minimal 10 karakter.', v => v.trim().length >= 10));
    antispamInput?.addEventListener('blur', () => validateField('antispam', 'Jawaban tidak tepat.', v => parseInt(v, 10) === currentCorrectAnswer));

    function validateField(name, errorMsg, testFn) {
      const { el, error } = fields[name];
      if (!el) return false;
      const value = el.type === 'checkbox' ? el.checked.toString() : el.value;
      const isValid = testFn(value);

      el.classList.toggle('is-invalid', !isValid);
      el.classList.toggle('is-valid', isValid);
      if (error) error.textContent = isValid ? '' : errorMsg;

      return isValid;
    }

    function isValidPhone(v) {
      return /^[0-9+\-\s]{8,15}$/.test(v);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const n = validateField('name', 'Nama minimal 2 karakter.', v => v.trim().length >= 2);
      const p = validateField('phone', 'Nomor HP tidak valid.', v => isValidPhone(v.trim()));
      const m = validateField('message', 'Pesan minimal 10 karakter.', v => v.trim().length >= 10);
      const s = validateField('antispam', 'Jawaban tidak tepat.', v => parseInt(v, 10) === currentCorrectAnswer);

      if (!privacyCheck.checked) {
        fields.privacy.error.textContent = 'Anda harus menyetujui syarat & ketentuan.';
      } else {
        fields.privacy.error.textContent = '';
      }

      if (!n || !p || !m || !s || !privacyCheck.checked) return;

      const name    = fields.name.el.value.trim();
      const phone   = fields.phone.el.value.trim();
      const message = fields.message.el.value.trim();

      const waText = encodeURIComponent(
        `Halo ArcticAir! 👋\n\n` +
        `*Nama:* ${name}\n` +
        `*Telepon:* ${phone}\n\n` +
        `*Pesan:*\n${message}\n\n` +
        `_Pesan ini dikirim dari form website ArcticAir._`
      );

      const waURL = `https://wa.me/6281234567890?text=${waText}`;

      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (typeof gsap !== 'undefined') {
        gsap.from(formSuccess, { opacity: 0, y: 10, duration: 0.4, ease: 'power2.out' });
      }

      setTimeout(() => {
        window.open(waURL, '_blank', 'noopener,noreferrer');
      }, 600);

      setTimeout(() => {
        form.reset();
        generateQuestion(); // soal baru
        // Reset validasi visual
        Object.values(fields).forEach(({ el }) => {
          if (el) el.classList.remove('is-valid', 'is-invalid');
        });
        checkFormValidity();
        formSuccess.hidden = true;
      }, 5000);
    });

    checkFormValidity();
  }

  /* ============================================================
     11. GOOGLE MAPS — Lazy Loader
     ============================================================ */
  function initMapLazyLoad() {
    const mapContainer = document.getElementById('map-container');
    const loadBtn = document.getElementById('map-load-btn');
    if (!mapContainer || !loadBtn) return;

    function loadMap() {
      loadBtn.style.display = 'none';

      const iframe = document.createElement('iframe');
      iframe.setAttribute('title', 'Lokasi Kantor ArcticAir di Google Maps');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      iframe.setAttribute('width', '100%');
      iframe.setAttribute('height', '100%');
      iframe.src =
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31732.042724294508!2d107.0313821484104!3d-6.196859652601533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698f8e1762cd33%3A0x14556d92c4527b0c!2sService%20AC%20MsY%20tehnik!5e0!3m2!1sen!2sid!4v1776000934597!5m2!1sen!2sid';

      mapContainer.appendChild(iframe);

      if (typeof gsap !== 'undefined') {
        gsap.from(iframe, { opacity: 0, scale: 0.98, duration: 0.5, ease: 'power2.out' });
      }
    }

    loadBtn.addEventListener('click', loadMap);

    const mapObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          mapObserver.disconnect();
          loadMap();
        }
      },
      { rootMargin: '300px' }
    );
    mapObserver.observe(mapContainer);
  }

  /* ============================================================
     12. FAB — Show/hide based on scroll position
     ============================================================ */
  function initFAB() {
    const fab = document.getElementById('fab-wa');
    if (!fab) return;

    fab.style.opacity = '0';
    fab.style.transform = 'scale(0.7)';
    fab.style.pointerEvents = 'none';
    fab.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    let ticking = false;

    function updateFAB() {
      const scrolled = window.scrollY > 300;
      fab.style.opacity    = scrolled ? '1' : '0';
      fab.style.transform  = scrolled ? 'scale(1)' : 'scale(0.7)';
      fab.style.pointerEvents = scrolled ? 'auto' : 'none';
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateFAB);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ============================================================
     13. FOOTER YEAR
     ============================================================ */
  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================================================
     14. SMOOTH ANCHOR SCROLLING
     ============================================================ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!' || href === '') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const navbarH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-h') || '72',
          10
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navbarH - 16;

        window.scrollTo({ top, behavior: 'smooth' });

        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  /* ============================================================
     15. MODALS — Privacy & Terms
     ============================================================ */
  function initModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');

    function openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Fokus elemen pertama yang bisa difokuskan di dalam modal
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();

      // Trap focus (opsional sederhana)
      modal.addEventListener('keydown', trapFocus);
    }

    function closeModal(modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modal.removeEventListener('keydown', trapFocus);
    }

    function trapFocus(e) {
      if (e.key !== 'Tab') return;
      const modal = e.currentTarget;
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    // Event listener untuk trigger
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        openModal(modalId);
      });
    });

    // Close modal via close button, backdrop, atau tombol "Saya Mengerti/Setuju"
    modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('[data-modal-close]');
      closeButtons.forEach(btn => {
        btn.addEventListener('click', () => closeModal(modal));
      });

      // Klik backdrop juga menutup
      const backdrop = modal.querySelector('.modal__backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => closeModal(modal));
      }

      // Escape key
      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
          closeModal(modal);
        }
      });
    });
  }

})();

/* ============================================================
   GSAP MARQUEE FALLBACK CSS (injected)
   ============================================================ */
(function injectMarqueeFallbackCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  `;
  document.head.appendChild(style);
})();