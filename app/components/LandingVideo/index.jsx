import React from 'react';
import ReactPlayer from 'react-player';

const LandingVideo = () => {
  const url =
    'https://cdn.shopify.com/videos/c/o/v/e7f631a185f94fb6ad8278ee9da357f3.mov';
  return (
    <div className="home-video-container">
      <ReactPlayer
        playing={true}
        url={url}
        loop={true}
        width={'100%'}
        playsinline={true}
        height={'auto'}
        // controls={true}
        volume={0}
        muted={true}
      />
    </div>
  );
};

export default LandingVideo;
