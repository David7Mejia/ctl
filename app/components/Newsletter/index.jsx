import React from 'react';

export const Newsletter = () => {
  return (
    <div className="newsletter-section">
      <h1 className="large-message-news">NEWSLETTER</h1>
      <p className="small-message-news">
        be the first to know about exclusive product launches, sales and so much
        more!
      </p>
      <div className="news-input">
        <input type="text" className="news-input-text" placeholder="EMAIL" />
        <button className="news-input-button"></button>
      </div>
    </div>
  );
};
