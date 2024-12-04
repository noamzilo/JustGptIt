import React, { useCallback } from 'react';
import styles from './CreatorChat.module.css';
import ChatInputPane from './ChatInputPane';
import { GPT_PAGE_CONSTANTS } from '../../constants';

function CreatorChat({ onSubmit, clearInputTrigger }) {
	const handleSend = useCallback(
		(inputValue) => {
			console.log('Send button clicked in CreatorChat');
			if (inputValue.trim()) {
				onSubmit(inputValue);
			}
		},
		[onSubmit]
	);

	return (
		<div className={styles.inputContainer}>
			<h2 className={styles.querySectionText}>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
			<h3 className={styles.querySectionText_2}>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT_2}</h3>
			<ChatInputPane
				onSubmit={handleSend}
				placeholder={GPT_PAGE_CONSTANTS.QUERY_PLACEHOLDER}
				clearInputTrigger={clearInputTrigger} // Included as per your original code
			/>
		</div>
	);
}

export default CreatorChat;
