export function fireConfetti() {
  const canvas = document.getElementById("csi-confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  const colors = ["#1e3a8a", "#3b82f6", "#eab308", "#fbbf24", "#10b981", "#f97316"];
  const N = 140;
  const parts = Array.from({ length: N }).map(() => ({
    x: W / 2 + (Math.random() - 0.5) * 100,
    y: H / 2 - 80 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 14 - 6,
    g: 0.35 + Math.random() * 0.2,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.3,
    life: 0,
  }));
  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    parts.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if (p.y < H + 20) alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive > 0) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  };
  tick();
}
