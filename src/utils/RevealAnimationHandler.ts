/**
	The Reveal Animator

	This script handles revealing text elements with data-reveal attributes
	when they become visible in the viewport using GSAP animations.
	All styling is included inline and no external CSS is required.
	
	### TEXT REVEAL TYPES:
	data-reveal="perspective" - Animates text with a 3D perspective effect (line by line)
	data-reveal="slide" - Animates text line by line with a reveal effect
	data-reveal="words" - Animates text word by word with a reveal effect (best for longer texts)

	### Text Reveal Properties
	data-reveal-fade - Add opacity animation (boolean attribute)
	data-reveal-blur - Add blur and opacity animation (boolean attribute)
	data-reveal-duration="0.75" - Duration of animation in seconds (default: 0.75)
	data-reveal-delay="0.1" - Delay before animation starts in seconds (default: 0.1)
	data-reveal-stagger="0.1" - Stagger time between animated elements (default: varies by animation type)
	data-reveal-keep-will-change - If present, keeps will-change: transform after animation (default: false)

	 */

import { gsap } from 'gsap';

// Default animation values
const DEFAULT_ANIMATION_VALUES = {
	DURATION: 0.75,
	DELAY: 0,
	STAGGER: 0.1,
};

// Common selectors used throughout the code
const SELECTORS = {
	NESTED_TEXT_ELEMENTS: 'h1, h2, h3, h4, h5, h6, p, li',
	SPLIT_WORD: '.split-word',
};

interface AnimationOptions {
	duration?: number;
	delay?: number;
	stagger?: number;
	fade?: boolean;
	blur?: boolean;
	keepWillChange?: boolean;
}

const ACCESSIBILITY = {
	SR_ONLY_CLASS: 'sr-only',
	SR_ONLY_STYLE:
		'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; border: 0;',
};

/**
 * Standardize animation options by applying defaults
 */
const standardizeOptions = (element: HTMLElement): AnimationOptions => {
	return {
		duration: getAttributeValue(
			element,
			'data-reveal-duration',
			DEFAULT_ANIMATION_VALUES.DURATION
		),
		delay: getAttributeValue(
			element,
			'data-reveal-delay',
			DEFAULT_ANIMATION_VALUES.DELAY
		),
		stagger: getAttributeValue(
			element,
			'data-reveal-stagger',
			DEFAULT_ANIMATION_VALUES.STAGGER
		),
		fade: element.hasAttribute('data-reveal-fade'),
		blur: element.hasAttribute('data-reveal-blur'),
		keepWillChange: element.hasAttribute('data-reveal-keep-will-change'),
	};
};

// Store animated elements and their original text
const animatedElements: HTMLElement[] = [];
let currentObserver: IntersectionObserver | null = null;
let isInitialized = false;

// Helper: apply minimal inline style after animation is done
const applyCleanStyles = (
	node: HTMLElement,
	isSpan: boolean,
	keepWillChange: boolean
): void => {
	const base = `${
		isSpan ? 'display: inline-block;' : 'display: block;'
	} opacity: 1;`;
	node.style.cssText = keepWillChange
		? `${base} will-change: transform;`
		: base;
};

/**
 * Initializes animations by finding elements with data-reveal attribute
 * and setting up intersection observers
 */
export const initTextAnimations = (): void => {
	// Create observer if it doesn't exist
	if (!currentObserver) {
		currentObserver = new IntersectionObserver(
			(entries) => handleIntersection(entries, currentObserver!),
			{
				root: null,
				rootMargin: '0px',
				threshold: 0.1,
			}
		);
	}

	// Find all elements with data-reveal attribute that haven't been animated yet
	const elements = document.querySelectorAll('[data-reveal]:not([data-reveal-animated])');

	// Filter out elements that are already processed (in animatedElements array with originalText stored)
	// Only include truly new elements that haven't been processed yet
	const newElements = Array.from(elements).filter((el) => {
		const htmlElement = el as HTMLElement;
		// Exclude if already in animatedElements array AND has originalText stored
		// (meaning it's been processed before, even if it was restored)
		const isAlreadyProcessed = animatedElements.includes(htmlElement) && (htmlElement as any).originalText;
		
		// Also exclude if element has animated content (divs with aria-hidden="true")
		// This prevents processing elements that are currently animated
		const hasAnimatedContent = htmlElement.querySelector('div[aria-hidden="true"]') !== null;
		
		return !isAlreadyProcessed && !hasAnimatedContent;
	}) as HTMLElement[];

	newElements.forEach((element) => {
		// CRITICAL: Only store originalText if element is in its original state
		// Check if element has animated containers - if so, don't store innerHTML as it's already animated
		const hasAnimatedContent = element.querySelector('div[aria-hidden="true"]') !== null;
		if (!hasAnimatedContent && !(element as any).originalText) {
			// Only store if element doesn't have animated content and originalText doesn't exist
			(element as any).originalText = element.innerHTML;
		}

		// Set initial opacity to 0 directly if it's not already set
		if (element.style.opacity !== '0') {
			element.style.opacity = '0';
		}

		// Add to animated elements array (only if not already there)
		if (!animatedElements.includes(element)) {
			animatedElements.push(element);
		}

		// Start observing the element (only if not already being observed)
		try {
			currentObserver!.observe(element);
		} catch (e) {
			// Element might already be observed, ignore error
		}
	});

	isInitialized = true;
};

/**
 * Handles window resize events
 * DISABLED: No longer restores text on resize to prevent duplication issues
 */
const handleWindowResize = (): void => {
	// Resize restoration disabled - animations will remain as-is after initial load
	// This prevents text duplication issues during window resize
};

/**
 * Restores an element to its original text form
 * Preserves styling and animations already applied
 */
	const restoreOriginalText = (element: HTMLElement): void => {
	// Skip if element doesn't have originalText property
	if (!(element as any).originalText) return;

	// Get computed style of the element
	const computedStyle = window.getComputedStyle(element);
	const originalStyle = {
		color: computedStyle.color,
		fontWeight: computedStyle.fontWeight,
		fontSize: computedStyle.fontSize,
		lineHeight: computedStyle.lineHeight,
		letterSpacing: computedStyle.letterSpacing,
		textAlign: computedStyle.textAlign,
		opacity: computedStyle.opacity,
	};

	// Kill any ongoing GSAP animations on this element and its children
	gsap.killTweensOf(element);
	const allChildren = element.querySelectorAll('*');
	if (allChildren.length > 0) {
		gsap.killTweensOf(allChildren);
	}

	// Restore original HTML - this clears any animated containers
	// Do this before any other operations to ensure clean state
	if ((element as any).originalText) {
		element.innerHTML = (element as any).originalText;
	}

	// Remove any existing sr-only span to prevent duplicates
	const existingSrOnly = element.querySelector(`.${ACCESSIBILITY.SR_ONLY_CLASS}`);
	if (existingSrOnly) {
		existingSrOnly.remove();
	}
	// Add sr-only span back
	insertSrOnlyText(element);

	// Keep opacity at 0 so element doesn't flash restored text before re-animation
	// The animation will handle setting opacity back to 1
	element.style.opacity = '0';

	// If this element acts as a container for grouped line reveal, ensure nested text elements are visible
	if (
		['slide', 'perspective'].includes(element.getAttribute('data-reveal') || '')
	) {
		const nestedTextEls = element.querySelectorAll<HTMLElement>(
			SELECTORS.NESTED_TEXT_ELEMENTS
		);
		nestedTextEls.forEach((nested) => {
			// Only override opacity if not explicitly set from CSS elsewhere
			nested.style.opacity = '1';
		});
	}

	// Clear any transform properties to prevent performance issues
	element.style.transform = 'none';
	element.style.transformOrigin = '';
	element.style.willChange = 'auto';

	// Remove any 3D transform properties if they exist
	element.style.perspective = '';
	element.style.transformStyle = '';
};

/**
 * Extract text from an element while preserving line breaks
 */
const extractTextWithLineBreaks = (element: HTMLElement): string => {
	let result = '';
	const lineElements = element.querySelectorAll('h1, h2, h3, h4, h5, h6, p');

	if (lineElements.length > 0) {
		// Extract text by lines
		lineElements.forEach((lineElement, index) => {
			result += lineElement.textContent;
			// Add line break if not the last line
			if (index < lineElements.length - 1) {
				result += '\n';
			}
		});
	} else {
		// If no line elements, just get the text content
		result = element.textContent || '';
	}

	return result;
};

/**
 * Handles intersection events for animated elements
 */
const handleIntersection = (
	entries: IntersectionObserverEntry[],
	observer: IntersectionObserver
): void => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const element = entry.target as HTMLElement;
			const animType = element.getAttribute('data-reveal');

			// Skip if already animated
			if (element.hasAttribute('data-reveal-animated')) {
				observer.unobserve(element);
				return;
			}

			// Mark as animated before processing
			element.setAttribute('data-reveal-animated', 'true');

			// Stop observing once animation is triggered
			observer.unobserve(element);

			// Get animation options
			const options = standardizeOptions(element);

			// Detect if this element acts as a container for multiple text nodes
			const nestedTextElements = Array.from(
				element.querySelectorAll<HTMLElement>(SELECTORS.NESTED_TEXT_ELEMENTS)
			);

			// Whether the element contains nested text elements to treat as a grouped container
			const hasNestedElements = nestedTextElements.length > 0;

			// Trigger appropriate animation based on data-reveal value
			switch (animType) {
				case 'perspective':
					if (hasNestedElements) {
						animateGroupedPerspective(element, nestedTextElements, options);
					} else {
						animatePerspective(element, options);
					}
					break;
				case 'slide':
					if (hasNestedElements) {
						animateGroupedSlide(element, nestedTextElements, options);
					} else {
						animateSlide(element, options);
					}
					break;
				case 'words':
					animateWords(element, options);
					break;
				default:
					// Default to object animation for any unspecified animation type
					animateSlide(element, options);
			}
		}
	});
};

/**
 * Get numeric attribute value with fallback
 */
const getAttributeValue = (
	element: HTMLElement,
	attr: string,
	defaultValue: number
): number => {
	const value = element.getAttribute(attr);
	return value ? parseFloat(value) : defaultValue;
};

/**
 * Generate HTML for line-based animations
 */
const generateLinesHTML = (
	lines: string[],
	useOverflowHidden: boolean,
	use3D: boolean = false
): string => {
	return lines
		.map((line) => {
			const divStyles = use3D
				? `display: block; transform-origin: 50% 0; transform-style: preserve-3d; overflow: ${
						!useOverflowHidden ? 'visible' : 'hidden'
				  };`
				: `display: block; overflow: ${
						!useOverflowHidden ? 'visible' : 'hidden'
				  }; will-change: transform;`;

			const spanStyles = use3D
				? `display: inline-block; transform: translateY(100%); transform-origin: 50% 0; will-change: transform;`
				: `display: inline-block; transform: translateY(100%); will-change: transform;`;

			return `<div style="${divStyles}">
						<span style="${spanStyles}">
							${line}
						</span>
					</div>`;
		})
		.join('');
};

/**
 * Animate text with perspective style (3D effect)
 */
const animatePerspective = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	// Reset opacity
	element.style.opacity = '1';

	// Split text into lines
	const lines = splitTextIntoLines(element);

	// Create container with perspective
	const container = document.createElement('div');
	container.style.perspective = '1000px';

	// Mark the animated container as hidden from assistive tech
	container.setAttribute('aria-hidden', 'true');

	// We will add the sr-only span AFTER clearing the element so it persists

	// Create HTML structure with 3D styling for each line
	const linesHTML = generateLinesHTML(
		lines,
		!(options.fade || options.blur),
		true
	);

	container.innerHTML = linesHTML;
	// Clear current content then insert sr-only span followed by container
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);

	// Get all elements for animation
	const lineElements = container.querySelectorAll('div');

	// Create GSAP timeline
	const timeline = gsap.timeline({
		delay: options.delay || 0,
		onComplete: () => {
			const target = typeof element !== 'undefined' ? element : container;
			target.dispatchEvent(new CustomEvent('reveal-complete', { bubbles: true }));
		}
	});

	// Animate each line
	lineElements.forEach((lineElement, lineIndex) => {
		// Get the span containing the line text
		const lineSpan = lineElement.querySelector('span');

		// Calculate the delay for each line based on the line index and the stagger value
		const lineDelay =
			lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

		// Get keepWillChange flag from options
		const keepWillChange = options.keepWillChange || false;

		// Animate the entire line as a single element
		if (options.blur) {
			// Aggressive performance optimization
			gsap.set(lineElement, {
				willChange: 'transform, opacity, filter',
				force3D: true,
				backfaceVisibility: 'hidden',
				transformStyle: 'preserve-3d',
			});
			
			// For blur animation, only animate y position on the span
			timeline.fromTo(
				lineSpan,
				{ y: '300%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'power1.out', // Faster easing for better performance
					force3D: true,
					onComplete: () => {
						applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
					},
				},
				lineDelay
			);

			// Apply blur animation only to the line element - minimal blur for performance
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
					opacity: 0,
					filter: 'blur(6px)', // Significantly reduced from 15px for better performance
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					opacity: 1,
					filter: 'blur(0px)',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'power1.out', // Faster easing for better performance
					force3D: true,
					onComplete: () => {
						applyCleanStyles(
							lineElement as HTMLElement,
							false,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);
		} else if (options.fade) {
			timeline.fromTo(
				lineSpan,
				{ y: '300%', opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(
							lineSpan as HTMLElement,
							true,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);

			// Apply 3D rotation to the entire line
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quad.out',
					onComplete: () => {
						applyCleanStyles(
							lineElement as HTMLElement,
							false,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);
		} else {
			timeline.fromTo(
				lineSpan,
				{ y: '300%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(
							lineSpan as HTMLElement,
							true,
							keepWillChange
						);
					},
				},
				lineDelay
			);

			// Apply 3D rotation to the entire line
			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
				},
				{
					rotateX: '0deg',
					rotateY: '0deg',
					z: '0rem',
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quad.out',
					onComplete: () => {
						applyCleanStyles(
							lineElement as HTMLElement,
							false,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);
		}
	});
};

/**
 * Animate text with slide style (line reveal)
 */
const animateSlide = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	// Reset opacity
	element.style.opacity = '1';

	// Split text into lines
	const lines = splitTextIntoLines(element);

	// Create container for lines
	const container = document.createElement('div');

	// Mark the animated container as hidden from assistive tech
	container.setAttribute('aria-hidden', 'true');

	// Create HTML structure without 3D transforms
	const linesHTML = generateLinesHTML(
		lines,
		!(options.fade || options.blur),
		false
	);

	container.innerHTML = linesHTML;
	// Clear current content then insert sr-only span followed by container
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);

	// Get all elements for animation
	const lineElements = container.querySelectorAll('div');

	// Create GSAP timeline
	const timeline = gsap.timeline({
		delay: options.delay || 0,
		onComplete: () => {
			const target = typeof element !== 'undefined' ? element : container;
			target.dispatchEvent(new CustomEvent('reveal-complete', { bubbles: true }));
		}
	});

	// Animate each line
	lineElements.forEach((lineElement, lineIndex) => {
		// Get the span containing the line text
		const lineSpan = lineElement.querySelector('span');

		// Calculate the delay for each line based on the line index and the stagger value
		const lineDelay =
			lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

		// Get keepWillChange flag from options
		const keepWillChange = options.keepWillChange || false;

		timeline.fromTo(
			lineSpan,
			{ y: '100%' },
			{
				y: 0,
				duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
				ease: 'quart.out',
				onComplete: () => {
					applyCleanStyles(lineSpan as HTMLElement, true, keepWillChange);
				},
			},
			lineDelay
		);
	});
};

/**
 * Animate text word by word
 */
const animateWords = (
	element: HTMLElement,
	options: AnimationOptions
): void => {
	// Reset opacity
	element.style.opacity = '1';

	// Get text content
	const text = element.textContent || '';
	
	// Split into words, preserving spaces
	const words = text.split(/(\s+)/).filter(word => word.trim() || word === ' ');

	// Create container for words
	const container = document.createElement('div');
	container.setAttribute('aria-hidden', 'true');
	container.style.display = 'inline';

	// Create HTML structure with each word wrapped in a span
	const wordsHTML = words.map((word, index) => {
		if (word.trim()) {
			// Word span with overflow hidden for reveal effect
			return `<span style="display: inline-block; overflow: hidden; vertical-align: bottom;"><span style="display: inline-block; transform: translateY(100%); will-change: transform;">${word}</span></span>`;
		} else {
			// Preserve spaces
			return word;
		}
	}).join('');

	container.innerHTML = wordsHTML;
	
	// Clear current content then insert sr-only span followed by container
	element.innerHTML = '';
	insertSrOnlyText(element);
	element.appendChild(container);

	// Get all word spans
	const wordSpans = container.querySelectorAll('span > span');

	// Create GSAP timeline
	const timeline = gsap.timeline({
		delay: options.delay || 0,
		onComplete: () => {
			const target = typeof element !== 'undefined' ? element : container;
			target.dispatchEvent(new CustomEvent('reveal-complete', { bubbles: true }));
		}
	});

	// Animate each word
	wordSpans.forEach((wordSpan, wordIndex) => {
		const wordDelay = wordIndex * (options.stagger || 0.03); // Smaller stagger for words
		const keepWillChange = options.keepWillChange || false;

		const animationVars: any = {
			y: 0,
			duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
			ease: 'quart.out',
			onComplete: () => {
				applyCleanStyles(wordSpan as HTMLElement, true, keepWillChange);
			},
		};

		if (options.fade) {
			gsap.set(wordSpan, { opacity: 0 });
			animationVars.opacity = 1;
		}

		if (options.blur) {
			// Aggressive performance optimization - minimal blur
			gsap.set(wordSpan, { 
				filter: 'blur(4px)', // Significantly reduced blur (from 8px) for better performance
				willChange: 'transform, filter',
				force3D: true,
				backfaceVisibility: 'hidden',
				transformStyle: 'preserve-3d',
			});
			animationVars.filter = 'blur(0px)';
			animationVars.force3D = true;
			// Use faster easing for blur animations
			animationVars.ease = 'power1.out';
		}

		timeline.to(wordSpan, animationVars, wordDelay);
	});
};

/**
 * Split text into lines
 */
const splitTextIntoLines = (element: HTMLElement): string[] => {
	// If element has animated content but originalText exists, use originalText
	// This prevents reading from animated containers
	const hasAnimatedContent = element.querySelector('div[aria-hidden="true"]') !== null;
	let content = '';
	let tempElement: HTMLElement | null = null;
	
	if (hasAnimatedContent && (element as any).originalText) {
		// Use originalText if element has animated content
		tempElement = document.createElement('div');
		tempElement.innerHTML = (element as any).originalText;
		content = tempElement.textContent || '';
	} else {
		// Use current textContent
		content = element.textContent || '';
	}

	// Check for natural line breaks using HTML structure
	// Use tempElement if it was created, otherwise use element
	const targetElement = tempElement || element;
	const paragraphs = targetElement.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6');

	if (paragraphs.length > 0) {
		const lines: string[] = [];
		paragraphs.forEach((para) => {
			const text = para.textContent || '';
			if (text.trim()) {
				lines.push(text.trim());
			}
		});
		return lines.length > 0 ? lines : content.split('\n').filter((line) => line.trim());
	}

	// Otherwise, use line break characters
	return content.split('\n').filter((line) => line.trim());
};

/**
 * Animate grouped perspective (container with multiple text elements)
 */
const animateGroupedPerspective = (
	container: HTMLElement,
	textElements: HTMLElement[],
	options: AnimationOptions
): void => {
	container.style.opacity = '1';
	container.style.perspective = '1000px';

	// Create GSAP timeline
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});

	textElements.forEach((textElement, index) => {
		const lines = splitTextIntoLines(textElement);
		const elementDelay =
			index * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

		// Create wrapper with perspective
		const wrapper = document.createElement('div');
		wrapper.style.perspective = '1000px';
		wrapper.setAttribute('aria-hidden', 'true');

		// Generate lines HTML
		const linesHTML = generateLinesHTML(
			lines,
			!(options.fade || options.blur),
			true
		);

		wrapper.innerHTML = linesHTML;

		// Replace element content
		textElement.innerHTML = '';
		insertSrOnlyText(textElement);
		textElement.appendChild(wrapper);

		// Get line elements
		const lineElements = wrapper.querySelectorAll('div');

		lineElements.forEach((lineElement, lineIndex) => {
			const lineSpan = lineElement.querySelector('span');
			const lineDelay = elementDelay + lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

			// Optimize for performance if blur is enabled
			if (options.blur) {
				gsap.set(lineElement, {
					willChange: 'transform, opacity, filter',
					force3D: true,
					backfaceVisibility: 'hidden',
				});
			}

			timeline.fromTo(
				lineSpan,
				{ y: '300%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					force3D: true,
					onComplete: () => {
						applyCleanStyles(
							lineSpan as HTMLElement,
							true,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);

			const lineAnimationVars: any = {
				rotateX: '0deg',
				rotateY: '0deg',
				z: '0rem',
				duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
				ease: 'power1.out', // Faster easing for better performance
				force3D: true,
				onComplete: () => {
					applyCleanStyles(
						lineElement as HTMLElement,
						false,
						options.keepWillChange || false
					);
				},
			};

			if (options.blur) {
				lineAnimationVars.opacity = 1;
				lineAnimationVars.filter = 'blur(0px)';
			}

			timeline.fromTo(
				lineElement,
				{
					rotateX: '-75deg',
					rotateY: '0deg',
					z: '2rem',
					...(options.blur ? { opacity: 0, filter: 'blur(6px)' } : {}), // Reduced from 15px
				},
				lineAnimationVars,
				lineDelay
			);
		});
	});
};

/**
 * Animate grouped slide (container with multiple text elements)
 */
const animateGroupedSlide = (
	container: HTMLElement,
	textElements: HTMLElement[],
	options: AnimationOptions
): void => {
	container.style.opacity = '1';

	// Create GSAP timeline
	const timeline = gsap.timeline({
		delay: options.delay || 0,
	});

	textElements.forEach((textElement, index) => {
		const lines = splitTextIntoLines(textElement);
		const elementDelay =
			index * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

		// Create wrapper
		const wrapper = document.createElement('div');
		wrapper.setAttribute('aria-hidden', 'true');

		// Generate lines HTML
		const linesHTML = generateLinesHTML(
			lines,
			!(options.fade || options.blur),
			false
		);

		wrapper.innerHTML = linesHTML;

		// Replace element content
		textElement.innerHTML = '';
		insertSrOnlyText(textElement);
		textElement.appendChild(wrapper);

		// Get line elements
		const lineElements = wrapper.querySelectorAll('div');

		lineElements.forEach((lineElement, lineIndex) => {
			const lineSpan = lineElement.querySelector('span');
			const lineDelay = elementDelay + lineIndex * (options.stagger || DEFAULT_ANIMATION_VALUES.STAGGER);

			timeline.fromTo(
				lineSpan,
				{ y: '100%' },
				{
					y: 0,
					duration: options.duration || DEFAULT_ANIMATION_VALUES.DURATION,
					ease: 'quart.out',
					onComplete: () => {
						applyCleanStyles(
							lineSpan as HTMLElement,
							true,
							options.keepWillChange || false
						);
					},
				},
				lineDelay
			);
		});
	});
};

function insertSrOnlyText(element: HTMLElement): void {
	// Avoid duplicating the helper span on subsequent calls
	if (element.querySelector(`.${ACCESSIBILITY.SR_ONLY_CLASS}`)) return;

	// Get text content - originalText contains HTML, so we need to extract text from it
	let textContent = '';
	if ((element as any).originalText) {
		// originalText contains HTML, create a temp element to extract text
		const temp = document.createElement('div');
		temp.innerHTML = (element as any).originalText;
		textContent = temp.textContent || temp.innerText || '';
	} else {
		// Fallback to current textContent if originalText doesn't exist
		textContent = element.textContent || '';
	}
	
	if (!textContent.trim()) return;

	const srSpan = document.createElement('span');
	srSpan.className = ACCESSIBILITY.SR_ONLY_CLASS;
	srSpan.textContent = textContent;
	srSpan.style.cssText = ACCESSIBILITY.SR_ONLY_STYLE;

	// Prepend so it is encountered first by screen readers
	element.prepend(srSpan);
}
