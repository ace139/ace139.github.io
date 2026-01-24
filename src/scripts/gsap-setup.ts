/**
 * GSAP Setup with ScrollTrigger
 *
 * Provides scroll-triggered animations with reduced-motion support.
 * All animations respect prefers-reduced-motion media query.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Default animation settings
export const defaultEase = 'power3.out';
export const defaultDuration = 0.8;

/**
 * Initialize GSAP ScrollTrigger and set global defaults
 */
export function initGSAP(): void {
  // Set global defaults
  gsap.defaults({
    ease: defaultEase,
    duration: defaultDuration,
  });

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
    start: 'top 85%',
    markers: false, // Set to true for debugging
  });

  // Add gsap-ready class to enable initial hidden states
  document.documentElement.classList.add('gsap-ready');

  // Refresh ScrollTrigger after View Transitions
  document.addEventListener('astro:page-load', () => {
    document.documentElement.classList.add('gsap-ready');
    ScrollTrigger.refresh();
  });
}

/**
 * Animate elements when they enter the viewport
 * Falls back to instant visibility for reduced motion
 */
export function animateFadeUp(
  selector: string | Element | Element[],
  options: {
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
  } = {}
): gsap.core.Tween | void {
  const { delay = 0, stagger = 0.1, duration = defaultDuration, y = 40 } = options;

  if (prefersReducedMotion()) {
    // Immediately show elements for reduced motion users
    gsap.set(selector, { opacity: 1, y: 0 });
    return;
  }

  // Use gsap.to() since CSS already sets initial hidden state
  // This animates TO visible state from the CSS-defined hidden state
  return gsap.to(selector, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    scrollTrigger: {
      trigger: typeof selector === 'string' ? selector : undefined,
      start: 'top 85%',
    },
  });
}

/**
 * Animate elements with a fade effect only (no transform)
 */
export function animateFadeIn(
  selector: string | Element | Element[],
  options: {
    delay?: number;
    stagger?: number;
    duration?: number;
  } = {}
): gsap.core.Tween | void {
  const { delay = 0, stagger = 0.1, duration = defaultDuration } = options;

  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1 });
    return;
  }

  // Use gsap.to() since CSS already sets initial hidden state
  return gsap.to(selector, {
    opacity: 1,
    duration,
    delay,
    stagger,
    scrollTrigger: {
      trigger: typeof selector === 'string' ? selector : undefined,
      start: 'top 85%',
    },
  });
}

/**
 * Animate elements with scale effect
 */
export function animateScaleIn(
  selector: string | Element | Element[],
  options: {
    delay?: number;
    stagger?: number;
    duration?: number;
    scale?: number;
  } = {}
): gsap.core.Tween | void {
  const { delay = 0, stagger = 0.1, duration = defaultDuration, scale = 0.95 } = options;

  if (prefersReducedMotion()) {
    gsap.set(selector, { opacity: 1, scale: 1 });
    return;
  }

  // Use gsap.to() since CSS already sets initial hidden state
  return gsap.to(selector, {
    opacity: 1,
    scale: 1,
    duration,
    delay,
    stagger,
    scrollTrigger: {
      trigger: typeof selector === 'string' ? selector : undefined,
      start: 'top 85%',
    },
  });
}

/**
 * Create a staggered reveal for a group of elements
 */
export function animateStaggerGroup(
  container: string | Element,
  childSelector: string,
  options: {
    delay?: number;
    stagger?: number;
    duration?: number;
    y?: number;
  } = {}
): gsap.core.Timeline | void {
  const { delay = 0, stagger = 0.15, duration = 0.6, y = 30 } = options;

  const containerEl = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!containerEl) return;

  const children = containerEl.querySelectorAll(childSelector);

  if (prefersReducedMotion()) {
    gsap.set(children, { opacity: 1, y: 0 });
    return;
  }

  // Set initial state for stagger items
  gsap.set(children, { opacity: 0, y });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerEl,
      start: 'top 85%',
    },
    delay,
  });

  // Use gsap.to() to animate TO visible state
  tl.to(children, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
  });

  return tl;
}

/**
 * Hero text reveal animation (character-by-character or word-by-word)
 */
export function animateHeroText(
  selector: string | Element,
  options: {
    type?: 'chars' | 'words' | 'lines';
    delay?: number;
    stagger?: number;
    duration?: number;
  } = {}
): gsap.core.Timeline | void {
  const { type = 'chars', delay = 0, stagger = 0.03, duration = 0.5 } = options;

  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) return;

  if (prefersReducedMotion()) {
    gsap.set(element, { opacity: 1 });
    return;
  }

  const text = element.textContent || '';
  let items: string[] = [];

  switch (type) {
    case 'chars':
      items = text.split('');
      break;
    case 'words':
      items = text.split(' ');
      break;
    case 'lines':
      items = text.split('\n');
      break;
  }

  // Clear and rebuild the element with spans
  element.innerHTML = items
    .map((item, i) => {
      const content = type === 'chars' && item === ' ' ? '&nbsp;' : item;
      const separator = type === 'words' && i < items.length - 1 ? ' ' : '';
      return `<span class="gsap-char" style="display: inline-block; opacity: 0;">${content}</span>${separator}`;
    })
    .join('');

  const chars = element.querySelectorAll('.gsap-char');

  const tl = gsap.timeline({ delay });

  tl.to(chars, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: 'power2.out',
  });

  return tl;
}

/**
 * Parallax scroll effect
 */
export function createParallax(
  selector: string | Element,
  options: {
    speed?: number;
    start?: string;
    end?: string;
  } = {}
): ScrollTrigger | void {
  const { speed = 0.5, start = 'top bottom', end = 'bottom top' } = options;

  if (prefersReducedMotion()) return;

  const element = typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;

  if (!element) return;

  return ScrollTrigger.create({
    trigger: element,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      const yPos = self.progress * 100 * speed;
      gsap.set(element, { y: -yPos });
    },
  });
}

/**
 * Cleanup function for View Transitions
 * Call this when navigating away
 */
export function cleanupAnimations(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

// Export GSAP and ScrollTrigger for direct use
export { gsap, ScrollTrigger };
