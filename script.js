
(() => {
  const canvas = document.getElementById("sparkles");
  const ctx = canvas.getContext("2d");
  const petalLayer = document.getElementById("petals");
  const toggle = document.getElementById("motion-toggle");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let paused = reducedMotion;
  let width = 0;
  let height = 0;
  let particles = [];
  let frame;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = width < 700 ? 35 : 90;

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.004,
      drift: (Math.random() - 0.5) * 0.2
    }));
  }

  function sparkleLoop() {
    if (paused) return;

    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.phase += p.speed;
      p.y -= 0.12;
      p.x += p.drift;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const alpha = p.alpha *
        (0.55 + 0.45 * Math.sin(p.phase));

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,220,151,${alpha})`;
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.radius > 1.5) {
        ctx.strokeStyle = `rgba(255,230,180,${alpha * 0.5})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(p.x - 3, p.y);
        ctx.lineTo(p.x + 3, p.y);
        ctx.moveTo(p.x, p.y - 3);
        ctx.lineTo(p.x, p.y + 3);
        ctx.stroke();
      }
    }

    frame = requestAnimationFrame(sparkleLoop);
  }

  function createPetals() {
    petalLayer.innerHTML = "";

    const count = window.innerWidth < 700 ? 9 : 18;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement("span");

      petal.className = "petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.setProperty(
        "--size", `${Math.random() * 9 + 5}px`
      );
      petal.style.setProperty(
        "--duration", `${Math.random() * 15 + 15}s`
      );
      petal.style.setProperty(
        "--delay", `${Math.random() * -30}s`
      );
      petal.style.setProperty(
        "--drift", `${Math.random() * 150 - 75}px`
      );
      petal.style.setProperty(
        "--opacity", `${Math.random() * 0.3 + 0.2}`
      );

      petalLayer.appendChild(petal);
    }
  }

  function pause() {
    paused = true;
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, width, height);

    document.body.classList.add("effects-paused");
    toggle.textContent = "Resume effects";
    toggle.setAttribute("aria-pressed", "true");
  }

  function play() {
    paused = false;

    document.body.classList.remove("effects-paused");
    toggle.textContent = "Pause effects";
    toggle.setAttribute("aria-pressed", "false");

    cancelAnimationFrame(frame);
    sparkleLoop();
  }

  toggle.addEventListener("click", () => {
    paused ? play() : pause();
  });

  window.addEventListener("resize", () => {
    resize();
    createPetals();
  });

  resize();
  createPetals();

  if (reducedMotion) {
    document.body.classList.add("effects-paused");
    toggle.textContent = "Resume effects";
    toggle.setAttribute("aria-pressed", "true");
  } else {
    play();
  }
})();
