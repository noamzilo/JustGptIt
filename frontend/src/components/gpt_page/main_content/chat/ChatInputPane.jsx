import React, { useCallback, useRef, useState, useEffect } from 'react';
import useTypingAnimation from './hooks/useTypingAnimation';
import styles from './ChatInputPane.module.css';

function ChatInputPane({ onSubmit, isAnimating, animatingTextValue, onAnimationComplete, placeholder, clearInputTrigger }) {
	const [inputValue, setInputValue] = useState('');
	const textareaRef = useRef(null);

	// Integrate useTypingAnimation
	const animatedText = useTypingAnimation(animatingTextValue, isAnimating, async () => {
		if (!isAnimating) {
			setInputValue('');
		}
		await new Promise(r => setTimeout(r, 300));
		onAnimationComplete();
	});

	useEffect(() => {
		setInputValue(''); // Clear input when clearInputTrigger changes
		textareaRef.current?.focus();
	}, [clearInputTrigger]);

	const handleSendClick = useCallback(() => {
		if (inputValue.trim()) {
			onSubmit(inputValue);
			setInputValue('');
		}
	}, [inputValue, onSubmit]);

	const handleKeyPress = useCallback(
		(e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSendClick();
			}
		},
		[handleSendClick]
	);

	const handleChange = useCallback((e) => {
		setInputValue(e.target.value);
	}, []);

	const displayValue = isAnimating ? animatedText : inputValue;

	return (
		<div className={styles.inputContainer}>
			<textarea
				ref={textareaRef}
				placeholder={placeholder}
				value={displayValue}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				className={isAnimating ? styles.typingAnimation : ''}
				readOnly={isAnimating}
				aria-label="Message input"
			/>
			<button
				onClick={handleSendClick}
				className={`${styles.sendButton} ${displayValue.trim() ? styles.sendButtonActive : ''}`}
				disabled={!displayValue.trim() || isAnimating}
				aria-label="Send Message"
			>
				↑
			</button>
		</div>
	);
}

export default ChatInputPane;
