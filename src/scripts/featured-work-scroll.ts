import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/observer';

gsap.registerPlugin(ScrollTrigger, Observer);

export const initFeaturedWorkScroll = () => {
  if (typeof window === 'undefined') return;

  const container = document.getElementById('featured-work-container');
  if (!container) return;

  const cards = gsap.utils.toArray('#featured-work-container .featured-card') as HTMLElement[];
  if (cards.length < 2) return;

  const masks = gsap.utils.toArray('.js-transition-mask .mask-slice') as HTMLElement[];
  
  // State
  let currentIndex = 0;
  let isAnimating = false;

  // Initial Setup
  cards.forEach((card, i) => {
    const content = card.querySelector('.card-content');
    if (i !== 0) {
      gsap.set(card, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0, y: 30 });
    } else {
      gsap.set(card, { opacity: 1, pointerEvents: 'auto' });
      if (content) gsap.set(content, { opacity: 1, y: 0 });
    }
  });

  const vh = window.innerHeight || 800;

  // ScrollTrigger to manage the pin boundary
  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: `+=${cards.length * vh}`,
    pin: true,
    anticipatePin: 1,
    id: 'featured-work-pin',
    onEnter: () => observer.enable(),
    onEnterBack: () => {
      observer.enable();
      if (currentIndex !== cards.length - 1) {
        currentIndex = cards.length - 1;
        cards.forEach((c, i) => {
          gsap.set(c, { opacity: i === currentIndex ? 1 : 0, pointerEvents: i === currentIndex ? 'auto' : 'none' });
          const content = c.querySelector('.card-content');
          if (content) gsap.set(content, { opacity: i === currentIndex ? 1 : 0, y: 0 });
        });
      }
    },
    onLeave: () => observer.disable(),
    onLeaveBack: () => observer.disable()
  });

  const gotoSlide = (index: number, direction: 'next' | 'prev') => {
    if (index < 0 || index >= cards.length || isAnimating) return false;
    isAnimating = true;

    const currentCard = cards[currentIndex];
    const nextCard = cards[index];
    const currentContent = currentCard.querySelector('.card-content');
    const nextContent = nextCard.querySelector('.card-content');

    const tl = gsap.timeline({
      onComplete: () => {
        currentIndex = index;
        isAnimating = false;
        
        // SYNC SCROLL POSITION
        const scrollTarget = st.start + (index / (cards.length - 1)) * (st.end - st.start);
        st.scroll(scrollTarget);
      }
    });

    const animDuration = 0.8;
    const ease = 'power4.inOut';

    tl.set(masks, { transformOrigin: direction === 'next' ? 'left' : 'right' });
    
    if (currentContent) {
      tl.to(currentContent, {
        opacity: 0,
        y: direction === 'next' ? -30 : 30,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 0);
    }

    tl.to(masks, {
      scaleX: 1,
      duration: animDuration,
      ease: ease,
      force3D: true
    }, "<0.2");

    tl.set(currentCard, { opacity: 0, pointerEvents: 'none' });
    tl.set(nextCard, { opacity: 1, pointerEvents: 'auto' });

    tl.set(masks, { transformOrigin: direction === 'next' ? 'right' : 'left' });

    tl.to(masks, {
      scaleX: 0,
      duration: animDuration,
      ease: ease,
      force3D: true
    });

    if (nextContent) {
      tl.fromTo(nextContent,
        { opacity: 0, y: direction === 'next' ? 30 : -30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        "<0.3"
      );
    }

    return true;
  };

  const observer = Observer.create({
    target: window,
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onUp: () => {
      if (currentIndex < cards.length - 1) {
        if (!isAnimating) gotoSlide(currentIndex + 1, 'next');
      } else {
        observer.disable();
      }
    },
    onDown: () => {
      if (currentIndex > 0) {
        if (!isAnimating) gotoSlide(currentIndex - 1, 'prev');
      } else {
        observer.disable();
      }
    },
    tolerance: 10,
    preventDefault: true
  });
  observer.disable();

  // --- Custom Cursor Logic ---
  const cursor = container.querySelector('.featured-work-cursor') as HTMLElement;
  const links = container.querySelectorAll('.featured-work-link');
  
  if (cursor && links.length > 0) {
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    
    const xSetter = gsap.quickSetter(cursor, "x", "px");
    const ySetter = gsap.quickSetter(cursor, "y", "px");

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSetter(pos.x - 48); // 48 is half of w-24 (96px)
      ySetter(pos.y - 48);
    });

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
      });
      link.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      });
    });
  }
};
