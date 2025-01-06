// some-inner-component.jsx
import {React} from 'react';
import {useSwiper} from 'swiper/react';

const SwiperNext = () => {
  const swiper = useSwiper();

  return <button className="swipe-slider-next" onClick={() => swiper.slideNext()}></button>;
};
export default SwiperNext;
