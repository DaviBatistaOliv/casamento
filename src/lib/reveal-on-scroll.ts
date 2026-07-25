const REVEALED_CLASS = 'is-revealed';
const ROOT_MARGIN = '0px 0px -10% 0px';
const THRESHOLD = 0.08;

let sharedObserver: IntersectionObserver | null = null;

function hasReducedMotionPreference(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function handleIntersections(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
): void {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.classList.add(REVEALED_CLASS);
    observer.unobserve(entry.target);
  });
}

function getSharedObserver(): IntersectionObserver {
  if (sharedObserver === null) {
    sharedObserver = new IntersectionObserver(handleIntersections, {
      rootMargin: ROOT_MARGIN,
      threshold: THRESHOLD,
    });
  }
  return sharedObserver;
}

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Elements are revealed immediately when the viewer prefers reduced motion or
 * when `IntersectionObserver` is unavailable.
 *
 * @param element Element that receives the reveal class.
 * @returns Cleanup function that stops observing the element.
 */
export function observeReveal(element: Element): () => void {
  if (typeof IntersectionObserver === 'undefined' || hasReducedMotionPreference()) {
    element.classList.add(REVEALED_CLASS);
    return () => undefined;
  }
  const observer = getSharedObserver();
  observer.observe(element);
  return () => observer.unobserve(element);
}
