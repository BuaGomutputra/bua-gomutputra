const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Missing images: show a labeled grey placeholder instead of a broken icon
const toPlaceholder = img => {
  if (!img.dataset.label) { img.style.display = 'none'; return; }
  const ph = document.createElement('div');
  ph.className = 'ph ' + (img.className || '');
  ph.textContent = img.dataset.label;
  if (img.style.aspectRatio) ph.style.aspectRatio = img.style.aspectRatio;
  if (img.closest('.tile')) ph.style.height = '100%';
  img.replaceWith(ph);
};
document.querySelectorAll('img[data-label]').forEach(img => {
  if (img.complete && img.naturalWidth === 0) toPlaceholder(img);
  else img.addEventListener('error', () => toPlaceholder(img));
});

// Mobile menu
const nav = document.querySelector('.nav');
document.querySelector('.menu-btn')?.addEventListener('click', () => nav.classList.toggle('open'));

// Hero line: "is a designer who" stays, the ending types itself
const typed = document.querySelector('.typer .typed');
if (typed && !reduce) {
  const ends = JSON.parse(typed.parentElement.dataset.phrases);
  let i = 0;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  (async () => {
    while (true) {
      await wait(1900);
      const box = typed.parentElement;
      box.classList.add('busy');
      for (let t = typed.textContent; t.length; t = t.slice(0, -1)) { typed.textContent = t.slice(0, -1); await wait(28); }
      i = (i + 1) % ends.length;
      await wait(300);
      for (const ch of ends[i]) { typed.textContent += ch; await wait(55 + Math.random() * 45); }
      box.classList.remove('busy');
    }
  })();
}

// Live LA clock
const clock = document.querySelector('[data-clock]');
if (clock) {
  const tick = () => clock.textContent = 'LOS ANGELES  ·  ' + new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
  tick(); setInterval(tick, 30000);
}

// Home status line: live LA time
const la = document.querySelector('[data-la]');
if (la) {
  const tick = () => la.textContent = 'LA ' + new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: 'numeric', minute: '2-digit' });
  tick(); setInterval(tick, 30000);
}

// Carousel
document.querySelectorAll('.carousel').forEach(c => {
  const track = c.querySelector('.track'), wrap = c.querySelector('.track-wrap');
  const cards = [...track.children], prev = c.querySelector('.prev'), next = c.querySelector('.next');
  const count = c.querySelector('.count'), bar = c.querySelector('.progress i');
  const step = () => cards[0].getBoundingClientRect().width + 20;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth - 2;
    const idx = Math.round(track.scrollLeft / step());
    const visible = Math.max(1, Math.round(track.clientWidth / step()));
    const first = Math.min(idx + 1, cards.length);
    count.textContent = (innerWidth < 760 ? first : `${first}–${Math.min(idx + visible, cards.length)}`) + ' / ' + cards.length + (innerWidth < 760 ? '  ·  Swipe →' : '');
    bar.style.width = Math.min(100, (idx + visible) / cards.length * 100) + '%';
    prev && (prev.disabled = track.scrollLeft < 4);
    next && (next.disabled = track.scrollLeft >= max);
    wrap.classList.toggle('end', track.scrollLeft >= max);
  };
  c.querySelectorAll('.next, .next-overlay').forEach(b => b.addEventListener('click', () => track.scrollBy({ left: step() })));
  prev?.addEventListener('click', () => track.scrollBy({ left: -step() }));
  track.addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update); update();
});

// Scroll reveals (ending animation + fade-ups)
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('seen'); io.unobserve(e.target); } }), { threshold: .3 });
document.querySelectorAll('.ending, .reveal').forEach(el => reduce ? el.classList.add('seen') : io.observe(el));
