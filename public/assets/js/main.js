/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a, button, .social-link, .article-item, .project-card, .chip, .tag, .add-video-card, input').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2.5)'; ring.style.opacity = '0'; });
  el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; ring.style.opacity = '0.5'; });
});

/* ── THEME ── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = isDark ? '☾ Dark' : '☀ Light';
}

/* ── TYPEWRITER ── */
const phrases = [
  'Construindo LLMs do zero.',
  'Fine-tuning de modelos open-source.',
  'Transformando dados em soluções.',
  'RAG pipelines de produção.',
  'Visão Computacional aplicada.',
];
let pi = 0, ci = 0, del = false;
const tw = document.getElementById('typewriter');
function typeLoop() {
  const phrase = phrases[pi];
  if (!del) {
    tw.textContent = phrase.slice(0, ++ci);
    if (ci === phrase.length) { del = true; setTimeout(typeLoop, 1800); return; }
  } else {
    tw.textContent = phrase.slice(0, --ci);
    if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeLoop, del ? 40 : 70);
}
typeLoop();

/* ── CANVAS PARTICLES ── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x = Math.random() * W;
    this.y = init ? Math.random() * H : H + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.2);
    this.alpha = 0;
    this.size = Math.random() * 1.5 + 0.5;
    this.targetAlpha = Math.random() * 0.6 + 0.2;
    this.char = Math.random() > 0.7 ? String.fromCharCode(0x30A0 + Math.random() * 96 | 0) : (Math.random() > 0.5 ? '1' : '0');
    this.isChar = Math.random() > 0.6;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.alpha = Math.min(this.alpha + 0.01, this.targetAlpha);
    if (this.y < -20) this.reset(false);
  }
  draw() {
    const theme = document.documentElement.getAttribute('data-theme');
    const color = theme === 'light' ? `rgba(0,110,168,${this.alpha})` : `rgba(0,229,255,${this.alpha})`;
    if (this.isChar) {
      ctx.font = `${this.size * 8}px JetBrains Mono, monospace`;
      ctx.fillStyle = color;
      ctx.fillText(this.char, this.x, this.y);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const theme = document.documentElement.getAttribute('data-theme');
        const a = (1 - dist / 80) * 0.08;
        ctx.strokeStyle = theme === 'light' ? `rgba(0,110,168,${a})` : `rgba(0,229,255,${a})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animCanvas);
}
animCanvas();

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ── ADD VIDEO ── */
function addVideo() {
  const id = document.getElementById('videoId').value.trim();
  const title = document.getElementById('videoTitle').value.trim() || 'Vídeo sem título';
  const desc = document.getElementById('videoDesc').value.trim() || 'Vídeo do canal';
  if (!id) { alert('Cole o ID do vídeo!'); return; }
  const card = document.createElement('div');
  card.className = 'video-card';
  card.style.animation = 'fadeUp .4s forwards';
  card.innerHTML = `
    <div class="video-embed-wrap">
      <iframe
        src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1"
        title="${title}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <div class="video-info">
      <p class="video-title">${title}</p>
      <p class="video-desc-small">${desc}</p>
    </div>
  `;
  const addCard = document.getElementById('addVideoCard');
  document.getElementById('videoGrid').insertBefore(card, addCard);
  document.getElementById('videoId').value = '';
  document.getElementById('videoTitle').value = '';
  document.getElementById('videoDesc').value = '';
}

/* ── YEAR ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── GLITCH OCCASIONAL ── */
setInterval(() => {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  h1.style.animation = 'none';
  setTimeout(() => h1.style.animation = '', 10);
}, 7000);
