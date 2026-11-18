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

// Pixel reveal (About photo grid only): images start as blurred squares and sharpen on hover (phones: on scroll)
const hoverable = matchMedia('(hover: hover)').matches;
document.querySelectorAll('.dump .cell img').forEach(img => {
  const slot = img.closest('.cell');
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

// Project tiles: flower cursor grows into a "View <project>" pill (mouse only)
const projTiles = document.querySelectorAll('a.slot');
if (projTiles.length && matchMedia('(hover: hover)').matches) {
  document.documentElement.classList.add('has-pill');
  const pill = document.createElement('div');
  pill.className = 'cursor-pill';
  pill.innerHTML = '<svg viewBox="-4 -4 311 311" aria-hidden="true"><path transform="translate(102 0)" d="M49.2819 0L71.8746 22.7288C78.1692 29.0348 86.9605 36.9919 91.4305 44.3803C96.0707 51.9994 98.512 60.7589 98.4737 69.683C98.478 87.3768 91.3284 97.4005 79.56 109.22C69.9777 97.0646 60.0041 86.0884 49.4222 74.8432C45.5561 78.9626 40.1844 85.3597 36.2592 88.9828C11.8177 111.553 43.1403 124.037 63.8191 123.81C88.9084 123.536 106.508 102.341 131.346 102.373C151.225 102.456 160.957 111.521 174.192 124.782L190.354 141L201 151.682L177.191 175.539C171.632 181.104 164.661 188.65 158.273 192.856C152.446 196.706 145.862 199.269 138.968 200.377C126.004 202.47 112.743 199.24 102.191 191.419C109.009 173.606 112.76 156.073 97.789 139.858C88.6575 129.964 74.6094 130.805 62.1519 131.075C31.2435 131.748 -0.111982 100.387 0.000300667 69.6102C-0.00650436 60.8963 2.3225 52.3404 6.74492 44.8345C11.3664 36.9757 20.5783 28.6985 27.2204 22.0703L49.2819 0Z"/><path transform="translate(0 102)" d="M67.2974 0.101176C68.2577 0.0300902 69.2205 -0.00353713 70.1834 0.000293855C89.1224 0.147574 98.9765 8.57063 111.221 21.0328C104.972 30.205 85.3796 58.3155 96.8193 69.4194C104.613 76.9843 112.249 70.7258 120.625 68.1062C125.987 66.3865 131.573 65.4662 137.203 65.3743C154.114 65.0584 169.255 71.6707 181.276 83.4531C193.944 95.8829 201.057 112.902 200.997 130.651C201.095 139.406 198.86 148.03 194.518 155.637C189.691 164.01 179.663 173.068 172.516 180.194L151.701 201L127.481 176.831C115.199 164.572 107.356 158.357 103.255 140.486C100.979 127.725 103.251 116.78 109.533 105.653C121.124 116.375 133.652 121.798 149.56 122.728C162.598 123.49 175.649 117.398 176.036 102.846C176.219 95.9311 172.401 88.304 167.536 83.5229C162.108 78.1872 154.583 74.383 147.112 73.0265C132.783 70.2673 119.331 74.292 107.561 82.5669C102.89 85.8509 98.4402 89.7249 93.4633 92.5147C86.2104 96.5691 78.0296 98.6711 69.7207 98.6144C60.5787 98.5979 51.6211 96.0426 43.8459 91.2339C36.9433 87.0032 28.7693 78.1157 22.8403 72.1794L0 49.2965C6.61694 42.4552 13.5003 35.7425 20.2203 29.0038C34.9746 14.2077 44.6661 1.64932 67.2974 0.101176Z"/></svg><span></span>';
  document.body.appendChild(pill);
  const label = pill.querySelector('span');
  addEventListener('pointermove', e => { pill.style.transform = `translate3d(${e.clientX - 18}px, ${e.clientY - 18}px, 0)`; }, { passive: true });
  projTiles.forEach(t => {
    const name = t.querySelector('.tag b')?.textContent || t.querySelector('img')?.alt || 'project';
    t.addEventListener('pointerenter', () => { label.textContent = 'View ' + name; pill.classList.add('on'); });
    t.addEventListener('pointerleave', () => pill.classList.remove('on'));
  });
}

// Tiles bounce in as they scroll into view
const slots = document.querySelectorAll('.slot');
if (slots.length && !reduce && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-anim');
  document.querySelectorAll('.col').forEach(col => [...col.children].forEach((s, i) => s.style.transitionDelay = (i % 3) * 90 + 'ms'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); setTimeout(() => e.target.style.transitionDelay = '', 1200); } }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  slots.forEach(s => io.observe(s));
}

// Home swirls follow the mouse: they drift, tilt and stretch as you move left and right
const swL = document.querySelector('.sw-l'), swR = document.querySelector('.sw-r');
if (swL && swR && !reduce && matchMedia('(hover: hover)').matches) {
  let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', e => { tx = e.clientX / innerWidth * 2 - 1; ty = e.clientY / innerHeight * 2 - 1; }, { passive: true });
  document.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  const loop = () => {
    x += (tx - x) * .06; y += (ty - y) * .06;
    swL.style.transform = `translate(${x * -46}px, ${y * 18}px) rotate(${x * 7}deg) scale(${1 + Math.abs(x) * .06}, ${1 - Math.abs(x) * .03})`;
    swR.style.transform = `translate(${x * 60}px, ${y * -14}px) rotate(${x * -5}deg) scale(${1 + Math.abs(x) * .05}, ${1 + y * .04})`;
    requestAnimationFrame(loop);
  };
  loop();
}
