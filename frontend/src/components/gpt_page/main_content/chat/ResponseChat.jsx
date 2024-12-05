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
				{/* Conditionally render the button when popup is blocked */}
				{isCountdownComplete && popupBlocked && (
					<div className={styles.popupBlockedContainer}>
						<p>{GPT_PAGE_CONSTANTS.POPUP_BLOCKED_MESSAGE}</p>
						<button className={styles.popupBlockedButton} onClick={onProceedClick}>
							{GPT_PAGE_CONSTANTS.POPUP_BLOCKED_BUTTON_TEXT}
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
