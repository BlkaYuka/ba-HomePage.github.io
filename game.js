const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const restartBtn = document.getElementById('restart');

const DPR = Math.min(2, window.devicePixelRatio || 1);

// Resize for crisp rendering on HiDPI
function fitCanvas() {
  const maxW = Math.min(960, window.innerWidth - 32);
  const ratio = 960 / 540;
  const targetW = Math.max(320, maxW);
  const targetH = targetW / ratio;
  canvas.style.width = targetW + 'px';
  canvas.style.height = targetH + 'px';
  canvas.width = Math.floor(targetW * DPR);
  canvas.height = Math.floor(targetH * DPR);
}
fitCanvas();
window.addEventListener('resize', fitCanvas);

// Game state
let running = false;
let timeLeft = 30; // seconds
let score = 0;
let targets = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

function spawnTarget() {
  const size = rand(26, 46) * DPR;
  const margin = 12 * DPR + size;
  const x = rand(margin, canvas.width - margin);
  const y = rand(margin, canvas.height - margin);
  const ttl = rand(0.9, 1.6); // seconds
  const hue = Math.floor(rand(185, 210));
  targets.push({ x, y, r: size, born: performance.now(), ttl, hue });
}

function start() {
  score = 0;
  timeLeft = 30;
  running = true;
  targets = [];
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  lastSpawn = 0;
  lastTick = performance.now();
  loop();
}

let lastTick = 0;
let lastSpawn = 0;
function loop(ts) {
  if (!running) return;
  const now = performance.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;

  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Background flair
  const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
  grad.addColorStop(0, 'rgba(85, 193, 255, 0.05)');
  grad.addColorStop(1, 'rgba(139, 224, 255, 0.04)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // Spawn targets periodically
  if (now - lastSpawn > 450) {
    lastSpawn = now;
    if (targets.length < 5) spawnTarget();
  }

  // Update & draw targets
  const alive = [];
  for (const t of targets) {
    const age = (now - t.born) / 1000;
    const life = Math.max(0, 1 - age / t.ttl);
    if (life <= 0) continue;
    alive.push(t);

    // Pulse size
    const r = t.r * (0.9 + 0.1 * Math.sin(age * 10));

    // Circle
    ctx.beginPath();
    ctx.arc(t.x, t.y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = `hsla(${t.hue}, 90%, 60%, ${0.6 + 0.3*life})`;
    ctx.fill();
    ctx.lineWidth = 2 * DPR;
    ctx.strokeStyle = `hsla(${t.hue}, 95%, 75%, ${0.9})`;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(t.x, t.y, r*0.25, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();
  }
  targets = alive;

  // Timer
  timeLeft -= dt;
  if (timeLeft <= 0) {
    running = false;
    timeEl.textContent = '0';
    drawGameOver();
    return;
  }
  timeEl.textContent = Math.ceil(timeLeft);

  requestAnimationFrame(loop);
}

function drawGameOver(){
  ctx.save();
  ctx.fillStyle = 'rgba(7,16,33,0.6)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#e7ecf7';
  ctx.textAlign = 'center';
  ctx.font = `${36*DPR}px system-ui, sans-serif`;
  ctx.fillText('게임 종료!', canvas.width/2, canvas.height/2 - 20*DPR);
  ctx.font = `${22*DPR}px system-ui, sans-serif`;
  ctx.fillText(`점수: ${score}`, canvas.width/2, canvas.height/2 + 14*DPR);
  ctx.restore();
}

canvas.addEventListener('click', (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  for (let i = targets.length - 1; i >= 0; i--) {
    const t = targets[i];
    const dx = x - t.x, dy = y - t.y;
    if (dx*dx + dy*dy <= t.r*t.r) {
      targets.splice(i, 1);
      score += 1;
      scoreEl.textContent = score;
      spawnBurst(t.x, t.y, t.hue);
      break;
    }
  }
});

function spawnBurst(x, y, hue) {
  // Simple burst particles
  const n = 10;
  const parts = [];
  for (let i=0;i<n;i++) {
    parts.push({
      x, y,
      vx: (Math.random()*2-1) * 180 * DPR,
      vy: (Math.random()*2-1) * 180 * DPR,
      life: 0.4,
      hue
    });
  }
  const start = performance.now();
  function anim(){
    const now = performance.now();
    const dt = (now - (anim._last||now))/1000; anim._last = now;
    parts.forEach(p => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 0.96; p.vy *= 0.96;
    });
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    parts.forEach(p => {
      if (p.life <= 0) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3*DPR, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 95%, 70%, ${p.life})`;
      ctx.fill();
    });
    ctx.restore();
    if (parts.some(p => p.life > 0) && running) requestAnimationFrame(anim);
  }
  anim();
}

restartBtn.addEventListener('click', start);

// Auto start on load
start();

