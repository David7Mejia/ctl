import {defer, redirect} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import '../styles/CollectionPage.css';
import cn from 'classnames';
/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
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
async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Collection() {
  /** @type {LoaderReturnData} */
  const {collection} = useLoaderData();

  return (
    <div className="collection">
      <div className="path-count-holder">
        <div className="collection-path-holder">
          <Link to={'/'} className="collection-path-items">
            HOME
          </Link>
          <p className="collection-path-dash">/</p>

          <p to={'/'} className="collection-path-items collection-path-name">
            {collection?.title?.toUpperCase()}
          </p>
        </div>
        <div className="collection-count-holder">
          {collection?.products?.nodes?.length} ITEMS
        </div>
      </div>

      <h1 className="collection-main-name">
        {collection?.title?.toUpperCase()}
      </h1>
      <p className="collection-description">{collection.description}</p>
      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

function divideProductsIntoSections(products) {
  const sections = [];
  let index = 0;
  let sectionCount = 0;

  while (index < products.length) {
    const sectionType = sectionCount % 3; // Cycle through 0, 1, 2 for each section type
    let items = [];
    let count = sectionType === 2 ? 4 : 5; // Determine count based on section type

    for (let i = index; i < index + count; i++) {
      if (i < products.length) {
        items.push(products[i]);
      }
    }

    sections.push({
      type: `type${sectionType + 1}`, // Assign a type string to help with class naming
      items: items,
    });

    index += count;
    sectionCount++;
  }

  return sections;
}

function ProductsGrid({products}) {
  // Use the chunkProducts to organize products into rows of four
  // const rows = chunkProducts(products);

  return (
    <div className="collection-grid">
      {products.map((product, productIndex) => (
        <div key={productIndex} className="product-row">
          {console.log('this is a aproduct', product)}
          <ProductItem
            key={product.id}
            product={product}
            layoutType={`type${(productIndex % 3) + 1}`} // Optional: Pass layout type if needed
            position={productIndex} // The index of the product within its row
          />
          {/* {row.map((product, productIndex) => (
          ))} */}
        </div>
      ))}
    </div>
  );
}

/**
 * @param {{
 *   product: ProductItemFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
function ProductItem({product, loading, position, layoutType}) {
  const variant = product?.variants?.nodes[0];
  const variantUrl = useVariantUrl(product.handle);

  // Determine class for the large image based on the layout type and product position
  const isLargeImage =
    (layoutType === 'type1' && position === 2) ||
    (layoutType === 'type2' && position === 0);
  const imageClass = isLargeImage ? 'lg_img' : 'sm_img';

  return (
    <Link
      className={`collection-product ${isLargeImage ? 'lg_img' : 'sm_img'}`}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {console.log('this is in product ONLY PRODUCT item', product)}
      {product.featuredImage && (
        <Image
          className="collection-product-image"
          alt={product.featuredImage.altText || product.title}
          data={product.featuredImage}
          loading={position < 10 ? 'eager' : 'lazy'}
        />
      )}
      <div className="item-info-container">
        <p className="small-product-title">{product?.title?.toUpperCase()}</p>
        {/* <small> */}
        <Money
          className="product-price-col"
          data={product.priceRange.minVariantPrice}
        />
        {/* </small> */}
      </div>
    </Link>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    collections(first: 1) {
      nodes {
        id
        title
        handle
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
