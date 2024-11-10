"use client";

import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import styles from "./ShareTile.module.css";


const ShareButtons = () => {
//   const currentUrl = encodeURIComponent(window.location.href);
  const currentUrl = encodeURIComponent("https://tinyurl.com/mfeabcr7");
  const message = encodeURIComponent("Here, I asked that for you:");

  const iconSize = 25;

  const shareOnFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${message}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${message}&summary=${message}&source=${encodeURIComponent(
      "LetMeAskForYou"
    )}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${message}%20${currentUrl}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="share-buttons">
      <button className={styles.shareButton} onClick={shareOnFacebook} aria-label="Share on Facebook">
        <FaFacebook size={iconSize}/>
      </button>
      <button className={styles.shareButton} onClick={shareOnTwitter} aria-label="Share on Twitter">
        <FaTwitter size={iconSize} />
      </button>
      <button className={styles.shareButton} onClick={shareOnLinkedIn} aria-label="Share on LinkedIn">
        <FaLinkedin size={iconSize} />
      </button>
      <button className={styles.shareButton} onClick={shareOnWhatsApp} aria-label="Share on WhatsApp">
        <FaWhatsapp size={iconSize} />
      </button>
    </div>
  );
};

export default ShareButtons;