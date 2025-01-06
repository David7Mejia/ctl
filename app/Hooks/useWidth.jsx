import {useState, useEffect} from 'react';

const useWidth = () => {
  // Initialize width state with undefined or a default value
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : undefined,
  );

  useEffect(() => {
    // Ensure this code only runs in browser environment
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return width;
};

export default useWidth;
