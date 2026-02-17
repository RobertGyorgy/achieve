import gsap from 'gsap';

/**
 * Initialize the preloader animation
 * Handles entrance of letters and exit of the overlay
 */
export const initPreloader = () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const letters = preloader.querySelectorAll('.preloader-letter');
  
  // Prevent scrolling while preloader is active
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    onComplete: () => {
      // Slide preloader up and unlock scroll
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          document.body.style.overflow = ''; // Restore scroll
        }
      });
    }
  });

  // Animate letters in
  tl.to(letters, {
    y: 0,
    rotateX: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power3.out'
  })
  // Tiny pause
  .to({}, { duration: 0.5 })
  // Animate letters out
  .to(letters, {
    y: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.05,
    ease: 'power2.in'
  });
};
