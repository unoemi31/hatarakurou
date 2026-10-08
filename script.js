(() => {
  const slider = document.querySelector('[data-slider]');
  const slides = [...document.querySelectorAll('.slide')];
  const current = document.querySelector('[data-current]');
  const total = document.querySelector('[data-total]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');

  total.textContent = slides.length;

  const activeIndex = () => {
    const x = slider.scrollLeft + slider.clientWidth / 2;
    let best = 0;
    let distance = Infinity;
    slides.forEach((slide, i) => {
      const center = slide.offsetLeft + slide.clientWidth / 2;
      const d = Math.abs(center - x);
      if (d < distance) { distance = d; best = i; }
    });
    return best;
  };

  const go = (index) => {
    index = Math.max(0, Math.min(slides.length - 1, index));
    slides[index].scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
  };

  prev.addEventListener('click', () => go(activeIndex() - 1));
  next.addEventListener('click', () => go(activeIndex() + 1));
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(activeIndex() - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(activeIndex() + 1); }
  });

  let raf;
  slider.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => current.textContent = activeIndex() + 1);
  }, {passive:true});

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
