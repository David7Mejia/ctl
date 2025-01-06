import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import {Image} from '@shopify/hydrogen';
import 'swiper/css';

export const SlideShow = ({collection}) => {
  let collections = collection?.nodes;
  const url = `https://c3628d-4f.myshopify.com/collections/`;

  return (
    <Swiper
      className="mySwiper"
      autoplay={{
        delay: 4000,
        disableOnInteraction: true,
      }}
      grabCursor={true}
      slidesPerView={1}
      loop={true}
      speed={3000}
      modules={[Autoplay]}
    >
      {console.log('collection nodes', collections)}
      {collections?.map((el, i) => (
        <SwiperSlide key={i} className="swiper-slide-container">
          {
            <a href={`${url}${el.handle}`}>
              <Image
                className="landing-image"
                alt={`Image of ${el.title}`}
                src={el.image.url}
                key={el.id}
              />
            </a>
          }
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

// <div className="overlay-container">

{
  /* <div className="landing-slide"></div> */
}

{
  /* </div> */
}
