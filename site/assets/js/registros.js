// Galeria da página Registros: filtros animados, entrada escalonada e lightbox.
// As fotos e legendas vêm direto do HTML, então só é preciso editar a lista lá.
(function () {
  const gallery = document.querySelector('.gallery');
  const lightbox = document.getElementById('lightbox');
  if (!gallery || !lightbox) return;

  const items = Array.from(gallery.querySelectorAll('li'));
  const chips = Array.from(document.querySelectorAll('.filters .chip'));

  const lbImg = lightbox.querySelector('img');
  const lbTitle = lightbox.querySelector('figcaption strong');
  const lbDesc = lightbox.querySelector('figcaption span');
  const lbCount = lightbox.querySelector('.lightbox-count');
  const btnClose = lightbox.querySelector('.lightbox-close');
  const btnPrev = lightbox.querySelector('.lightbox-prev');
  const btnNext = lightbox.querySelector('.lightbox-next');

  let visible = items;
  let current = 0;
  let lastFocus = null;

  // ---- Count badges on filter chips ----
  function countCategory(filter) {
    if (filter === 'all') return items.length;
    return items.filter(function (li) {
      return (li.dataset.category || '').split(' ').includes(filter);
    }).length;
  }

  chips.forEach(function (chip) {
    var count = countCategory(chip.dataset.filter);
    var badge = document.createElement('span');
    badge.className = 'chip-count';
    badge.textContent = count;
    badge.setAttribute('aria-label', count + ' fotos');
    chip.appendChild(badge);
  });

  // ---- Staggered entry animation on scroll ----
  var staggerObserver = new IntersectionObserver(function (entries) {
    var delay = 0;
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var li = entry.target;
        setTimeout(function () {
          li.classList.add('is-visible');
        }, delay);
        delay += 80;
        staggerObserver.unobserve(li);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px 60px 0px' });

  items.forEach(function (li) {
    staggerObserver.observe(li);
  });

  // ---- Animated filter transitions ----
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = chip.dataset.filter;
      chips.forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === chip));
      });

      // Determine which items should show/hide
      var toHide = [];
      var toShow = [];

      items.forEach(function (li) {
        var cats = (li.dataset.category || '').split(' ');
        var shouldShow = filter === 'all' || cats.includes(filter);

        if (!shouldShow && !li.hidden) {
          toHide.push(li);
        } else if (shouldShow && li.hidden) {
          toShow.push(li);
        }
      });

      // Animate out items being hidden
      toHide.forEach(function (li) {
        li.classList.add('is-hiding');
        li.classList.remove('is-visible', 'is-showing');
      });

      // After hide animation, actually hide and show new items
      var hideDelay = toHide.length > 0 ? 300 : 0;
      setTimeout(function () {
        toHide.forEach(function (li) {
          li.hidden = true;
          li.classList.remove('is-hiding');
        });

        // Show matching items with staggered animation
        toShow.forEach(function (li, i) {
          li.hidden = false;
          li.classList.remove('is-visible');
          setTimeout(function () {
            li.classList.add('is-showing', 'is-visible');
          }, i * 60);
        });

        // Items that were already visible and should stay
        items.forEach(function (li) {
          var cats = (li.dataset.category || '').split(' ');
          var shouldShow = filter === 'all' || cats.includes(filter);
          if (shouldShow && !toShow.includes(li)) {
            li.hidden = false;
            li.classList.add('is-visible');
          }
        });

        visible = items.filter(function (li) { return !li.hidden; });
      }, hideDelay);
    });
  });

  // ---- Lightbox ----
  var show = function (index) {
    current = (index + visible.length) % visible.length;
    var button = visible[current].querySelector('.gallery-item');
    var thumb = button.querySelector('img');
    lbImg.src = button.dataset.full;
    lbImg.alt = thumb.alt;
    lbTitle.textContent = button.querySelector('strong').textContent;
    lbDesc.textContent = button.querySelector('.gallery-caption span').textContent;
    lbCount.textContent = (current + 1) + ' de ' + visible.length;
  };

  var open = function (index, trigger) {
    lastFocus = trigger;
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  };

  var close = function () {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  items.forEach(function (li) {
    var button = li.querySelector('.gallery-item');
    button.addEventListener('click', function () {
      open(visible.indexOf(li), button);
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) close();
  });

  document.addEventListener('keydown', function (event) {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'Tab') {
      var focusables = [btnClose, btnPrev, btnNext];
      var idx = focusables.indexOf(document.activeElement);
      event.preventDefault();
      var next = event.shiftKey ? idx - 1 : idx + 1;
      focusables[(next + focusables.length) % focusables.length].focus();
    }
  });
})();
