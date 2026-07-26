/**
 * ==========================================================================
 * ROMANTIC PROPOSAL EXPERIENCE - APPLICATION LOGIC
 * Cinematic, Elegant & Interactive Scene Controller
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. GLOBAL STATE & ELEMENT REFERENCES
  // ------------------------------------------------------------------------
  const scenes = {
    1: document.getElementById('scene-1'),
    2: document.getElementById('scene-2'),
    3: document.getElementById('scene-3'),
    4: document.getElementById('scene-4'),
  };

  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;

  const confettiCanvas = document.getElementById('confetti-canvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  const envelopeHint = document.getElementById('envelope-hint');
  const btnToScene3 = document.getElementById('btn-to-scene-3');

  const flowersGarden = document.getElementById('flowers-garden');
  const proposalBox = document.getElementById('proposal-box');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  const btnReplay = document.getElementById('btn-replay');

  let activeScene = 1;
  let bgAnimationId = null;
  let confettiAnimationId = null;
  let scene1Timer = null;
  let isEnvelopeOpen = false;

  // ------------------------------------------------------------------------
  // 2. SCENE MANAGER
  // ------------------------------------------------------------------------
  function switchScene(sceneNumber) {
    if (!scenes[sceneNumber]) return;

    // Fade out previous active scene
    if (scenes[activeScene]) {
      scenes[activeScene].classList.remove('active');
    }

    activeScene = sceneNumber;
    const targetScene = scenes[sceneNumber];
    targetScene.classList.add('active');

    // Trigger scene-specific initializers
    if (sceneNumber === 1) {
      initScene1();
    } else if (sceneNumber === 2) {
      initScene2();
    } else if (sceneNumber === 3) {
      initScene3();
    } else if (sceneNumber === 4) {
      initScene4();
    }
  }

  // ------------------------------------------------------------------------
  // 3. BACKGROUND PARTICLE ANIMATION (SCENES 1-3)
  // ------------------------------------------------------------------------
  const bgParticles = [];
  const PARTICLE_COUNT = 30;

  function initBgCanvas() {
    if (!bgCanvas || !bgCtx) return;

    function resize() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    bgParticles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      bgParticles.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        radius: Math.random() * 3 + 1,
        speedY: Math.random() * 0.4 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * 0.02,
        isHeart: Math.random() > 0.6,
      });
    }

    function renderBgParticles() {
      bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

      for (const p of bgParticles) {
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.4;
        p.opacity += Math.sin(Date.now() * 0.002) * p.pulse;

        if (p.y < -20) {
          p.y = bgCanvas.height + 20;
          p.x = Math.random() * bgCanvas.width;
        }

        bgCtx.save();
        bgCtx.globalAlpha = Math.max(0.1, Math.min(0.8, p.opacity));

        if (p.isHeart) {
          // Draw tiny ambient heart
          bgCtx.fillStyle = '#FFB7C5';
          bgCtx.beginPath();
          const topCurveHeight = p.radius * 0.3;
          bgCtx.moveTo(p.x, p.y + topCurveHeight);
          bgCtx.bezierCurveTo(
            p.x, p.y, 
            p.x - p.radius, p.y, 
            p.x - p.radius, p.y + topCurveHeight
          );
          bgCtx.bezierCurveTo(
            p.x - p.radius, p.y + (p.radius * 2), 
            p.x, p.y + (p.radius * 2.8), 
            p.x, p.y + (p.radius * 3.5)
          );
          bgCtx.bezierCurveTo(
            p.x, p.y + (p.radius * 2.8), 
            p.x + p.radius, p.y + (p.radius * 2), 
            p.x + p.radius, p.y + topCurveHeight
          );
          bgCtx.bezierCurveTo(
            p.x + p.radius, p.y, 
            p.x, p.y, 
            p.x, p.y + topCurveHeight
          );
          bgCtx.fill();
        } else {
          // Draw soft glowing particle
          bgCtx.fillStyle = '#FFD9E8';
          bgCtx.shadowColor = '#E91E63';
          bgCtx.shadowBlur = 6;
          bgCtx.beginPath();
          bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          bgCtx.fill();
        }

        bgCtx.restore();
      }

      bgAnimationId = requestAnimationFrame(renderBgParticles);
    }

    if (bgAnimationId) cancelAnimationFrame(bgAnimationId);
    renderBgParticles();
  }

  // ------------------------------------------------------------------------
  // 4. SCENE 1: LOADING TIMING LOGIC
  // ------------------------------------------------------------------------
  function initScene1() {
    if (scene1Timer) clearTimeout(scene1Timer);

    // Auto transition after 3 seconds
    scene1Timer = setTimeout(() => {
      switchScene(2);
    }, 3000);
  }

  // ------------------------------------------------------------------------
  // 5. SCENE 2: LETTER & ENVELOPE INTERACTION
  // ------------------------------------------------------------------------
  function initScene2() {
    isEnvelopeOpen = false;
    const scene2Container = document.querySelector('.scene-2-container');
    if (scene2Container) scene2Container.classList.remove('is-open');
    if (envelopeWrapper) envelopeWrapper.classList.remove('is-open');
    if (envelope) envelope.classList.remove('open');
    if (envelopeHint) {
      envelopeHint.textContent = 'Tap the envelope to open ♡';
      envelopeHint.style.opacity = '0.85';
    }
    if (btnToScene3) {
      btnToScene3.classList.remove('fade-visible');
      btnToScene3.classList.add('fade-hidden');
    }
  }

  function handleEnvelopeClick() {
    if (isEnvelopeOpen) return;
    isEnvelopeOpen = true;

    const scene2Container = document.querySelector('.scene-2-container');
    if (scene2Container) scene2Container.classList.add('is-open');
    if (envelopeWrapper) envelopeWrapper.classList.add('is-open');

    // Open flap & slide out letter
    envelope.classList.add('open');
    if (envelopeHint) envelopeHint.style.opacity = '0';

    // Fade in "Next" button after letter unfold completes
    setTimeout(() => {
      if (btnToScene3) {
        btnToScene3.classList.remove('fade-hidden');
        btnToScene3.classList.add('fade-visible');
      }
    }, 1200);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', handleEnvelopeClick);
  }

  if (btnToScene3) {
    btnToScene3.addEventListener('click', () => {
      switchScene(3);
    });
  }

  // ------------------------------------------------------------------------
  // 6. SCENE 3: BLOOMING SVG FLOWERS & PROPOSAL
  // ------------------------------------------------------------------------
  function initScene3() {
    // Hide proposal box initially
    if (proposalBox) {
      proposalBox.classList.remove('fade-visible');
      proposalBox.classList.add('fade-hidden');
    }

    // Reset NO button transform
    if (btnNo) {
      btnNo.style.transform = 'translate3d(0, 0, 0)';
    }

    // Generate growing flowers garden SVG
    renderGrowingFlowers();

    // Fade in proposal question after blooming completes (~2.4s)
    setTimeout(() => {
      if (proposalBox) {
        proposalBox.classList.remove('fade-hidden');
        proposalBox.classList.add('fade-visible');
      }
    }, 2400);
  }

  function renderGrowingFlowers() {
    if (!flowersGarden) return;
    flowersGarden.innerHTML = '';

    // Create 5 distinct organic flower SVG elements with perfectly aligned stem heads & full blooming petals
    const flowerConfigs = [
      { height: 420, delay: '0s', color1: '#FF80AB', color2: '#E91E63', innerColor: '#FFD9E8', startX: 80, startY: 500, ctrlX: 55, ctrlY: 280, headX: 85, headY: 70, leaf1Y: 340, leaf2Y: 210 },
      { height: 480, delay: '0.25s', color1: '#FFD54F', color2: '#FF80AB', innerColor: '#FFF9C4', startX: 80, startY: 500, ctrlX: 110, ctrlY: 270, headX: 75, headY: 60, leaf1Y: 350, leaf2Y: 200 },
      { height: 520, delay: '0.5s', color1: '#FF4081', color2: '#C2185B', innerColor: '#FF80AB', startX: 80, startY: 500, ctrlX: 45, ctrlY: 260, headX: 80, headY: 55, leaf1Y: 360, leaf2Y: 190 },
      { height: 460, delay: '0.75s', color1: '#F48FB1', color2: '#E91E63', innerColor: '#FCE4EC', startX: 80, startY: 500, ctrlX: 115, ctrlY: 280, headX: 80, headY: 65, leaf1Y: 340, leaf2Y: 205 },
      { height: 400, delay: '1.0s', color1: '#FF80AB', color2: '#D81B60', innerColor: '#FFE082', startX: 80, startY: 500, ctrlX: 60, ctrlY: 290, headX: 85, headY: 75, leaf1Y: 330, leaf2Y: 220 },
    ];

    flowerConfigs.forEach((cfg, idx) => {
      const flowerSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      flowerSvg.setAttribute('class', 'flower-svg-unit');
      flowerSvg.setAttribute('viewBox', '0 0 160 500');
      flowerSvg.style.height = `${cfg.height}px`;

      // Generate 8 outer petals & 8 inner petals
      let outerPetalsHtml = '';
      let innerPetalsHtml = '';
      for (let i = 0; i < 8; i++) {
        const rot = i * 45;
        outerPetalsHtml += `<ellipse cx="0" cy="-24" rx="16" ry="24" fill="url(#head-grad-${idx})" transform="rotate(${rot})" opacity="0.95" />`;
        innerPetalsHtml += `<ellipse cx="0" cy="-15" rx="12" ry="18" fill="url(#inner-grad-${idx})" transform="rotate(${rot + 22.5})" opacity="0.9" />`;
      }

      flowerSvg.innerHTML = `
        <defs>
          <linearGradient id="stem-grad-${idx}" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#2E7D32" />
            <stop offset="50%" stop-color="#4CAF50" />
            <stop offset="100%" stop-color="#81C784" />
          </linearGradient>
          <linearGradient id="head-grad-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${cfg.color1}" />
            <stop offset="100%" stop-color="${cfg.color2}" />
          </linearGradient>
          <linearGradient id="inner-grad-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${cfg.innerColor}" />
            <stop offset="100%" stop-color="${cfg.color1}" />
          </linearGradient>
          <radialGradient id="gold-core-${idx}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFF9C4" />
            <stop offset="60%" stop-color="#FFE082" />
            <stop offset="100%" stop-color="#FFA000" />
          </radialGradient>
        </defs>

        <!-- Curved Growing Stem -->
        <path class="flower-stem" d="M ${cfg.startX} ${cfg.startY} Q ${cfg.ctrlX} ${cfg.ctrlY} ${cfg.headX} ${cfg.headY}" stroke="url(#stem-grad-${idx})" stroke-width="7" fill="none" stroke-linecap="round" style="animation-delay: ${cfg.delay};" />

        <!-- Sprouting Organic Leaves -->
        <path class="flower-leaf" d="M ${cfg.ctrlX - 4} ${cfg.leaf1Y} C ${cfg.ctrlX - 32} ${cfg.leaf1Y - 18}, ${cfg.ctrlX - 42} ${cfg.leaf1Y + 18}, ${cfg.ctrlX - 4} ${cfg.leaf1Y + 12} Z" fill="#4CAF50" style="animation-delay: calc(${cfg.delay} + 0.8s);" />
        <path class="flower-leaf" d="M ${cfg.ctrlX + 4} ${cfg.leaf2Y} C ${cfg.ctrlX + 32} ${cfg.leaf2Y - 18}, ${cfg.ctrlX + 42} ${cfg.leaf2Y + 18}, ${cfg.ctrlX + 4} ${cfg.leaf2Y + 12} Z" fill="#388E3C" style="animation-delay: calc(${cfg.delay} + 1.1s);" />

        <!-- Positioned Flower Head Group (Locked to stem tip: headX, headY) -->
        <g class="flower-head-pos" transform="translate(${cfg.headX}, ${cfg.headY})">
          <!-- Animated Blooming Subgroup -->
          <g class="flower-head-bloom" style="animation-delay: calc(${cfg.delay} + 1.4s);">
            <!-- Green Connector Calyx -->
            <path d="M -10 6 C -14 -2, 14 -2, 10 6 Z" fill="#2E7D32" />
            
            <!-- Outer Petal Layer -->
            <g class="outer-petals">
              ${outerPetalsHtml}
            </g>
            <!-- Inner Petal Layer -->
            <g class="inner-petals">
              ${innerPetalsHtml}
            </g>
            <!-- Glowing Golden Core -->
            <circle cx="0" cy="0" r="14" fill="url(#gold-core-${idx})" />
            <circle cx="0" cy="0" r="15" stroke="#FFFFFF" stroke-width="1.5" opacity="0.8" />
            <!-- Stamen accents -->
            <circle cx="-5" cy="-5" r="2" fill="#FFF" opacity="0.9" />
            <circle cx="5" cy="-4" r="1.5" fill="#FFF" opacity="0.8" />
            <circle cx="0" cy="5" r="1.8" fill="#FFF" opacity="0.7" />
          </g>
        </g>
      `;

      flowersGarden.appendChild(flowerSvg);
    });
  }

  // ------------------------------------------------------------------------
  // 7. NO BUTTON ESCAPE MECHANICS
  // ------------------------------------------------------------------------
  function escapeNoButton(e) {
    if (!btnNo || !btnYes) return;

    // Prevent default touch gestures if touch triggered
    if (e && e.type === 'touchstart') {
      e.preventDefault();
    }

    const padding = 30; // Safety viewport boundary padding
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const noRect = btnNo.getBoundingClientRect();
    const yesRect = btnYes.getBoundingClientRect();

    const buttonWidth = noRect.width || 120;
    const buttonHeight = noRect.height || 50;

    // Calculate center coordinates of YES button
    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    let targetX, targetY;
    let attempts = 0;
    let isValidPosition = false;

    // Generate coordinates that stay inside screen AND stay away from YES button
    while (!isValidPosition && attempts < 50) {
      attempts++;

      targetX = padding + Math.random() * (vw - buttonWidth - padding * 2);
      targetY = padding + Math.random() * (vh - buttonHeight - padding * 2);

      const targetCenterX = targetX + buttonWidth / 2;
      const targetCenterY = targetY + buttonHeight / 2;

      // Distance from YES button center
      const distFromYes = Math.hypot(targetCenterX - yesCenterX, targetCenterY - yesCenterY);

      // Distance from pointer position if available
      let distFromPointer = 999;
      if (e) {
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        if (clientX && clientY) {
          distFromPointer = Math.hypot(targetCenterX - clientX, targetCenterY - clientY);
        }
      }

      // Valid if at least 150px away from YES button and 120px away from pointer
      if (distFromYes > 160 && distFromPointer > 120) {
        isValidPosition = true;
      }
    }

    // Fallback if random loop exhausted
    if (!isValidPosition) {
      targetX = vw - buttonWidth - padding - 20;
      targetY = padding + 20;
    }

    // Calculate offset relative to initial position in DOM container
    const currentTransform = new WebKitCSSMatrix(window.getComputedStyle(btnNo).transform);
    const currentOffsetX = currentTransform.m41 || 0;
    const currentOffsetY = currentTransform.m42 || 0;

    const deltaX = targetX - (noRect.left - currentOffsetX);
    const deltaY = targetY - (noRect.top - currentOffsetY);

    // Apply smooth animated transform
    btnNo.style.position = 'relative';
    btnNo.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
  }

  if (btnNo) {
    btnNo.addEventListener('mouseenter', escapeNoButton);
    btnNo.addEventListener('mouseover', escapeNoButton);
    btnNo.addEventListener('touchstart', escapeNoButton, { passive: false });
    btnNo.addEventListener('click', (e) => {
      e.preventDefault();
      escapeNoButton(e);
    });
  }

  // ------------------------------------------------------------------------
  // 8. YES BUTTON ACTION & SCENE 4 SURPRISE
  // ------------------------------------------------------------------------
  if (btnYes) {
    btnYes.addEventListener('click', () => {
      switchScene(4);
    });
  }

  function initScene4() {
    initConfetti();
  }

  // ------------------------------------------------------------------------
  // 9. SCENE 4 CELEBRATION CONFETTI ENGINE
  // ------------------------------------------------------------------------
  const confettiParticles = [];
  const CONFETTI_COUNT = 65;

  function initConfetti() {
    if (!confettiCanvas || !confettiCtx) return;

    function resizeConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    resizeConfetti();
    window.addEventListener('resize', resizeConfetti);

    confettiParticles.length = 0;
    const colors = ['#E91E63', '#FF4081', '#FF80AB', '#FFD9E8', '#D4AF37', '#FFF'];

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2.5 + 1.2,
        speedX: (Math.random() - 0.5) * 1.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
        isHeart: Math.random() > 0.4,
      });
    }

    function renderConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

      for (const p of confettiParticles) {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.02) * p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > confettiCanvas.height + 30) {
          p.y = -20;
          p.x = Math.random() * confettiCanvas.width;
        }

        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);

        if (p.isHeart) {
          // Render falling heart particle
          confettiCtx.fillStyle = p.color;
          confettiCtx.beginPath();
          const r = p.size / 2;
          confettiCtx.moveTo(0, r * 0.3);
          confettiCtx.bezierCurveTo(0, 0, -r, 0, -r, r * 0.3);
          confettiCtx.bezierCurveTo(-r, r * 1.2, 0, r * 1.8, 0, r * 2.2);
          confettiCtx.bezierCurveTo(0, r * 1.8, r, r * 1.2, r, r * 0.3);
          confettiCtx.bezierCurveTo(r, 0, 0, 0, 0, r * 0.3);
          confettiCtx.fill();
        } else {
          // Render golden sparkle / square particle
          confettiCtx.fillStyle = p.color;
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        confettiCtx.restore();
      }

      confettiAnimationId = requestAnimationFrame(renderConfetti);
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    renderConfetti();
  }

  // ------------------------------------------------------------------------
  // 10. REPLAY BUTTON LOGIC
  // ------------------------------------------------------------------------
  if (btnReplay) {
    btnReplay.addEventListener('click', () => {
      if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
      switchScene(1);
    });
  }

  // ------------------------------------------------------------------------
  // 11. INITIALIZATION ENTRY POINT
  // ------------------------------------------------------------------------
  initBgCanvas();
  switchScene(1);
});
