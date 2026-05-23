// Preloader script
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    document.addEventListener("DOMContentLoaded", () => {
      window.scrollTo(0, 0);
      const progressBar = document.querySelector('.preloader-progress-bar');
      let progress = 0;
      let isLoaded = false;
      let minTimeElapsed = false;

      // Smooth progress animation incrementing up to 90%
      const progressInterval = setInterval(() => {
        if (!isLoaded) {
          if (progress < 90) {
            progress += Math.floor(Math.random() * 4) + 1; // Smooth slower progress increments
            if (progress > 90) progress = 90;
            if (progressBar) progressBar.style.width = progress + '%';
          }
        } else if (minTimeElapsed) {
          // If both window is loaded and minimum duration elapsed
          clearInterval(progressInterval);
          if (progressBar) progressBar.style.width = '100%';
          setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
              preloader.classList.add('fade-out');
              document.body.classList.remove('loading');
            }
          }, 450);
        }
      }, 30);

      // Enforce a minimum display time of 2.2 seconds to allow the entrance motion of the poster to complete nicely
      setTimeout(() => {
        minTimeElapsed = true;
        if (isLoaded) {
          clearInterval(progressInterval);
          if (progressBar) progressBar.style.width = '100%';
          setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
              preloader.classList.add('fade-out');
              document.body.classList.remove('loading');
            }
          }, 450);
        }
      }, 2200);

      window.addEventListener('load', () => {
        isLoaded = true;
      });
      
      // Fallback in case window load doesn't fire or takes too long
      setTimeout(() => {
        isLoaded = true;
        minTimeElapsed = true;
      }, 5000); // 5 seconds absolute max fallback
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
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
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

    // Gallery vertical parallax effect
    const gallerySection = document.getElementById('gallery-vertical');
    const colLeft = document.querySelector('.col-left');
    const colCenter = document.querySelector('.col-center');
    const colRight = document.querySelector('.col-right');

    if (gallerySection && colLeft && colCenter && colRight) {
      let targetY = 0;
      let currentY = 0;
      const ease = 0.08;

      window.addEventListener('scroll', () => {
        const rect = gallerySection.getBoundingClientRect();
        const winHeight = window.innerHeight;

        // If the gallery section is visible in the viewport
        if (rect.top < winHeight && rect.bottom > 0) {
          // Calculate offset relative to viewport center
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = winHeight / 2;
          
          // Target vertical translation offset
          targetY = (sectionCenter - viewportCenter) * 0.12;
        }
      });

      const updateParallax = () => {
        if (window.innerWidth > 768) {
          // Smooth translation using lerp
          currentY += (targetY - currentY) * ease;

          // Shift left/right columns and center column in opposite directions
          colLeft.style.transform = `translate3d(0, ${currentY}px, 0)`;
          colRight.style.transform = `translate3d(0, ${currentY}px, 0)`;
          colCenter.style.transform = `translate3d(0, ${-currentY}px, 0)`;

          // Subtle internal image parallax translation inside the wrapper to add extra depth
          const items = gallerySection.querySelectorAll('.gallery-item');
          items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const winHeight = window.innerHeight;
            if (itemRect.top < winHeight && itemRect.bottom > 0) {
              const itemCenter = itemRect.top + itemRect.height / 2;
              const relativePos = (itemCenter - winHeight / 2) / (winHeight / 2);
              const img = item.querySelector('img');
              if (img) {
                // Translate image vertically slightly in opposite direction of scroll
                img.style.transform = `scale(1.15) translate3d(0, ${relativePos * -20}px, 0)`;
              }
            }
          });
        } else {
          // Clear styles on mobile devices
          colLeft.style.transform = '';
          colCenter.style.transform = '';
          colRight.style.transform = '';
          const images = gallerySection.querySelectorAll('.gallery-item img');
          images.forEach(img => {
            img.style.transform = '';
          });
        }

        requestAnimationFrame(updateParallax);
      };

      // Start the update loop
      requestAnimationFrame(updateParallax);
    }