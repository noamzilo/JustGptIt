import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const ShareButtons = () => {
    const urlToShare = window.location.href;

    const shareOnFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`;
        window.open(fbUrl, '_blank');
    };

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(urlToShare)}&text=Check this out!`;
        window.open(twitterUrl, '_blank');
    };

    const shareOnLinkedIn = () => {
        const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(urlToShare)}`;
        window.open(linkedInUrl, '_blank');
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(urlToShare)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="share-buttons">
            <button onClick={shareOnFacebook}>
                <FaFacebook /> Share on Facebook
            </button>
            <button onClick={shareOnTwitter}>
                <FaTwitter /> Share on Twitter
            </button>
            <button onClick={shareOnLinkedIn}>
                <FaLinkedin /> Share on LinkedIn
            </button>
            <button onClick={shareOnWhatsApp}>
                <FaWhatsapp /> Share on WhatsApp
            </button>
        </div>
    );
};

export default ShareButtons;
