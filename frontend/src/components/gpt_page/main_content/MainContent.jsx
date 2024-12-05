import React, { useCallback, useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import CreatorChat from './chat/CreatorChat';
import AnimationChat from './chat/AnimationChat';
import { GPT_PAGE_CONSTANTS } from '../constants';
import ResponseChat from './chat/ResponseChat';
import useLlmQuery from './chat/hooks/useLlmQuery';
import { useLocation, useSearchParams } from 'react-router-dom';
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
	const [redirectUrl, setRedirectUrl] = useState(null); // New state variable

	// Hooks and variables
	const queryLlm = useLlmQuery(setLlmResponse);
	const location = useLocation();
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
					new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
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
			navigator.clipboard.writeText(shortUrl)
			// .then(() => {
			// 	alert("Link copied to clipboard!");
			// });
		}
	}, [shortUrl]);

	// Countdown effect
	useEffect(() => {
		if (countdown !== null && countdown > 0) {
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [countdown]);

	// Update llmResponse when countdown changes
	useEffect(() => {
		if (countdown !== null) {
			const responseTemplate = redirectUrl
				? GPT_PAGE_CONSTANTS.RECEIVER_STATIC_RESPONSE
				: GPT_PAGE_CONSTANTS.CREATOR_STATIC_RESPONSE;
			const newResponse = responseTemplate.replace('<>', countdown);
			setLlmResponse(newResponse);
		}
	}, [countdown, redirectUrl]);

	// Redirect effect
	useEffect(() => {
		if (countdown === 0 && redirectUrl) {
			window.location.href = redirectUrl;
		}
	}, [countdown, redirectUrl]);

	// Function for CreatorChat submission
	const onCreatorChatSubmit = useCallback(
		async (query) => {
			let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(query)}`;
			await generateShortUrl(fullUrl);
			setLlmQuery(query);
			setIsCreatorChatSubmitted(true);
			setCountdown(GPT_PAGE_CONSTANTS.STATIC_RESPONSE_COUNTDOWN_START); // e.g., 5
			setRedirectUrl(null); // No redirection for creator flow
			// Do not update the URL's query parameter
		},
		[generateShortUrl]
	);

	// Callbacks
	const onQueryChange = useCallback((query) => {
		console.log(`MainContent: Query changed to: ${query}`);
		setLlmQuery(query);
	}, []);

	const handleTypingAnimationDone = useCallback(() => {
		console.log('MainContent: Typing animation done');
		if (llmQuery.trim()) {
			// Instead of querying LLM, start the countdown and set the redirect URL
			setIsAnimationChatDoneAnimating(true);
			setCountdown(GPT_PAGE_CONSTANTS.STATIC_RESPONSE_COUNTDOWN_START); // e.g., 5
			const redirect = `https://chatgpt.com/?q=${encodeURIComponent(llmQuery)}&hints=search`;
			setRedirectUrl(redirect);
		}
	}, [llmQuery]);

	const handleSendMessage = useCallback(
		(message) => {
			console.log(`MainContent: User sent message: ${message}`);
			setLlmQuery(message);
			queryLlm(message);
			searchParams.set('query', message);
			setSearchParams(searchParams);
		},
		[queryLlm, searchParams, setSearchParams]
	);

	const onNewQuestionClicked = useCallback(() => {
		console.log(`MainContent: User clicked ${GPT_PAGE_CONSTANTS.NEW_QUESTION_BUTTON_TEXT}`);
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
	}, [searchParams, setSearchParams]);

	const onOpenGptClicked = useCallback(() => {
		console.log(`MainContent: User clicked ${GPT_PAGE_CONSTANTS.OPEN_GPT_BUTTON_TEXT}`);
		window.open('https://www.openai.com/chatgpt', '_blank');
	}, []);

	// Decide which component to render based on the current state
	let contentComponent;

	if (queryFromUrl.trim()) {
		// Flow: AnimationChat -> ResponseChat with static RECEIVER response
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
			/>
		);
	} else {
		if (!isCreatorChatSubmitted) {
			// Show CreatorChat
			contentComponent = (
				<CreatorChat onSubmit={onCreatorChatSubmit} clearInputTrigger={clearInputTrigger} />
			);
		} else {
			// Flow: CreatorChat -> ResponseChat with static CREATOR response
			contentComponent = (
				<ResponseChat
					query={llmQuery}
					response={llmResponse}
					setResponse={setLlmResponse}
					onSendMessage={handleSendMessage}
					onBackClicked={onNewQuestionClicked}
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
				{/* <div className={styles.userIcon}>{GPT_PAGE_CONSTANTS.USER_ICON_TEXT}</div> */}
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
