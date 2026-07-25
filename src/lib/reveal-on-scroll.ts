const REVEALED_CLASS = 'is-revealed';
const ROOT_MARGIN = '0px 0px -10% 0px';
const THRESHOLD = 0.08;

let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new WeakMap<Element, () => void>();

function hasReducedMotionPreference(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealElement(element: Element): void {
  element.classList.add(REVEALED_CLASS);
  const onReveal = revealCallbacks.get(element);
  if (onReveal === undefined) {
    return;
  }
  revealCallbacks.delete(element);
  onReveal();
}

function handleIntersections(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
): void {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    revealElement(entry.target);
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
 * Pass `onReveal` when the host uses a reactive `:class` binding. Imperative
 * `classList` changes are wiped when Vue re-renders class bindings (for
 * example when a gift becomes reserved after claims load).
 *
 * @param element Element that receives the reveal class.
 * @param onReveal Optional callback invoked once when the element is revealed.
 * @returns Cleanup function that stops observing the element.
 */
export function observeReveal(
  element: Element,
  onReveal?: () => void,
): () => void {
  if (onReveal !== undefined) {
    revealCallbacks.set(element, onReveal);
  }
  if (
    typeof IntersectionObserver === 'undefined' ||
    hasReducedMotionPreference()
  ) {
    revealElement(element);
    return () => undefined;
  }
  const observer = getSharedObserver();
  observer.observe(element);
  return () => {
    revealCallbacks.delete(element);
    observer.unobserve(element);
  };
}
