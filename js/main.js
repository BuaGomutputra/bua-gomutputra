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

// Pixel reveal: images start as blurred squares and sharpen on hover (phones: on scroll)
const hoverable = matchMedia('(hover: hover)').matches;
document.querySelectorAll('.slot img').forEach(img => {
  const slot = img.closest('.slot');
  const cv = document.createElement('canvas'); cv.className = 'px'; slot.appendChild(cv);
  const ctx = cv.getContext('2d');
  let anim, size = 28;
  const draw = block => {
    const r = slot.getBoundingClientRect(); if (!r.width || !img.naturalWidth) return;
    const W = Math.round(r.width), H = Math.round(r.height);
    cv.width = W; cv.height = H;
    const sw = Math.max(1, Math.ceil(W / block)), sh = Math.max(1, Math.ceil(H / block));
    const off = document.createElement('canvas'); off.width = sw; off.height = sh;
    const o = off.getContext('2d');
    const cs = getComputedStyle(img), iw = img.naturalWidth, ih = img.naturalHeight;
    const pos = cs.objectPosition.split(' ').map(v => v.endsWith('%') ? parseFloat(v) / 100 : (v === 'left' || v === 'top' ? 0 : v === 'right' || v === 'bottom' ? 1 : .5));
    o.fillStyle = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? cs.backgroundColor : '#ECECEC';
    o.fillRect(0, 0, sw, sh);
    if (cs.objectFit === 'contain') {
      const s = Math.min(sw / iw, sh / ih); o.drawImage(img, (sw - iw * s) * pos[0], (sh - ih * s) * (pos[1] ?? .5), iw * s, ih * s);
    } else {
      const s = Math.max(W / iw, H / ih), cw = W / s, ch = H / s;
      o.drawImage(img, (iw - cw) * pos[0], (ih - ch) * (pos[1] ?? .5), cw, ch, 0, 0, sw, sh);
    }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, sw, sh, 0, 0, sw * block, sh * block);
  };
  const ready = () => { draw(size); };
  img.complete ? ready() : img.addEventListener('load', ready);
  addEventListener('resize', () => { if (!cv.classList.contains('gone')) draw(size); });
  const reveal = () => {
    cancelAnimationFrame(anim); const steps = [16, 9, 5, 3]; let k = 0, t0 = 0;
    const tick = t => { if (!t0) t0 = t; if (t - t0 > 70) { t0 = t; if (k < steps.length) draw(steps[k++]); else { cv.classList.add('gone'); return; } } anim = requestAnimationFrame(tick); };
    anim = requestAnimationFrame(tick);
  };
  const hide = () => { cancelAnimationFrame(anim); draw(size); cv.classList.remove('gone'); };
  if (reduce) { cv.classList.add('gone'); return; }
  if (hoverable) { slot.addEventListener('mouseenter', reveal); slot.addEventListener('mouseleave', hide); slot.addEventListener('focus', reveal); slot.addEventListener('blur', hide); }
  else new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting) { setTimeout(reveal, 250); ob.unobserve(slot); } }), { threshold: .6 }).observe(slot);
});

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
