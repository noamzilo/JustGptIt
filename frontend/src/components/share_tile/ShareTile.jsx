"use client";

import React from "react";
import {
	FaFacebook,
	FaTwitter,
	// FaLinkedin,
	FaWhatsapp,
	FaLink,
} from "react-icons/fa";
import styles from "./ShareTile.module.css";

const ShareButtons = ({ shortUrl }) => {
	const iconSize = 25;
	const message = encodeURIComponent("Here, I asked that for you:");
	const [sharedUrl, setSharedUrl] = React.useState("");

	React.useEffect(() => {
		if (shortUrl) {
			setSharedUrl(shortUrl);
			console.log(`Shared URL changed1 to: ${sharedUrl}`);
		} else {
			setSharedUrl(window.location.href);
			console.log(`Shared URL changed2 to: ${sharedUrl}`);
		}

	}, [shortUrl, setSharedUrl, sharedUrl]);

	const shareOnFacebook = () => {
		const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${sharedUrl}`;
		window.open(fbUrl, "_blank", "noopener,noreferrer");
	};

	const shareOnTwitter = () => {
		const twitterUrl = `https://twitter.com/intent/tweet?url=${sharedUrl}&text=${message}`;
		window.open(twitterUrl, "_blank", "noopener,noreferrer");
	};

	// doesn't work. 
	// const shareOnLinkedIn = () => {
	// 	if (!shortUrl) return;
	// 	const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${message}&summary=${message}&source=${encodeURIComponent(
	// 		"LetMeAskForYou"
	// 	)}`;
	// 	window.open(linkedInUrl, "_blank", "noopener,noreferrer");
	// };

	const shareOnWhatsApp = () => {
		const whatsappUrl = `https://wa.me/?text=${message}%20${sharedUrl}`;
		window.open(whatsappUrl, "_blank", "noopener,noreferrer");
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(sharedUrl).then(() => {
			alert("Link copied to clipboard!");
		});
	};

	return (
		<div className="share-buttons">
			<button
				className={styles.shareButton}
				onClick={shareOnFacebook}
				aria-label="Share on Facebook"
			>
				<FaFacebook size={iconSize} />
			</button>
			<button
				className={styles.shareButton}
				onClick={shareOnTwitter}
				aria-label="Share on Twitter"
			>
				<FaTwitter size={iconSize} />
			</button>
			{/* <button
				className={styles.shareButton}
				onClick={shareOnLinkedIn}
				aria-label="Share on LinkedIn"
			>
				<FaLinkedin size={iconSize} />
			</button> */}
			<button
				className={styles.shareButton}
				onClick={shareOnWhatsApp}
				aria-label="Share on WhatsApp"
			>
				<FaWhatsapp size={iconSize} />
			</button>
			<button
				className={styles.shareButton}
				onClick={copyToClipboard}
				aria-label="Copy link to clipboard"
			>
				<FaLink size={iconSize} />
			</button>
		</div>
	);
};

export default ShareButtons;
