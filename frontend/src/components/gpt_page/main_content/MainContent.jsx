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
	const [llmQuery, setLlmQuery] = useState('');
	const [llmResponse, setLlmResponse] = useState('');
	const [clearInputTrigger, setClearInputTrigger] = useState(false);
	const [shortUrl, setShortUrl] = useState(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);

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

	// Callbacks
	const onQueryChange = useCallback((query) => {
		console.log(`MainContent: Query changed to: ${query}`);
		setLlmQuery(query);
	}, []);

	const handleTypingAnimationDone = useCallback(() => {
		console.log('MainContent: Typing animation done');
		if (llmQuery.trim()) {
			queryLlm(llmQuery);
		}
		setIsAnimationChatDoneAnimating(true);
	}, [llmQuery, queryLlm]);

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

	// Decide which component to render based on whether query is present
	let contentComponent;

	if (queryFromUrl.trim()) {
		// If query is present in URL, show AnimationChat or ResponseChat
		contentComponent = !isAnimationChatDoneAnimating ? (
			<AnimationChat
				initialQuery={llmQuery}
				onTypingAnimationDone={handleTypingAnimationDone}
				onQueryChange={onQueryChange}
				clearInputTrigger={clearInputTrigger} // Passed down as in your original code
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
		// No query in URL, show CreatorChat
		function onCreatorChatSubmit(query){
			setLlmQuery(query);
			searchParams.set('query', query);
			setSearchParams(searchParams);
		}
		contentComponent = (
			<CreatorChat
				onSubmit={(query) => {onCreatorChatSubmit(query);}}
				clearInputTrigger={clearInputTrigger} // Included as per your original code
			/>
		);
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
