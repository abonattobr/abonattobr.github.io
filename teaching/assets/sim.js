/* Código compartilhado pelas simulações: barra superior (lida de catalog.js), tela cheia,
   tamanho do texto e utilitários de desenho em canvas. Expõe window.Sim. */
(function () {
  const T = window.TEACHING || { courses: [] };
  const body = document.body;
  const course = T.courses.find(c => c.id === body.dataset.course);
  const topic = course && course.topics.find(t => t.id === body.dataset.topic);
  const simId = body.dataset.sim;

  // ── tamanho do texto (A− / A+), lembrado no navegador ──
  let zoom = 1;
  try { zoom = parseFloat(localStorage.getItem('teaching-zoom')) || 1; } catch (e) {}
  const applyZoom = () => {
    zoom = Math.min(1.6, Math.max(0.7, Math.round(zoom * 20) / 20));
    document.documentElement.style.setProperty('--zoom', zoom);
    try { localStorage.setItem('teaching-zoom', String(zoom)); } catch (e) {}
    window.dispatchEvent(new Event('resize'));
  };
  document.documentElement.style.setProperty('--zoom', zoom);

  // ── barra superior ──
  const bar = document.createElement('header');
  bar.className = 'topbar';
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  const tabs = topic ? topic.sims.map(s =>
    `<a href="${esc(s.slug)}.html"${s.slug === simId ? ' aria-current="page"' : ''}>${esc(s.name)}</a>`).join('') : '';
  bar.innerHTML =
    `<a class="back" href="../../../index.html#teaching">← Teaching</a>` +
    `<span class="crumb">${course ? esc(course.name) : ''}${topic ? ' › ' + esc(topic.name) : ''}</span>` +
    `<nav class="tabs" aria-label="Simulações deste tópico">${tabs}</nav>` +
    `<div class="tools">` +
      `<button type="button" id="simZoomOut" title="Diminuir o texto">A−</button>` +
      `<button type="button" id="simZoomIn" title="Aumentar o texto">A+</button>` +
      `<button type="button" id="simFull" title="Alternar tela cheia">⛶ Tela cheia</button>` +
    `</div>`;
  body.prepend(bar);
  bar.querySelector('#simZoomOut').addEventListener('click', () => { zoom -= 0.1; applyZoom(); });
  bar.querySelector('#simZoomIn').addEventListener('click', () => { zoom += 0.1; applyZoom(); });
  const fullBtn = bar.querySelector('#simFull');
  if (!document.fullscreenEnabled) fullBtn.hidden = true;
  fullBtn.addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  });
  document.addEventListener('fullscreenchange', () => {
    fullBtn.textContent = document.fullscreenElement ? '⛶ Sair da tela cheia' : '⛶ Tela cheia';
  });

  // ── utilitários ──
  const MATH = '"STIX Two Text", "Cambria Math", "Times New Roman", Times, serif';
  const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
  const rootPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  const Sim = {
    MATH, MONO,
    fmt: (v, dg = 2) => v.toLocaleString('pt-BR', { minimumFractionDigits: dg, maximumFractionDigits: dg }),
    /* Ajusta o canvas ao tamanho exibido. Devolve {w, h, k, ctx}: w,h em px CSS;
       k é a escala de textos e traços (1 quando a fonte-base é 15px). */
    size(c) {
      const dpr = window.devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return null;
      const W = Math.round(w * dpr), H = Math.round(h * dpr);
      if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
      const ctx = c.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h, k: rootPx() / 15, dpr, ctx };
    },
    /* Redesenha quando qualquer canvas muda de tamanho, a janela muda ou as fontes carregam. */
    watch(render) {
      const ro = new ResizeObserver(() => render());
      document.querySelectorAll('.cv').forEach(el => ro.observe(el));
      window.addEventListener('resize', render);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
    },
    line(ctx, x0, y0, x1, y1, color, w, dash) {
      ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = w; ctx.setLineDash(dash || []);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore();
    },
    arrowHead(ctx, x, y, ang, s, color) {
      ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x - s * Math.cos(ang - 0.4), y - s * Math.sin(ang - 0.4));
      ctx.lineTo(x - s * Math.cos(ang + 0.4), y - s * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill(); ctx.restore();
    },
    label(ctx, txt, x, y, o = {}) {
      ctx.save();
      ctx.font = (o.italic ? 'italic ' : '') + (o.size || 13) + 'px ' + (o.mono ? MONO : MATH);
      ctx.fillStyle = o.color || '#1e1c19'; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'middle';
      ctx.fillText(txt, x, y); ctx.restore();
    },
    /* Cor aproximada da luz visível de comprimento de onda w (nm), em RGB 0–255. */
    wlToRGB(w) {
      let r, g, b;
      if (w < 440) { r = -(w - 440) / 60; g = 0; b = 1; }
      else if (w < 490) { r = 0; g = (w - 440) / 50; b = 1; }
      else if (w < 510) { r = 0; g = 1; b = -(w - 510) / 20; }
      else if (w < 580) { r = (w - 510) / 70; g = 1; b = 0; }
      else if (w < 645) { r = 1; g = -(w - 645) / 65; b = 0; }
      else { r = 1; g = 0; b = 0; }
      let f = 1;
      if (w < 420) f = 0.3 + 0.7 * (w - 380) / 40; else if (w > 700) f = 0.3 + 0.7 * (780 - w) / 80;
      return [r, g, b].map(c => Math.round(255 * Math.pow(c * f, 0.8)));
    }
  };
  window.Sim = Sim;
})();
