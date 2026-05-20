// Preloader script
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    document.addEventListener("DOMContentLoaded", () => {
      window.scrollTo(0, 0);
      const progressBar = document.querySelector('.preloader-progress-bar');
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (progress >= 85) {
          clearInterval(progressInterval);
        } else {
          progress += Math.floor(Math.random() * 12) + 5;
          if (progress > 85) progress = 85;
          if (progressBar) progressBar.style.width = progress + '%';
        }
      }, 100);

      window.addEventListener('load', () => {
        clearInterval(progressInterval);
        if (progressBar) progressBar.style.width = '100%';
        setTimeout(() => {
          const preloader = document.getElementById('preloader');
          if (preloader) {
            preloader.classList.add('fade-out');
            document.body.classList.remove('loading');
          }
        }, 400);
      });
      
      // Fallback in case window load doesn't fire or takes too long
      setTimeout(() => {
        clearInterval(progressInterval);
        if (progressBar) progressBar.style.width = '100%';
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
          preloader.classList.add('fade-out');
          document.body.classList.remove('loading');
        }
      }, 5000); // 5 seconds absolute max
    });

    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => obs.observe(el));

    // Form submit
    function handleSubmit(e) {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.textContent = '✦ Đã ghi nhận! Kiểm tra email của bạn';
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #2e7d32)';
      btn.style.color = '#fff';
      btn.disabled = true;
      setTimeout(() => {
        window.location.href = 'https://KAIpany.com/YTP-DaNang';
      }, 2000);
    }

    // Nav scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
      nav.style.background = window.scrollY > 60
        ? 'rgba(13,10,4,.97)'
        : 'rgba(13,10,4,.85)';
    });

    // Timeline scroll effect
    const scheduleWrap = document.querySelector('.schedule-wrap');
    if (scheduleWrap) {
      window.addEventListener('scroll', () => {
        const rect = scheduleWrap.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        let progress = (viewportCenter - rect.top) / rect.height;
        progress = Math.max(0, Math.min(1, progress));
        scheduleWrap.style.setProperty('--scroll-progress', progress);
      });
    }

    // Gallery horizontal scroll effect
    const gallerySection = document.getElementById('gallery-scroll');
    const galleryTrack = document.querySelector('.gallery-track');
    let lastScrollY = window.scrollY;
    let isBypassing = false;
    let isDragging = false;
    let startX;
    let startScrollY;
    let sectionTopScrollY;
    let sectionBottomScrollY;

    if (gallerySection && galleryTrack) {
      // --- Drag to Scroll Logic ---
      const startDrag = (e) => {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        startScrollY = window.scrollY;

        const rect = gallerySection.getBoundingClientRect();
        sectionTopScrollY = window.scrollY + rect.top;
        const scrollDistance = gallerySection.offsetHeight - window.innerHeight;
        sectionBottomScrollY = sectionTopScrollY + scrollDistance;
      };

      const moveDrag = (e) => {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault(); // Prevent native scroll & selection

        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const dx = startX - currentX; // distance moved left

        const scrollDistance = gallerySection.offsetHeight - window.innerHeight;
        const maxTranslate = galleryTrack.scrollWidth - window.innerWidth;

        if (maxTranslate > 0) {
          const ratio = scrollDistance / maxTranslate;
          let targetScrollY = startScrollY + (dx * ratio);

          // Clamp target scroll within the sticky phase
          targetScrollY = Math.max(sectionTopScrollY, Math.min(sectionBottomScrollY, targetScrollY));

          window.scrollTo({
            top: targetScrollY,
            behavior: 'instant'
          });
        }
      };

      const stopDrag = () => {
        isDragging = false;
      };

      galleryTrack.addEventListener('mousedown', startDrag);
      galleryTrack.addEventListener('touchstart', startDrag, { passive: false });

      window.addEventListener('mousemove', moveDrag, { passive: false });
      window.addEventListener('touchmove', moveDrag, { passive: false });
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);

      // --- Scroll Animation Logic ---
      window.addEventListener('scroll', () => {
        if (isBypassing) return;

        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;

        const rect = gallerySection.getBoundingClientRect();

        // Bypass horizontal scroll when scrolling UP
        if (!isDragging && !isScrollingDown && rect.top < 0 && rect.bottom > window.innerHeight) {
          isBypassing = true;
          // Instantly jump to the top of the gallery section
          window.scrollTo({
            top: currentScrollY + rect.top,
            behavior: 'instant'
          });

          // Reset track immediately
          galleryTrack.style.transform = `translate3d(0, 0, 0)`;

          setTimeout(() => {
            isBypassing = false;
            lastScrollY = window.scrollY;
          }, 50);
          return;
        }

        lastScrollY = currentScrollY;

        // The scrollable distance is the total height of the section minus the viewport height
        const scrollDistance = rect.height - window.innerHeight;
        // How far we have scrolled into the section
        const scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollDistance));

        // The maximum distance the track can be translated
        const maxTranslate = galleryTrack.scrollWidth - window.innerWidth;

        if (maxTranslate > 0) {
          galleryTrack.style.transform = `translate3d(-${scrollProgress * maxTranslate}px, 0, 0)`;
        }
      });
    }