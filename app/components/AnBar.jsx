import React from 'react';
import {useLocation} from '@remix-run/react';

// import {useLocation} from 'react-router';
import cn from 'classnames';

export const AnBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div
      className={cn('an-bar-container', {
        anbar_not_home: currentPath !== '/',
      })}
    >
      <h3 className="announcement-bar-text">FREE SHIPPING ABOVE $300</h3>
    </div>
  );
};
