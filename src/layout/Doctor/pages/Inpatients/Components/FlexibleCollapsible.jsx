// FlexibleCollapsible.jsx
import React, { useRef, useEffect } from 'react';
import './FlexibleCollapsible.scss';

const FlexibleCollapsible = ({ 
  isOpen, 
  onToggle, 
  toggleText, 
  collapsedText, 
  expandedText,
  children 
}) => {
  const contentRef = useRef(null);
  const innerRef = useRef(null);
  
  // Update height when isOpen changes or when children content changes
  useEffect(() => {
    if (contentRef.current && innerRef.current) {
      if (isOpen) {
        contentRef.current.style.height = `${innerRef.current.offsetHeight}px`;
      } else {
        contentRef.current.style.height = '0px';
      }
    }
  }, [isOpen, children]);
  
  return (
    <div className="flexible-collapsible-box">
      <button
        className="flexible-collapsible-toggle"
        onClick={onToggle}
      >
        {toggleText || (isOpen ? expandedText : collapsedText)}
        <i className={`ms-2 fa-solid fa-caret-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      <div 
        className="flexible-collapsible-content" 
        ref={contentRef}
      >
        <div className="flexible-content-inner" ref={innerRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FlexibleCollapsible;