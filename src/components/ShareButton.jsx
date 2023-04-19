import React from 'react';

function ShareButton() {
  const shareOnFacebook = () => {
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
  }

  const shareOnInstagram = () => {
    window.open("https://www.instagram.com/share?url=" + encodeURIComponent(window.location.href));
  }

  return (
    <div>
      <button onClick={shareOnFacebook}>Share on Facebook</button>
      <button onClick={shareOnInstagram}>Share on Instagram</button>
    </div>
  );
}

export default ShareButton;
