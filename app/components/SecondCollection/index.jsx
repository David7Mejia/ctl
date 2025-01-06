import React from 'react';
import HomeSlider from '../HomeSlider';
import cn from 'classnames';

export const SecondCollection = ({featured}) => {
  // console.log('SECOND COLLECTIONS', featured);
  return (
    <div className="second-sliding-collection-container">
      <HomeSlider featured={featured} />
      {/* {console.log('this is the elll', featured)} */}
    </div>
  );
};
