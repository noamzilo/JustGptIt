import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const ShareButtons = () => {
    const urlToShare = encodeURIComponent(window.location.href);
	const textToShare = encodeURIComponent("Here, I Asked That For You");

    const iconSize = 25;

    const shareOnFacebook = () => {
        const fbUrl = `https://www.addtoany.com/add_to/facebook?linkurl=${urlToShare}&linkname=${textToShare}`;
		window.open(fbUrl, '_blank');
    };

    const shareOnTwitter = () => {
        const twitterUrl = `https://twitter.com/share?url=${encodeURIComponent(urlToShare)}&text=${encodeURIComponent(textToShare)}`;
        window.open(twitterUrl, '_blank');
    };

    const shareOnLinkedIn = () => {
        const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(urlToShare)}&title=${encodeURIComponent(textToShare)}`;
        window.open(linkedInUrl, '_blank');
    };

    const shareOnWhatsApp = () => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}%20${encodeURIComponent(urlToShare)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="shareButtons">
            <button onClick={shareOnFacebook}>
                <FaFacebook size={iconSize} />
            </button>
            <button onClick={shareOnTwitter}>
                <FaTwitter size={iconSize} />
            </button>
            <button onClick={shareOnLinkedIn}>
                <FaLinkedin size={iconSize} />
            </button>
            <button onClick={shareOnWhatsApp}>
                <FaWhatsapp size={iconSize} />
            </button>
        </div>
    );
};

export default ShareButtons;
