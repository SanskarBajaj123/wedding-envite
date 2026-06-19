// ============ Wedding Invitation interactivity ============

// ---- Wedding date target ----
const WEDDING_DATE = new Date('2026-07-06T00:00:00+05:30');

// ---- Envelope cover open ----
const cover = document.getElementById('cover');
const bgAudio = document.getElementById('bg-audio');
let audioStarted = false;

function openEnvelope() {
  cover.classList.add('hidden');
  if (!audioStarted) {
    bgAudio.play().then(() => {
      audioStarted = true;
      updateAudioIcon(true);
    }).catch(() => { /* autoplay blocked, user can use the toggle */ });
  }
}
cover.addEventListener('click', openEnvelope);

// ---- Floating audio toggle ----
const audioToggle = document.getElementById('audio-toggle');
function updateAudioIcon(playing) {
  audioToggle.innerHTML = playing ? '&#128266;' : '&#128264;';
}
audioToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (bgAudio.paused) {
    bgAudio.play().then(() => updateAudioIcon(true)).catch(() => {});
  } else {
    bgAudio.pause();
    updateAudioIcon(false);
  }
});

// ---- Falling petals / daisies decorative animation ----
const petalField = document.getElementById('petal-field');
const PETAL_IMAGES = [
  'https://swapnil-ritu.invitationmedia.in/assets/falling-daisy-DWyrh5i3.png',
  'https://swapnil-ritu.invitationmedia.in/assets/falling-rose-petal-CzrX2ZBd.png'
];

function spawnPetal() {
  const img = document.createElement('img');
  img.className = 'petal';
  img.src = PETAL_IMAGES[Math.floor(Math.random() * PETAL_IMAGES.length)];
  const startX = Math.random() * 100;
  const duration = 8 + Math.random() * 8;
  const size = 18 + Math.random() * 18;
  img.style.left = startX + 'vw';
  img.style.width = size + 'px';
  img.style.height = size + 'px';
  img.style.animationDuration = duration + 's';
  petalField.appendChild(img);
  setTimeout(() => img.remove(), duration * 1000 + 200);
}

setInterval(spawnPetal, 900);
for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 300);

// ---- Countdown timer ----
function updateCountdown() {
  const now = new Date();
  let diff = WEDDING_DATE - now;
  if (diff < 0) diff = 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  const pad = (n) => String(n).padStart(2, '0');
  document.getElementById('cd-days').textContent = pad(days);
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent = pad(mins);
  document.getElementById('cd-secs').textContent = pad(secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Scratch-to-reveal card ----
(function setupScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const card = canvas.closest('.scratch-card');
  const hint = document.getElementById('scratch-hint');
  if (!canvas) return;

  function sizeCanvas() {
    const rect = card.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    paintScratchLayer();
  }

  function paintScratchLayer() {
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#D18C47');
    grad.addColorStop(1, '#9E662E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '600 16px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SAVE THE DATE', canvas.width / 2, canvas.height / 2);
  }

  let isDrawing = false;
  let scratchedPixels = 0;
  let revealed = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  function scratchAt(x, y) {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  function checkReveal() {
    if (revealed) return;
    scratchedPixels++;
    if (scratchedPixels > 18) {
      revealed = true;
      canvas.style.transition = 'opacity 0.6s ease';
      canvas.style.opacity = '0';
      if (hint) hint.style.opacity = '0';
      setTimeout(() => { canvas.style.display = 'none'; }, 650);
      spawnConfetti(card);
    }
  }

  function startScratch(e) {
    isDrawing = true;
    const pos = getPos(e);
    scratchAt(pos.x, pos.y);
    checkReveal();
  }
  function moveScratch(e) {
    if (!isDrawing) return;
    const pos = getPos(e);
    scratchAt(pos.x, pos.y);
    checkReveal();
  }
  function endScratch() { isDrawing = false; }

  canvas.addEventListener('mousedown', startScratch);
  canvas.addEventListener('mousemove', moveScratch);
  window.addEventListener('mouseup', endScratch);
  canvas.addEventListener('touchstart', startScratch, { passive: true });
  canvas.addEventListener('touchmove', moveScratch, { passive: true });
  canvas.addEventListener('touchend', endScratch);

  window.addEventListener('resize', sizeCanvas);
  sizeCanvas();
})();

function spawnConfetti(container) {
  const colors = ['#D18C47', '#791526', '#B62039', '#065F46', '#47296B', '#fff'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.top = '0';
    piece.style.left = (40 + Math.random() * 20) + '%';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.opacity = '0.9';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    piece.style.pointerEvents = 'none';
    piece.style.zIndex = '20';
    piece.style.transition = 'transform 1.4s ease-out, opacity 1.4s ease-out';
    container.style.position = 'relative';
    container.appendChild(piece);
    requestAnimationFrame(() => {
      const dx = (Math.random() - 0.5) * 220;
      const dy = 80 + Math.random() * 160;
      const rot = Math.random() * 720;
      piece.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      piece.style.opacity = '0';
    });
    setTimeout(() => piece.remove(), 1600);
  }
}
