import React from 'react';
import {Image} from '@shopify/hydrogen';
import '../../styles/FeaturedImages.css';
import {useLoaderData, Link, json} from '@remix-run/react';

const FeaturedImagesFromCollection = ({featured}) => {
  /** @type {LoaderReturnData} */

  let {doubleImageData} = useLoaderData();
  return (
    <div className="featured-images-container">
      {/* {featured?.products?.nodes?.map((el, i) => (
        <Link className={`featured-img-link-${i}`} to={`/`}>
          <Image
            className={`featured-prod-image-${i}`}
            src={el?.images?.nodes[0]?.url}
          />
        </Link>
      ))} */}
      {/* <Link className={`featured-img-link-1`}> */}
      <Image
        className={`featured-prod-image-0`}
        src={featured?.products?.edges[0]?.node?.images?.nodes[0]?.url}
      />
      {/* </Link> */}
      {/* <Link className={`featured-prod-image-0`}> */}
      <Image
        className="featured-prod-image-1"
        // alt={`Image of ${el.title}`}
        src={featured?.products?.edges[1]?.node?.images?.nodes[0]?.url}
        //   key={el.id}
      />
      {/* </Link> */}
    </div>
  );
};
export default FeaturedImagesFromCollection;

// const FEATURED_DOUBLE_IMAGE_QUERY = `#graphql
// fragment FeaturedProduct on Product {
//   id
//   title
//   images(first: 1, sortKey: POSITION) {
//     edges {
//       node {
//         id
//         url
//         altText
//         width
//         height
//       }
//     }
//   }
//   tags
// }
// query GetFeaturedProducts {
//   products(first: 2, query: "tag:collectionFeatured") {
//     edges {
//       node {
//         ...FeaturedProduct
//       }
//     }
//   }
// }
// `;
