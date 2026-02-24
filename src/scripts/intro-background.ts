import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initIntroBackgroundFade() {
  const introSection = document.querySelector('.intro-text-section') as HTMLElement;
  const marqueeSection = document.querySelector('.sw-partner-marquee') as HTMLElement;
  
  if (!introSection) return;

  // We want the fade to happen as the intro text scroll enters the viewport, 
  // turning completely solid by the time the text is fully centered.
  
  // Set initial state to transparent
  gsap.set([introSection, marqueeSection], {
    backgroundColor: 'rgba(242, 242, 242, 0)'
  });

  // Create ScrollTrigger timeline for the fade
  gsap.to([introSection, marqueeSection], {
    backgroundColor: 'rgba(242, 242, 242, 1)', // #F2F2F2
    ease: 'none',
    scrollTrigger: {
      trigger: introSection,
      start: 'top 50%', // Start fading when the top of the intro hits the middle of the screen
      end: 'top top',   // Fully solid when the intro hits the top of the screen
      scrub: true,
      invalidateOnRefresh: true,
    }
  });
}
