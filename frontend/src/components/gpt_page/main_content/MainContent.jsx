import React, { useCallback, useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import CreatorChat from './chat/CreatorChat';
import AnimationChat from './chat/AnimationChat';
import { GPT_PAGE_CONSTANTS } from '../constants';
import ResponseChat from './chat/ResponseChat';
import { useSearchParams } from 'react-router-dom';
import ShareButtons from '../../share_tile/ShareTile';
import UrlShorteningService from '../../../services/UrlShorteningService';

const MainContent = () => {
	// State variables
	const [isAnimationChatDoneAnimating, setIsAnimationChatDoneAnimating] = useState(false);
	const [isCreatorChatSubmitted, setIsCreatorChatSubmitted] = useState(false);
	const [llmQuery, setLlmQuery] = useState('');
	const [llmResponse, setLlmResponse] = useState('');
	const [clearInputTrigger, setClearInputTrigger] = useState(false);
	const [shortUrl, setShortUrl] = useState(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
	const [countdown, setCountdown] = useState(null);
	const [redirectUrl, setRedirectUrl] = useState(null);
	const [responseTemplate, setResponseTemplate] = useState(null);
	const [popupBlocked, setPopupBlocked] = useState(false);
	const [isCountdownComplete, setIsCountdownComplete] = useState(false);
	const [stayOnJustGptIt, setStayOnJustGptIt] = useState(false);

	// Hooks and variables
	const [searchParams, setSearchParams] = useSearchParams();
	const queryFromUrl = searchParams.get('query') || '';

	// Effects
	useEffect(() => {
		if (queryFromUrl.trim()) {
			console.log(`MainContent: Query from URL: ${queryFromUrl}`);
			setLlmQuery(queryFromUrl);
		}
	}, [queryFromUrl]);

	// Function to generate short URL
	const generateShortUrl = useCallback(async (url) => {
		const query = new URL(url).searchParams.get('query');
		if (query) {
			try {
				const shortenedUrl = await Promise.race([
					UrlShorteningService.shorten_url(url),
					new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000)),
				]);
				setShortUrl(shortenedUrl);
			} catch (error) {
				console.error('Failed to generate short URL:', error);
				setShortUrl(url);
			}
		} else {
			setShortUrl(url);
		}
	}, []);

	// Effect to copy short URL to clipboard when it changes
	useEffect(() => {
		if (shortUrl && shortUrl !== GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT) {
			navigator.clipboard.writeText(shortUrl);
		}
	}, [shortUrl]);

	// Countdown effect with popup handling
	useEffect(() => {
		if (stayOnJustGptIt) {
			// User chose to stay; stop countdown and redirection
			setCountdown(null);
			return;
		}

		if (countdown !== null && countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (countdown === 0 && redirectUrl) {
			setIsCountdownComplete(true); // Indicate that countdown is complete
			// Attempt to open the URL in a new window
			let newWindow = window.open(redirectUrl, '_blank');
			if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
				// Popup was blocked, try opening in the same window
				window.location.href = redirectUrl;
				// Optionally, check if the redirect was successful
				setTimeout(() => {
					if (window.location.href !== redirectUrl && !document.hidden) {
						// Redirect failed, show manual button
						setPopupBlocked(true);
					}
				}, 1000);
			}
		}
	}, [countdown, redirectUrl, stayOnJustGptIt]);

	// Update llmResponse when countdown changes
	useEffect(() => {
		if (countdown !== null && responseTemplate) {
			const newResponse = responseTemplate.replace('<>', countdown);
			setLlmResponse(newResponse);
		}
	}, [countdown, responseTemplate]);

	// Function for CreatorChat submission
	const onCreatorChatSubmit = useCallback(
		(query) => {
			let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(query)}`;
			generateShortUrl(fullUrl); // Call without awaiting
			setLlmQuery(query);
			setIsCreatorChatSubmitted(true);
			// Do not start countdown; set static response
			setLlmResponse(GPT_PAGE_CONSTANTS.CREATOR_STATIC_RESPONSE_NO_COUNTDOWN);
			// Set the redirect URL to open ChatGPT
			const redirect = `https://chatgpt.com/?q=${encodeURIComponent(query)}&hints=search`;
			setRedirectUrl(redirect);
			// Reset stayOnJustGptIt in case it was previously set
			setStayOnJustGptIt(false);
		},
		[generateShortUrl]
	);

	// Updated handleSendMessage function
	const handleSendMessage = useCallback(
		(message) => {
			console.log(`MainContent: User sent message: ${message}`);
			let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(message)}`;
			generateShortUrl(fullUrl); // Call without awaiting
			setLlmQuery(message);
			setLlmResponse('');
			setIsAnimationChatDoneAnimating(true);
			setIsCreatorChatSubmitted(true);
			setCountdown(GPT_PAGE_CONSTANTS.STATIC_RESPONSE_COUNTDOWN_START); // e.g., 7
			setResponseTemplate(GPT_PAGE_CONSTANTS.CREATOR_STATIC_RESPONSE); // Use the correct template
			// Set the redirect URL to open ChatGPT
			const redirect = `https://chatgpt.com/?q=${encodeURIComponent(message)}&hints=search`;
			setRedirectUrl(redirect);
			// Reset stayOnJustGptIt in case it was previously set
			setStayOnJustGptIt(false);
		},
		[generateShortUrl]
	);

	const onQueryChange = useCallback((query) => {
		console.log(`MainContent: Query changed to: ${query}`);
		setLlmQuery(query);
	}, []);

	const handleTypingAnimationDone = useCallback(() => {
		console.log('MainContent: Typing animation done');
		if (llmQuery.trim()) {
			// Start the countdown and set the redirect URL
			setIsAnimationChatDoneAnimating(true);
			setCountdown(GPT_PAGE_CONSTANTS.STATIC_RESPONSE_COUNTDOWN_START); // e.g., 7
			setResponseTemplate(GPT_PAGE_CONSTANTS.RECEIVER_STATIC_RESPONSE); // Use the correct template
			const redirect = `https://chatgpt.com/?q=${encodeURIComponent(llmQuery)}&hints=search`;
			setRedirectUrl(redirect);
			// Reset stayOnJustGptIt in case it was previously set
			setStayOnJustGptIt(false);
		}
	}, [llmQuery]);

	const onNewQuestionClicked = useCallback(() => {
		console.log(`MainContent: User clicked ${GPT_PAGE_CONSTANTS.BACK_BUTTON_TEXT}`);
		setLlmQuery('');
		setLlmResponse('');
		searchParams.delete('query');
		setSearchParams(searchParams);
		setIsAnimationChatDoneAnimating(false);
		setIsCreatorChatSubmitted(false);
		setClearInputTrigger((prev) => !prev);
		setShortUrl(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
		setCountdown(null);
		setRedirectUrl(null);
		setResponseTemplate(null); // Reset the template
		setPopupBlocked(false); // Reset popupBlocked state
		setIsCountdownComplete(false); // Reset countdownComplete state
		setStayOnJustGptIt(false); // Reset stayOnJustGptIt state
	}, [searchParams, setSearchParams]);

	// Updated onOpenGptClicked function
	const onOpenGptClicked = useCallback(() => {
		console.log(`MainContent: User clicked ${GPT_PAGE_CONSTANTS.OPEN_GPT_BUTTON_TEXT}`);
		let redirect;
		if (llmQuery.trim()) {
			redirect = `https://chatgpt.com/?q=${encodeURIComponent(llmQuery)}&hints=search`;
		} else {
			redirect = 'https://www.openai.com/chatgpt';
		}
		window.open(redirect, '_blank');
	}, [llmQuery]);

	// Handler for user-initiated click when popup is blocked
	const handleProceedClick = useCallback(() => {
		window.open(redirectUrl, '_blank');
	}, [redirectUrl]);

	// Handler for "Stay on justGptIt" button click
	const handleStayOnJustGptIt = useCallback(() => {
		setStayOnJustGptIt(true);
		setCountdown(null); // Stop the countdown
	}, []);

	// Decide which component to render based on the current state
	let contentComponent;

	if (queryFromUrl.trim()) {
		// Flow: AnimationChat -> ResponseChat with static response
		contentComponent = !isAnimationChatDoneAnimating ? (
			<AnimationChat
				initialQuery={llmQuery}
				onTypingAnimationDone={handleTypingAnimationDone}
				onQueryChange={onQueryChange}
				clearInputTrigger={clearInputTrigger}
			/>
		) : (
			<ResponseChat
				query={llmQuery}
				response={llmResponse}
				setResponse={setLlmResponse}
				onSendMessage={handleSendMessage}
				onBackClicked={onNewQuestionClicked}
				isCountdownComplete={isCountdownComplete}
				popupBlocked={popupBlocked}
				onProceedClick={handleProceedClick}
				onStayClicked={handleStayOnJustGptIt} // Pass the handler
				countdown={countdown} // Pass countdown to control button visibility
				isCreatorChatFlow={false}
				redirectUrl={redirectUrl}
			/>
		);
	} else {
		if (!isCreatorChatSubmitted) {
			// Show CreatorChat
			contentComponent = (
				<CreatorChat onSubmit={onCreatorChatSubmit} clearInputTrigger={clearInputTrigger} />
			);
		} else {
			// Flow: CreatorChat -> ResponseChat with static response
			contentComponent = (
				<ResponseChat
					query={llmQuery}
					response={llmResponse}
					setResponse={setLlmResponse}
					onSendMessage={handleSendMessage}
					onBackClicked={onNewQuestionClicked}
					isCountdownComplete={isCountdownComplete}
					popupBlocked={popupBlocked}
					onProceedClick={handleProceedClick}
					onStayClicked={handleStayOnJustGptIt} // Pass the handler
					countdown={countdown} // Pass countdown to control button visibility
					isCreatorChatFlow={true}
					redirectUrl={redirectUrl}
				/>
			);
		}
	}

	return (
		<main className={styles.mainContent}>
			<header className={styles.header}>
				<div className={styles.headerButtonsContainer}>
					<button className={styles.backButton} onClick={onNewQuestionClicked}>
						{GPT_PAGE_CONSTANTS.BACK_BUTTON_TEXT}
					</button>
					<button className={styles.openGptButton} onClick={onOpenGptClicked}>
						{GPT_PAGE_CONSTANTS.OPEN_GPT_BUTTON_TEXT}
					</button>
				</div>
				<h1>{GPT_PAGE_CONSTANTS.TITLE}</h1>
			</header>

			<section
				className={
					isAnimationChatDoneAnimating ? styles.querySection : styles.centeredQuerySection
				}
			>
				{contentComponent}
			</section>

			<footer className={styles.footer}>
				<ShareButtons shortUrl={shortUrl} />
				<div className={styles.disclaimer}>{GPT_PAGE_CONSTANTS.DISCLAIMER}</div>
			</footer>
		</main>
	);
};

export default MainContent;
