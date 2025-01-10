import React from 'react';
import {useLoaderData, Link} from '@remix-run/react';
import '../../styles/FirstCollection.css';
import FeaturedImagesFromCollection from './FeaturedImagesFromCollection';

export const FirstCollection = ({featured}) => {
  return (
    <>
      <FeaturedImagesFromCollection featured={featured} />
      <div className="first-collection-container">
        <div className="first-collection-banner">
          <Link className="first-collection-banner-title">
            {
              featured?.products?.edges[0]?.node?.collections?.edges[0]?.node
                ?.title
            }
          </Link>

          <Link className="first-collection-cta">
            {`SHOP ${featured?.products?.edges[0]?.node?.collections?.edges[0]?.node?.title?.toUpperCase()}`}
          </Link>
        </div>
      </div>
    </>
  );
};
