import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {SlideShow} from '~/components/SlideShow';
import {FirstCollection} from '~/components/FirstCollection/index';
import {SecondCollection} from '~/components/SecondCollection/index';
import {ThirdCollection} from '~/components/ThirdCollection/index';
import {HomeMessage} from '~/components/HomeMessage/index';
import {Newsletter} from '~/components/Newsletter/index';
import LandingVideo from '~/components/LandingVideo/index';
/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
// async function loadCriticalData({context}) {
//   const [{collections}] = await Promise.all([
//     context.storefront.query(FEATURED_COLLECTION_QUERY),
//     // Add other queries here, so that they are loaded in parallel
//   ]);

//   return {
//     featuredCollection: collections.nodes[0],
//   };

// }
async function loadCriticalData({context}) {
  const {storefront} = context;
  try {
    const [
      featuredCollection, // Result of first query
      {collections},
      doubleImage,
      secondColSlider,
      thirdColSlider,
    ] = await Promise.all([
      storefront.query(FEATURED_COLLECTION_QUERY, {
        cache: storefront.CacheLong(),
      }),
      storefront.query(COLLECTIONS_QUERY),
      storefront.query(FEATURED_DOUBLE_IMAGE_QUERY),
      storefront.query(SECOND_COLLECTION_SLIDER_QUERY),
      storefront.query(THIRD_COLLECTION_SLIDER_QUERY),
    ]);

    return {
      featuredCollection,
      collections,
      doubleImage,
      secondColSlider,
      thirdColSlider,
    };
  } catch (error) {
    console.error('Error fetching critical data:', error);
    throw new Error('Failed to fetch critical data');
  }
}
/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    // <div className="home">
    //   <FeaturedCollection collection={data.featuredCollection} />
    //   <RecommendedProducts products={data.recommendedProducts} />
    // </div>
    <section className="w-full gap-4">
      <div className="index-holder grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-3">
        <SlideShow collection={data?.collections} />
        {/* <FeaturedCollection collection={data.featuredCollection} /> */}
        {/* <RecommendedProducts products={data.recommendedProducts} /> */}
        <FirstCollection featured={data?.doubleImage} />
        <SecondCollection featured={data?.secondColSlider?.collection} />
        <LandingVideo />
        {/* <ThirdCollection featured={data?.thirdColSlider?.collection} /> */}
        <HomeMessage />
        <Newsletter />
      </div>
    </section>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <Link
                      key={product.id}
                      className="recommended-product"
                      to={`/products/${product.handle}`}
                    >
                      <Image
                        data={product.images.nodes[0]}
                        aspectRatio="1/1"
                        sizes="(min-width: 45em) 20vw, 50vw"
                      />
                      <h4>{product.title}</h4>
                      <small>
                        <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </Link>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;
const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
const FEATURED_DOUBLE_IMAGE_QUERY = `#graphql
fragment FeaturedProduct on Product {
  id
  title
  images(first: 1, sortKey: POSITION) {
      nodes {
        id
        url
        altText
        width
        height
    }
  }
  collections(first: 1) {
    edges {
      node {
        handle
        title
      }
    }
  }
  tags
}
query GetFeaturedProducts {
  products(first: 2, query: "tag:collectionFeatured") {
    edges {
      node {
        ...FeaturedProduct
      }
    }
  }
}
`;
const SECOND_COLLECTION_SLIDER_QUERY = `#graphql
query SecondCollectionSlider {
  collection(handle: "SWIMWEAR") {
    title
    image {
      id
      url
    }
    products(first: 20) {
      nodes {
        id
        title
        onlineStoreUrl
        images(first: 20) {
          nodes {
            id
            url
          }
        }
         handle
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
      }
    }

  }
}
`;
const THIRD_COLLECTION_SLIDER_QUERY = `#graphql
query ThirdCollectionSlider {
  collection(handle: "dresses") {
    title
    image {
      id
      url
    }
    products(first: 20) {
      nodes {
        id
        title
        onlineStoreUrl
        images(first: 20) {
          nodes {
            id
            url
          }
        }
         handle
        priceRange {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
      }
    }
  }
}
`;
/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
