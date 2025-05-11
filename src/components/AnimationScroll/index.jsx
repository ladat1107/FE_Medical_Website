import React, { useEffect, useRef, useState } from 'react';
import './animationScroll.scss';

const AnimateOnScroll = ({
  children,
  animationClass = 'animate',
  rootMargin = '-18% 0px -12% 0px',
  threshold = 0.5,
}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={isVisible ? animationClass : 'default-hidden'}>
      {children}
    </div>
  );
};

export default AnimateOnScroll;
