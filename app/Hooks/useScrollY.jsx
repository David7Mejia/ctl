import {useState, useEffect} from 'react';

const useScrollY = () => {
  // Initialize scrollY with a default value (e.g., 0)
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Check if window is defined (this is only true in the browser)
    if (typeof window !== 'undefined') {
      // Define a function to update the state with the current scroll position
      const updateScrollY = () => {
        setScrollY(window.scrollY);
      };
      // Add the event listener
      window.addEventListener('scroll', updateScrollY);

      // Remove the event listener on cleanup
      return () => window.removeEventListener('scroll', updateScrollY);
    }
  }, []);

  return scrollY;
};

export default useScrollY;
