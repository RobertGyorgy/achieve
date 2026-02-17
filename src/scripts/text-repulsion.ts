import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const initTextRepulsion = () => {
  if (typeof window === "undefined") return;

  // Only run on desktop
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
  if (!isDesktop) return;

  const elements = gsap.utils.toArray(".description-reveal") as HTMLElement[];
  let isIntersecting = false;
  let scrollTrigger: gsap.core.Timeline | null = null;

  // Mouse state
  let mouseX = 0;
  let mouseY = 0;
  let mouseVX = 0; // Mouse Velocity X
  let mouseVY = 0; // Mouse Velocity Y
  let lastMouseX = 0;
  let lastMouseY = 0;

  // Physics constants
  const RADIUS = 300; // Interaction radius - increased for longer spread
  const STRENGTH = 0.8; // Force multiplier - increased for stronger effect
  const DAMPING = 0.98; // Friction (f in original)
  const RETURN_SPEED = 0.82; // Return force (T in original)
  const MAX_VELOCITY = 60; // Max velocity cap - increased for more movement
  const VELOCITY_WEIGHT = 0.3; // How much mouse velocity acts on particles (L in original)
  const MOUSE_SPEED_FACTOR = 0.00001; // (b in original)

  // Particle interface
  interface Particle {
    element: HTMLElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    ox: number; // Original X (relative)
    oy: number; // Original Y (relative)
  }

  const particles: Particle[] = [];
  const mouseHistory: { x: number; y: number; timestamp: number }[] = [];
  const HISTORY_SIZE = 5; // q in original

  const setupText = () => {
    // Split text into characters
    elements.forEach((element) => {
      if (!element) return;

      // Check if already split (look for data-split attribute or .description-reveal-split children)
      const splitElements = element.querySelectorAll(
        ".description-reveal-split"
      );

      splitElements.forEach((splitEl) => {
        if (splitEl instanceof HTMLElement && !splitEl.dataset.split) {
          const text = splitEl.textContent || "";
          // Split into characters, preserving whitespace
          const html = text
            .split("")
            .map((char) => {
              const displayChar = char === " " ? "&nbsp;" : char;
              return `<span class="hero-char" style="display: inline-block; will-change: transform;">
              <span class="reveal-wrapper" style="display: block; transform: translateY(100%); opacity: 0; will-change: transform;">
                ${displayChar}
              </span>
            </span>`;
            })
            .join("");

          splitEl.innerHTML = html;
          splitEl.dataset.split = "true";
        }
      });
    });

    // Initialize particles
    const heroChars = gsap.utils.toArray(".hero-char") as HTMLElement[];
    heroChars.forEach((char) => {
      particles.push({
        element: char,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ox: 0,
        oy: 0,
      });
    });
  };

  const updateMouseVelocity = (e: PointerEvent) => {
    if (!isIntersecting) return;

    const now = performance.now();
    // Add to history
    mouseHistory.push({ x: e.clientX, y: e.clientY, timestamp: now });
    if (mouseHistory.length > HISTORY_SIZE) mouseHistory.shift();

    // Calculate velocity based on history
    if (mouseHistory.length >= 2) {
      const first = mouseHistory[0];
      const last = mouseHistory[mouseHistory.length - 1];
      const dt = (last.timestamp - first.timestamp) / 1000;

      if (dt > 0) {
        const currentVX = (last.x - first.x) / dt;
        const currentVY = (last.y - first.y) / dt;

        // Smooth velocity
        mouseVX += (currentVX - mouseVX) * VELOCITY_WEIGHT;
        mouseVY += (currentVY - mouseVY) * VELOCITY_WEIGHT;
      }
    }

    mouseX = e.clientX;
    mouseY = e.clientY;
  };

  const physicsLoop = () => {
    if (!isIntersecting) return;

    // Calculate mouse speed magnitude
    const mouseSpeed = Math.min(
      Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY),
      MAX_VELOCITY
    );
    const speedFactor = Math.pow(mouseSpeed / 100, 1.2);
    const forceMultiplier =
      STRENGTH + speedFactor * MOUSE_SPEED_FACTOR * MAX_VELOCITY;

    particles.forEach((p) => {
      const rect = p.element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < RADIUS) {
        const force = Math.pow(1 - distance / RADIUS, 2) * forceMultiplier;

        // Direction from mouse to particle (repulsion)
        // -dx/distance is direction away from mouse X
        const dirX = -dx / distance;
        const dirY = -dy / distance;

        // Apply force based on mouse velocity influence
        if (mouseSpeed > 0) {
          // If mouse is moving, add some of its velocity to the repulsion
          // This creates a "drag" or "wake" effect
          const mouseDirX = mouseVX / mouseSpeed;
          const mouseDirY = mouseVY / mouseSpeed;

          p.vx += dirX * force + mouseDirX * force * 0.5;
          p.vy += dirY * force + mouseDirY * force * 0.5;
        } else {
          // Static repulsion
          p.vx += dirX * force;
          p.vy += dirY * force;
        }
      }

      // Return to origin (spring force)
      p.vx *= RETURN_SPEED;
      p.vy *= RETURN_SPEED;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.x *= DAMPING;
      p.y *= DAMPING;

      // Apply transform
      // Threshold to stop micro-movements
      if (
        Math.abs(p.x) < 0.1 &&
        Math.abs(p.y) < 0.1 &&
        Math.abs(p.vx) < 0.1 &&
        Math.abs(p.vy) < 0.1
      ) {
        // Optionally snap to 0 if very close, but pure damping is usually fine
        // p.element.style.transform = `translate(0px, 0px)`;
      }

      p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    // Decay mouse velocity
    mouseVX *= 0.95;
    mouseVY *= 0.95;
  };

  const showText = () => {
    elements.forEach((el) => {
      if (!el) return;

      gsap.set(el, { autoAlpha: 1 });

      const wrappers = el.querySelectorAll(".reveal-wrapper");
      // Make text visible immediately - no reveal animation
      gsap.set(wrappers, {
        y: 0,
        opacity: 1,
      });
    });
  };

  const init = () => {
    // Setup text first (split into characters)
    setupText();

    // Find the container - use the section or a specific container
    const container = document.querySelector(".intro-text-section") as HTMLElement;
    
    if (!container) {
      // Fallback: if no container, just show the text
      elements.forEach((el) => {
        if (el) {
          gsap.set(el, { autoAlpha: 1 });
          const wrappers = el.querySelectorAll(".reveal-wrapper");
          gsap.set(wrappers, { y: 0, opacity: 1 });
        }
      });
      return;
    }

    // Make text visible immediately - no reveal animation
    showText();
    
    // Start physics loop immediately
    isIntersecting = true;

    // Intersection Observer to pause physics when not looking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (!isIntersecting) {
            // Reset particles when off screen
            particles.forEach((p) => {
              p.x = 0;
              p.y = 0;
              p.vx = 0;
              p.vy = 0;
              p.element.style.transform = "translate(0px, 0px)";
            });
            mouseVX = 0;
            mouseVY = 0;
            mouseHistory.length = 0;
          }
        });
      },
      { threshold: 0, rootMargin: "50px" }
    );

    observer.observe(container);

    // Start Ticker
    gsap.ticker.add(physicsLoop);

    // Add Event Listener
    window.addEventListener("pointermove", updateMouseVelocity, {
      passive: true,
    });

    // Cleanup function
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
      gsap.ticker.remove(physicsLoop);
      window.removeEventListener("pointermove", updateMouseVelocity);
    };
  };

  // Run initialization
  if (elements.length > 0) {
    return init();
  }

  return undefined;
};

