import {Await, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import {Autoplay, Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import useWidth from '../Hooks/useWidth';
import {isElementAccessExpression} from 'typescript';

/**
 * @param {{
 *   image: ProductVariantFragment['image'];
 * }}
 */
export function ProductImage({image, product}) {
  const width = useWidth();
  console.log('this is the image', product);
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Swiper
        className="product-slider-container"
        navigation
        slidesPerView={width >= 600 ? 2 : 1}
        grabCursor={true}
        modules={[Navigation]}
      >
        {product?.adjacentVariants?.map((el, i) => (
          <SwiperSlide key={i} className="product-page-slide">
            <Image
              className="products-prod-img"
              alt={el?.image.altText || 'Product Image'}
              // data={image}
              src={el?.image.url}
              key={el?.image.id}
              // sizes="(min-width: 45em) 50vw, 100vw"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductVariantFragment} ProductVariantFragment */
