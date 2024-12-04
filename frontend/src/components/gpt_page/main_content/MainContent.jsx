import React, { useCallback, useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import InitialChat from './chat/InitialChat';
import { GPT_PAGE_CONSTANTS } from '../constants';
import ResponseChat from './chat/ResponseChat';
import useLlmQuery from './chat/hooks/useLlmQuery';
import { useLocation, useSearchParams } from 'react-router-dom';
import ShareButtons from '../../share_tile/ShareTile';
import UrlShorteningService from '../../../services/UrlShorteningService';

const MainContent = () => {
	// State variables
	const [isInitialChatDoneAnimating, setIsInitialChatDoneAnimating] = useState(false);
	const [llmQuery, setLlmQuery] = useState('');
	const [llmResponse, setLlmResponse] = useState('');
	const [clearInputTrigger, setClearInputTrigger] = useState(false);
	const [shortUrl, setShortUrl] = useState(''); // New state for the shortened URL

	// Hooks and variables
	const queryLlm = useLlmQuery(setLlmResponse);
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const queryFromUrl = searchParams.get('query') || '';

	// Effects
	useEffect(() => {
		if (!location.pathname.startsWith('/r/')) {
			console.log(`MainContent: Query from URL: ${queryFromUrl}`);
			queryLlm(queryFromUrl);
			setLlmQuery(queryFromUrl);
		}
	}, [location.pathname, queryFromUrl, queryLlm]);

	// Callbacks
	const onQueryChange = useCallback((query) => {
		console.log(`MainContent: Query changed to: ${query}`);
		setLlmQuery(query);
	}, []);

	const handleTypingAnimationDone = useCallback(() => {
		console.log('MainContent: Typing animation done');
		if (llmQuery.trim()) {
			queryLlm(llmQuery);
			searchParams.set('query', llmQuery);
			setSearchParams(searchParams);
		}
		setIsInitialChatDoneAnimating(true);
	}, [llmQuery, queryLlm, searchParams, setSearchParams]);

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
		setIsInitialChatDoneAnimating(false);
		setClearInputTrigger((prev) => !prev);
		setShortUrl(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT); // Reset the short URL
	}, [searchParams, setSearchParams]);

	const onOpenGptClicked = useCallback(() => {
		console.log(`MainContent: User clicked ${GPT_PAGE_CONSTANTS.OPEN_GPT_BUTTON_TEXT}`);
		window.open('https://www.openai.com/chatgpt', '_blank');
	}, []);

	// Generate short URL whenever the query changes
	useEffect(() => {
		const generateShortUrl = async () => {
			const query = searchParams.get('query');
			if (query) {
				const fullUrl = window.location.href;
				try {
					const shortenedUrl = await UrlShorteningService.shorten_url(fullUrl);
					setShortUrl(shortenedUrl);
				} catch (error) {
					console.error('Failed to generate short URL:', error);
					setShortUrl(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
				}
			} else {
				setShortUrl(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
			}
		};

		generateShortUrl();
	}, [searchParams]);

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
					isInitialChatDoneAnimating ? styles.querySection : styles.centeredQuerySection
				}
			>
				{!isInitialChatDoneAnimating ? (
					<InitialChat
						initialQuery={llmQuery}
						onTypingAnimationDone={handleTypingAnimationDone}
						onLlmResponse={setLlmResponse}
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
				)}
			</section>

			<footer className={styles.footer}>
				<ShareButtons shortUrl={shortUrl} />
				<div className={styles.disclaimer}>{GPT_PAGE_CONSTANTS.DISCLAIMER}</div>
			</footer>
		</main>
	);
};

export default MainContent;
