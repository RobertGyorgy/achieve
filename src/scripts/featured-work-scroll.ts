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
  const tooltipFills = gsap.utils.toArray('.tooltip-progress-fill') as HTMLElement[];
  const mobileFills = gsap.utils.toArray('.mobile-btn-progress-fill') as HTMLElement[];
  const mobileBtns = gsap.utils.toArray('.mobile-view-work-btn') as HTMLElement[];
  const tooltip = document.getElementById('cursor-tooltip');
  
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
      if (mobileBtn) gsap.set(mobileBtn, { display: 'none', opacity: 0, y: 20 });
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      if (mobileBtn) gsap.set(mobileBtn, { display: 'inline-flex', opacity: 1, y: 0 });
    }
  });

  // Cursor Tooltip Movement
  if (tooltip) {
    container.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      gsap.to(tooltip, {
        x: clientX,
        y: clientY,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    container.addEventListener('mouseenter', () => {
      gsap.to(tooltip, { opacity: 1, scale: 1, duration: 0.3 });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(tooltip, { opacity: 0, scale: 0, duration: 0.3 });
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
      
      if (currentMobileBtn) gsap.set(currentMobileBtn, { display: 'none', opacity: 0 });
      if (nextMobileBtn) gsap.set(nextMobileBtn, { display: 'inline-flex', opacity: 1, y: 0 });

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
  const progressTl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: `+=${cards.length * 150}%`,
      pin: true,
      scrub: true,
      id: 'featured-work-scroll'
    }
  });

  // Build the progress timeline
  cards.forEach((_, i) => {
    const targets = [];
    if (tooltipFills[i]) targets.push(tooltipFills[i]);
    if (mobileFills[i]) targets.push(mobileFills[i]);

    if (targets.length > 0) {
      progressTl.to(targets, {
        width: '100%',
        scaleX: 1, // for the mobile buttons using scaleX
        ease: 'none',
        duration: 1,
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
      
      if (i < cards.length - 1) {
        progressTl.to({}, { duration: 0.1 });
      }
    }
  });
};
