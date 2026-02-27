import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('featured-work-container');
  if (!container) return;

  const cards = gsap.utils.toArray('#featured-work-container .featured-card') as HTMLElement[];
  if (cards.length < 2) return;

  const masks = gsap.utils.toArray('.js-transition-mask .mask-slice') as HTMLElement[];
  const mobileFills = gsap.utils.toArray('.mobile-btn-progress-fill') as HTMLElement[];
  const mobileBtns = gsap.utils.toArray('.mobile-view-work-btn') as HTMLElement[];
  const tooltip = document.getElementById('view-project-tooltip');
  const tooltipBg = tooltip?.querySelector('.tooltip-bg');
  
  // State
  let currentIndex = 0;
  let isAnimating = false;

  // Initial Setup
  cards.forEach((card, i) => {
    const content = card.querySelector('.card-content');
    const video = card.querySelector('video');
    const mobileBtn = mobileBtns[i];
    
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
      if (video) video.pause();
      if (mobileBtn) gsap.set(mobileBtn, { opacity: 0, y: 20 });
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      if (mobileBtn) gsap.set(mobileBtn, { opacity: 1, y: 0 });
    }
  });

  // Cursor Tooltip Movement
  if (tooltip) {
    // Ensure it's in body for stacking context
    document.body.appendChild(tooltip);

    const moveTooltip = (e: MouseEvent) => {
      gsap.to(tooltip, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none',
        overwrite: 'auto'
      });
    };

    container.addEventListener('mousemove', moveTooltip);

    container.addEventListener('mouseenter', (e: MouseEvent) => {
      // Instantly position tooltip at cursor before fading in
      gsap.set(tooltip, { x: e.clientX, y: e.clientY });
      gsap.to(tooltip, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(tooltip, { opacity: 0, scale: 0, duration: 0.3, ease: 'power2.in' });
    });
  }


  const gotoSlide = (index: number, direction: 'next' | 'prev') => {
    if (index < 0 || index >= cards.length || isAnimating || index === currentIndex) return;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');
    const currentVideo = currentCard.querySelector('video') as HTMLVideoElement;
    const nextVideo = nextCard.querySelector('video') as HTMLVideoElement;
    const currentMobileBtn = mobileBtns[currentIndex];
    const nextMobileBtn = mobileBtns[index];

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
      }
    });

    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });

    // Wipe IN
    tl.to(masks, {
      scaleX: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    // SWAP
    tl.add(() => {
      gsap.set(currentCard, { opacity: 0, pointerEvents: 'none' });
      gsap.set(nextCard, { opacity: 1, pointerEvents: 'auto' });
      
      if (currentMobileBtn) gsap.to(currentMobileBtn, { opacity: 0, duration: 0.3 });
      if (nextMobileBtn) gsap.to(nextMobileBtn, { opacity: 1, y: 0, duration: 0.3 });

      if (currentVideo) currentVideo.pause();
      if (nextVideo) {
        nextVideo.currentTime = 0;
        nextVideo.play().catch(() => {});
      }
    });

    if (currentContent) {
      tl.to(currentContent, { 
        opacity: 0, 
        y: direction === 'next' ? -30 : 30, 
        duration: 0.3 
      }, 0);
    }

    tl.set(masks, { transformOrigin: direction === 'next' ? 'right' : 'left' });

    // Wipe OUT
    tl.to(masks, {
      scaleX: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    if (nextContent) {
      tl.fromTo(nextContent, 
        { opacity: 0, y: direction === 'next' ? 30 : -30 }, 
        { opacity: 1, y: 0, duration: 0.3 }, 
        "-=0.4"
      );
    }
  };

  // Create a master scrubbed timeline for the progress bars
  // Extra +100% at the end for the parallax exit (scale/blur/fade)
  const progressTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${cards.length * 150 + 100}%`,
      pin: true,
      anticipatePin: 1,
      scrub: true,
      id: 'featured-work-scroll'
    }
  });

  // Build the progress timeline
  cards.forEach((_, i) => {
    const mobileFill = mobileFills[i];

    // Each project has its own progress segment
    const segmentTl = gsap.timeline({
      onStart: () => {
        if (currentIndex !== i) {
          gotoSlide(i, i > currentIndex ? 'next' : 'prev');
        }
      },
      onReverseComplete: () => {
        if (i > 0 && currentIndex !== i - 1) {
          gotoSlide(i - 1, 'prev');
        }
      }
    });

    // RESET: Ensure the single tooltip fill resets when a new segment starts
    if (tooltipBg) segmentTl.set(tooltipBg, { scaleX: 0 }, 0);
    if (mobileFill) segmentTl.set(mobileFill, { scaleX: 0 }, 0);

    // FILL: Animate the same tooltip bg for every project
    if (tooltipBg) {
      segmentTl.to(tooltipBg, { scaleX: 1, ease: 'none', duration: 1 }, 0);
    }
    if (mobileFill) {
      segmentTl.to(mobileFill, { scaleX: 1, ease: 'none', duration: 1 }, 0);
    }

    progressTl.add(segmentTl);
    
    // Add spacer
    if (i < cards.length - 1) {
      progressTl.to({}, { duration: 0.1 });
    }
  });

  // === PARALLAX EXIT: scale/blur/fade while still pinned ===
  // This fills the extra +100% scroll distance added to the main pin.
  // After this, the pin releases and Services (z-20, solid bg) appears from below.
  progressTl.to(container, {
    scale: 0.92,
    filter: 'blur(6px)',
    opacity: 0.4,
    duration: 1,
    ease: 'power2.in',
    force3D: true,
  });
};
