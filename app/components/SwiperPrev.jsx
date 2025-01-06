// some-inner-component.jsx
import {React} from 'react';
import {useSwiper} from 'swiper/react';

const SwiperPrev = () => {
  const swiper = useSwiper();

  return (
    <button
      className="swipe-slider-prev"
      onClick={() => swiper.slidePrev()}
    ></button>
  );
};
export default SwiperPrev;
