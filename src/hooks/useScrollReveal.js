import { useEffect, useRef } from 'react';

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
      ...options,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Optional: stop observing once revealed
        if (!options.persist) {
          observer.unobserve(entry.target);
        }
      } else if (options.persist) {
        entry.target.classList.remove('is-revealed');
      }
    }, observerOptions);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return ref;
};
