// MainContent.jsx
import React, { useCallback, useState, useEffect } from 'react';
import styles from './MainContent.module.css';
import CreatorChat from './chat/CreatorChat';
import AnimationChat from './chat/AnimationChat';
import { GPT_PAGE_CONSTANTS } from '../constants';
import ResponseChat from './chat/ResponseChat';
import { useSearchParams } from 'react-router-dom';
import ShareButtons from '../../share_tile/ShareTile';
import UrlShorteningService from '../../../services/UrlShorteningService';
import LlmQueryService from '../../../services/LlmQueryService';

const MainContent = () => {
	// State variables
	const [isAnimationChatDoneAnimating, setIsAnimationChatDoneAnimating] = useState(false);
	const [isCreatorChatSubmitted, setIsCreatorChatSubmitted] = useState(false);
	const [llmQuery, setLlmQuery] = useState('');
	const [llmResponse, setLlmResponse] = useState('');
	const [boilerplateMessage, setBoilerplateMessage] = useState('');
	const [clearInputTrigger, setClearInputTrigger] = useState(false);
	const [shortUrl, setShortUrl] = useState(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
	const [redirectUrl, setRedirectUrl] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const queryFromUrl = searchParams.get('query') || '';

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
				setShortUrl(url);
			}
		} else {
			setShortUrl(url);
		}
	}, []);

	const fetchLlmResponse = useCallback(async (query) => {
		if (!query.trim()) return;
		try {
			const response = await LlmQueryService.queryLLMService(query);
			setLlmResponse(response);
		} catch (error) {
			setLlmResponse(GPT_PAGE_CONSTANTS.RECEIVER_STATIC_RESPONSE_NO_COUNTDOWN);
		}
		setBoilerplateMessage(GPT_PAGE_CONSTANTS.CREATOR_STATIC_RESPONSE_NO_COUNTDOWN);
		const redirect = `https://chatgpt.com/?q=${encodeURIComponent(query)}&hints=search`;
		setRedirectUrl(redirect);
	}, []);

	useEffect(() => {
		if (queryFromUrl.trim()) {
			setLlmQuery(queryFromUrl);
			(async () => {
				let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(queryFromUrl)}`;
				await generateShortUrl(fullUrl);
				fetchLlmResponse(queryFromUrl);
			})();
		}
	}, [queryFromUrl, generateShortUrl, fetchLlmResponse]);

	const onCreatorChatSubmit = useCallback(async (query) => {
		let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(query)}`;
		await generateShortUrl(fullUrl);
		setLlmQuery(query);
		setIsCreatorChatSubmitted(true);
		fetchLlmResponse(query);
	}, [generateShortUrl, fetchLlmResponse]);

	const handleSendMessage = useCallback(async (message) => {
		let fullUrl = `${window.location.origin}${window.location.pathname}?query=${encodeURIComponent(message)}`;
		await generateShortUrl(fullUrl);
		setLlmQuery(message);
		fetchLlmResponse(message);
	}, [generateShortUrl, fetchLlmResponse]);

	const onQueryChange = useCallback((query) => {
		setLlmQuery(query);
	}, []);

	const handleTypingAnimationDone = useCallback(() => {
		setIsAnimationChatDoneAnimating(true);
	}, []);

	const onNewQuestionClicked = useCallback(() => {
		setLlmQuery('');
		setLlmResponse('');
		setBoilerplateMessage('');
		searchParams.delete('query');
		setSearchParams(searchParams);
		setIsAnimationChatDoneAnimating(false);
		setIsCreatorChatSubmitted(false);
		setClearInputTrigger((prev) => !prev);
		setShortUrl(GPT_PAGE_CONSTANTS.SHORT_URL_DEFAULT);
		setRedirectUrl(null);
	}, [searchParams, setSearchParams]);

	const onOpenGptClicked = useCallback(() => {
		let redirect;
		if (llmQuery.trim()) {
			redirect = `https://chatgpt.com/?q=${encodeURIComponent(llmQuery)}&hints=search`;
		} else {
			redirect = 'https://www.openai.com/chatgpt';
		}
		window.open(redirect, '_blank');
	}, [llmQuery]);

	let contentComponent;
	if (queryFromUrl.trim()) {
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
				extraMessage={boilerplateMessage}
				setResponse={setLlmResponse}
				onSendMessage={handleSendMessage}
				onBackClicked={onNewQuestionClicked}
				isCreatorChatFlow={false}
				redirectUrl={redirectUrl}
				shortUrl={shortUrl}
			/>
		);
	} else {
		if (!isCreatorChatSubmitted) {
			contentComponent = (
				<CreatorChat onSubmit={onCreatorChatSubmit} clearInputTrigger={clearInputTrigger} />
			);
		} else {
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
					extraMessage={boilerplateMessage}
					setResponse={setLlmResponse}
					onSendMessage={handleSendMessage}
					onBackClicked={onNewQuestionClicked}
					isCreatorChatFlow={true}
					redirectUrl={redirectUrl}
					shortUrl={shortUrl}
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
