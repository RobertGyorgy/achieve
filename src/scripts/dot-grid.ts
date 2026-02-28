/**
 * DotGrid — Interactive canvas dot grid with mouse proximity coloring,
 * velocity-based push, and click shockwave.
 *
 * Converted from a React component to vanilla TypeScript for Astro.
 * Uses standard GSAP tweens (no InertiaPlugin needed).
 */

import gsap from 'gsap';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Dot {
  cx: number;
  cy: number;
  xOffset: number;
  yOffset: number;
  _pushed: boolean;
  _returning: boolean;
}

interface Pointer {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  lastTime: number;
  lastX: number;
  lastY: number;
}

export interface DotGridOptions {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

function throttle<T extends (...args: any[]) => void>(fn: T, limit: number): T {
  let lastCall = 0;
  return function (this: any, ...args: any[]) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  } as T;
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

/**
 * Initialise an interactive dot-grid on the given `<canvas>`.
 *
 * @param canvas  The `<canvas>` element to draw on.
 * @param wrapper The parent element whose dimensions define the grid area.
 * @param opts    Optional configuration overrides.
 * @returns A cleanup function that removes all listeners and stops rendering.
 */
export function initDotGrid(
  canvas: HTMLCanvasElement,
  wrapper: HTMLElement,
  opts: DotGridOptions = {},
) {
  const {
    dotSize = 5,
    gap = 50,
    baseColor = '#C8BEB4',
    activeColor = '#ff4500',
    proximity = 120,
    speedTrigger = 100,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000,
    resistance = 750,
    returnDuration = 1.5,
  } = opts;

  const baseRgb = hexToRgb(baseColor);
  const activeRgb = hexToRgb(activeColor);

  let dots: Dot[] = [];
  let rafId = 0;
  let currentDpr = 1;

  // Pre-build a reusable circle path for faster fills.
  let circlePath: Path2D | null = null;
  if (typeof Path2D !== 'undefined') {
    circlePath = new Path2D();
    circlePath.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
  }

  const pointer: Pointer = {
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  };

  /* ----- Grid construction ----- */

  function buildGrid() {
    const { width, height } = wrapper.getBoundingClientRect();
    currentDpr = window.devicePixelRatio || 1;

    canvas.width = width * currentDpr;
    canvas.height = height * currentDpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;
    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    const newDots: Dot[] = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        newDots.push({
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _pushed: false,
          _returning: false,
        });
      }
    }
    dots = newDots;
  }

  /* ----- Render loop ----- */

  const proxSq = proximity * proximity;

  function draw() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset transform, clear, then apply DPR scale — avoids compounding ctx.scale()
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);

    const px = pointer.x;
    const py = pointer.y;

    for (let i = 0, len = dots.length; i < len; i++) {
      const dot = dots[i];
      const ox = dot.cx + dot.xOffset;
      const oy = dot.cy + dot.yOffset;

      // Distance from pointer (use home position, not offset position)
      const dx = dot.cx - px;
      const dy = dot.cy - py;
      const dsq = dx * dx + dy * dy;

      let fill = baseColor;
      if (dsq <= proxSq) {
        const dist = Math.sqrt(dsq);
        const t = 1 - dist / proximity;
        const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
        const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
        const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
        fill = `rgb(${r},${g},${b})`;
      }

      ctx.save();
      ctx.translate(ox, oy);
      ctx.fillStyle = fill;
      if (circlePath) {
        ctx.fill(circlePath);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  /* ----- Push helpers (simulates InertiaPlugin with standard tweens) ----- */

  /**
   * Simulate InertiaPlugin: velocityX/Y are initial velocities (px/s).
   * Final displacement ≈ v * |v| / (2 * resistance).
   * The dot coasts to a stop, then springs back elastically.
   */
  function pushDot(dot: Dot, velocityX: number, velocityY: number) {
    dot._pushed = true;
    dot._returning = false;
    gsap.killTweensOf(dot);

    // Kinematic displacement: d = v² / (2a), preserve sign
    const targetX = (velocityX * Math.abs(velocityX)) / (2 * resistance);
    const targetY = (velocityY * Math.abs(velocityY)) / (2 * resistance);

    // Duration proportional to initial speed — faster push = longer coast
    const speed = Math.hypot(velocityX, velocityY);
    const coastDuration = Math.min(1.2, Math.max(0.15, speed / (resistance * 1.5)));

    gsap.to(dot, {
      xOffset: targetX,
      yOffset: targetY,
      duration: coastDuration,
      ease: 'power3.out',
      onComplete: () => {
        dot._returning = true;
        gsap.to(dot, {
          xOffset: 0,
          yOffset: 0,
          duration: returnDuration,
          ease: 'elastic.out(1,0.75)',
          onComplete: () => {
            dot._pushed = false;
            dot._returning = false;
          },
        });
      },
    });
  }

  /* ----- Event handlers ----- */

  function onMove(e: MouseEvent) {
    const now = performance.now();
    const dt = pointer.lastTime ? now - pointer.lastTime : 16;
    const dxMouse = e.clientX - pointer.lastX;
    const dyMouse = e.clientY - pointer.lastY;

    let vx = (dxMouse / dt) * 1000;
    let vy = (dyMouse / dt) * 1000;
    let speed = Math.hypot(vx, vy);

    if (speed > maxSpeed) {
      const s = maxSpeed / speed;
      vx *= s;
      vy *= s;
      speed = maxSpeed;
    }

    pointer.lastTime = now;
    pointer.lastX = e.clientX;
    pointer.lastY = e.clientY;
    pointer.vx = vx;
    pointer.vy = vy;
    pointer.speed = speed;

    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;

    // Velocity-based push — match original InertiaPlugin formula:
    // pushVelocity = (dot position - cursor) + cursor velocity contribution
    if (speed > speedTrigger) {
      for (let i = 0, len = dots.length; i < len; i++) {
        const dot = dots[i];
        // Allow re-push if the dot is returning (elastic phase)
        if (dot._pushed && !dot._returning) continue;

        const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
        if (dist < proximity) {
          // Original formula: direction away from cursor + velocity contribution
          const pushVx = dot.cx - pointer.x + vx * 0.005;
          const pushVy = dot.cy - pointer.y + vy * 0.005;
          pushDot(dot, pushVx, pushVy);
        }
      }
    }
  }

  function onClick(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    for (let i = 0, len = dots.length; i < len; i++) {
      const dot = dots[i];
      if (dot._pushed) continue;

      const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
      if (dist < shockRadius) {
        const falloff = Math.max(0, 1 - dist / shockRadius);
        // Original formula: direction * strength * falloff → treated as velocity
        const pushVx = (dot.cx - cx) * shockStrength * falloff;
        const pushVy = (dot.cy - cy) * shockStrength * falloff;
        pushDot(dot, pushVx, pushVy);
      }
    }
  }

  /* ----- Bootstrap ----- */

  buildGrid();
  draw();

  const throttledMove = throttle(onMove, 16);
  window.addEventListener('mousemove', throttledMove, { passive: true });
  window.addEventListener('click', onClick);

  // Resize handling
  let ro: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(buildGrid);
    ro.observe(wrapper);
  } else {
    window.addEventListener('resize', buildGrid);
  }

  /* ----- Cleanup ----- */

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('mousemove', throttledMove);
    window.removeEventListener('click', onClick);
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', buildGrid);
  };
}
