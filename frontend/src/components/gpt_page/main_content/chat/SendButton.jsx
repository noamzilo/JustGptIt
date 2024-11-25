import React from 'react';
import styles from './SendButton.module.css';


// {<button
// onClick={handleSendClick}
// className={`${styles.sendButton} ${displayValue.trim() ? styles.sendButtonActive : ''}`}
// disabled={!displayValue.trim() || isAnimating}
// aria-label="Send Message"
// >
// ↑
// </button> }

function SendButton({ onClick, disabled, isAnimating, displayValue }) {
	return (
		<button
			onClick={onClick}
			className={`${styles.sendButton} ${displayValue.trim() ? styles.sendButtonActive : ''}`}
			disabled={disabled}
			aria-label="Send Message"
		>
		
			<svg 
			xmlns="http://www.w3.org/2000/svg"
			 viewBox="0 0 384 512"
			 width="25"
				height="25"
				fill="currentColor"
				// viewBox="0 0 16 16"
			 >
				
			<path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/>
			</svg>
		</button>



	);
}

export default SendButton;
