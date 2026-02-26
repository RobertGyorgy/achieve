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
  const progressFills = gsap.utils.toArray('.progress-bar-fill') as HTMLElement[];
  
  // State
  let currentIndex = 0;
  let isAnimating = false;

  // Initial Setup
  cards.forEach((card, i) => {
    const content = card.querySelector('.card-content');
    const video = card.querySelector('video');
    
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
      if (video) video.pause();
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    }
    // Set all progress bars to 0 initially
    if (progressFills[i]) gsap.set(progressFills[i], { width: '0%' });
  });

  const gotoSlide = (index: number, direction: 'next' | 'prev') => {
    if (index < 0 || index >= cards.length || isAnimating || index === currentIndex) return;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');
    const currentVideo = currentCard.querySelector('video') as HTMLVideoElement;
    const nextVideo = nextCard.querySelector('video') as HTMLVideoElement;

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
      }
    });

    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });

    // Wipe IN (White)
    tl.to(masks, {
      scaleX: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.inOut'
    });

    // SWAP DATA
    tl.add(() => {
      gsap.set(currentCard, { opacity: 0, pointerEvents: 'none' });
      gsap.set(nextCard, { opacity: 1, pointerEvents: 'auto' });
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

    // Wipe OUT (Video appears)
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

  // Main ScrollTrigger to drive progress bars and handle unpinning
  ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${cards.length * 150}%`, // Longer distance for comfortable scrolling
    pin: true,
    scrub: true,
    id: 'featured-work-progress',
    onUpdate: (self) => {
      if (isAnimating) return;

      const totalProgress = self.progress;
      const sectionProgress = 1 / cards.length;
      
      // Calculate which card we *should* be on based on scroll
      const idealIndex = Math.min(
        cards.length - 1,
        Math.floor(totalProgress / sectionProgress)
      );

      // Handle transition Trigger
      if (idealIndex !== currentIndex) {
        gotoSlide(idealIndex, idealIndex > currentIndex ? 'next' : 'prev');
      }

      // Update Progress Bars
      progressFills.forEach((fill, i) => {
        const barStart = i * sectionProgress;
        const barEnd = (i + 1) * sectionProgress;
        
        let barProgress = 0;
        if (totalProgress >= barEnd) {
          barProgress = 100;
        } else if (totalProgress <= barStart) {
          barProgress = 0;
        } else {
          barProgress = ((totalProgress - barStart) / sectionProgress) * 100;
        }
        
        gsap.to(fill, { width: `${barProgress}%`, duration: 0.1, ease: 'none', overwrite: true });
      });
    }
  });
};
