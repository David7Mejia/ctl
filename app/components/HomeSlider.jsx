import React, {useState, useCallback, useRef} from 'react';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Autoplay, Navigation} from 'swiper/modules';
import {useLoaderData, Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import cn from 'classnames';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/HomeSlider.css';
import SwiperNext from './SwiperNext';
import SwiperPrev from './SwiperPrev';
import {useVariantUrl} from '~/lib/variants';
import useWidth from '../Hooks/useWidth';

const HomeSlider = ({featured}) => {
  const width = useWidth();
  let products = featured?.products?.nodes;
  const variants = products?.nodes?.variants?.nodes[0];
  // const variantUrl = useVariantUrl(
  //   products?.nodes?.handle,
  //   // variants?.selectedOptions[0],
  // );
  // console.log(
  //   'this is featured from homeslider',
  //   products,
  //   products?.handle,
  //   variants,
  // );

  // console.log('collection collection22222222', featured);
  // console.log('SHOEEEEEEES', products);

  const swiper = useSwiper();
  return (
    <Swiper
      className="home-slider-container"
      navigation
      // autoplay={{
      //   delay: 4000,
      //   disableOnInteraction: true,
      // }}
      grabCursor={true}
      slidesPerView={width <= 749 ? 'auto' : 4}
      // loop={true}
      // speed={3000}
      modules={[Navigation]}
      loop={true}
    >
      <div className="home-swipe-buttons">
        <SwiperPrev />
        <SwiperNext />
      </div>
      {products?.map((el, i) => (
        <SwiperSlide key={i} className="home-slider-slides-container">
          <Link
            key={i}
            className="home-slider-product-link"
            to={`${useVariantUrl(
              el.handle,
              el?.variants?.nodes[0].selectedOptions,
            )}`}
          >
            <Image
              className="home-slider-image"
              alt={`Image of ${el.title}`}
              src={el.images?.nodes[0]?.url}
              key={el.id}
            />
            <div className="slider-pr-info-holder">
              <p className={'home-slider-product-title'}>{el.title}</p>
              <p className={'home-slider-product-title'}>
                {el?.priceRange?.minVariantPrice?.amount}
              </p>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSlider;
