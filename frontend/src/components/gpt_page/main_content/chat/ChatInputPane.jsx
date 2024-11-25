import React, { useCallback, useRef, useState, useEffect } from 'react';
import useTypingAnimation from './hooks/useTypingAnimation';
import styles from './ChatInputPane.module.css';
import SendButton from './SendButton';

function ChatInputPane({
	onSubmit,
	isAnimating,
	animatingTextValue,
	onAnimationComplete,
	placeholder,
	clearInputTrigger,
	onTextareaRef,
}) {
	const [inputValue, setInputValue] = useState('');
	const textareaRef = useRef(null);

	useEffect(() => {
		if (textareaRef.current && typeof onTextareaRef === 'function') {
			onTextareaRef(textareaRef.current);
		}
	}, [onTextareaRef]);

	const animatedText = useTypingAnimation(animatingTextValue, isAnimating, async () => {
		if (!isAnimating) {
			setInputValue('');
		}
		await new Promise((r) => setTimeout(r, 300));
		onAnimationComplete();
	});

	const displayValue = isAnimating ? animatedText : inputValue;

	useEffect(() => {
		setInputValue('');
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	}, [clearInputTrigger]);

	const adjustTextareaHeight = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto';
			const computedStyle = window.getComputedStyle(textarea);
			const maxHeight = parseFloat(computedStyle.maxHeight);
			const newHeight = Math.min(textarea.scrollHeight, maxHeight);
			textarea.style.height = `${newHeight}px`;
		}
	}, []);

	const scrollToBottom = useCallback(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.scrollTop = textarea.scrollHeight;
		}
	}, []);

	useEffect(() => {
		adjustTextareaHeight();
		if (isAnimating) {
			scrollToBottom();
		}
	}, [displayValue, adjustTextareaHeight, scrollToBottom, isAnimating]);

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

	return (
		<div className={styles.inputContainer}>
			<textarea
				ref={textareaRef}
				placeholder={placeholder}
				value={displayValue}
				onChange={handleChange}
				onKeyDown={handleKeyPress}
				readOnly={isAnimating}
				aria-label="Message input"
			/>
			<SendButton
				onClick={handleSendClick}
				disabled={!displayValue.trim() || isAnimating}
				isAnimating={isAnimating}
				displayValue={displayValue}
			/>
		</div>
	);
}

export default ChatInputPane;
