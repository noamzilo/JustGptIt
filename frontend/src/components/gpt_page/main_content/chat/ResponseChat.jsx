import React, { useCallback } from 'react';
import styles from './ResponseChat.module.css';
import ChatMessage from './ChatMessage';
import ChatInputPane from './ChatInputPane';
import { GPT_PAGE_CONSTANTS } from '../../constants';

function ResponseChat({
	query,
	response,
	setResponse,
	onSendMessage,
	onBackClicked,
	isCountdownComplete,
	popupBlocked,
	onProceedClick,
	onStayClicked,
	countdown, // Receive countdown to control button visibility
	isCreatorChatFlow, // New prop to identify the CreatorChat flow
	redirectUrl, // New prop for the redirect URL
}) {
	const handleSend = useCallback(
		(inputValue) => {
			onSendMessage(inputValue);
			setResponse('');
		},
		[onSendMessage, setResponse]
	);

	return (
		<div className={styles.chatContainer}>
			<div className={styles.messagesContainer}>
				<ChatMessage message={query} isUser={true} />
				<ChatMessage message={response} isUser={false} />

				{/* Conditionally render the "Stay on justGptIt" button during countdown */}
				{!isCreatorChatFlow && countdown > 0 && (
					<div className={styles.stayButtonContainer}>
						<button className={styles.stayButton} onClick={onStayClicked}>
							{GPT_PAGE_CONSTANTS.STOP_REDIRECTION_BUTTON_TEXT}
						</button>
					</div>
				)}

				{/* Conditionally render the button when popup is blocked */}
				{!isCreatorChatFlow && isCountdownComplete && popupBlocked && (
					<div className={styles.popupBlockedContainer}>
						<p>{GPT_PAGE_CONSTANTS.POPUP_BLOCKED_MESSAGE}</p>
						<button className={styles.popupBlockedButton} onClick={onProceedClick}>
							{GPT_PAGE_CONSTANTS.POPUP_BLOCKED_BUTTON_TEXT}
						</button>
					</div>
				)}

				{/* Render "Open In ChatGPT" button for CreatorChat flow */}
				{isCreatorChatFlow && (
					<div className={styles.redirectButtonContainer}>
						<button
							className={styles.redirectButton}
							onClick={() => window.open(redirectUrl, '_blank')}
						>
							{GPT_PAGE_CONSTANTS.GO_TO_GPT_REDIRECTION_BUTTON_TEXT}
						</button>
					</div>
				)}
			</div>
			<ChatInputPane
				onSubmit={handleSend}
				isAnimating={false}
				animatingTextValue=""
				placeholder={GPT_PAGE_CONSTANTS.QUERY_PLACEHOLDER_CHAT}
			/>
		</div>
	);
}

export default ResponseChat;
