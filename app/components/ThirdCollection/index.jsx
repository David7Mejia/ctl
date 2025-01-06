import React from 'react';
import HomeSlider from '../HomeSlider';
import cn from 'classnames';

export const ThirdCollection = ({featured}) => {
  return (
    <div className="second-sliding-collection-container second-sliding-collection-container">
      <HomeSlider featured={featured} />
    </div>
  );
};
