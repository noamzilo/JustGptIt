// ChatInputPane.jsx

import React, { useCallback, useRef } from "react";
import styles from "./ChatInputPane.module.css";

function ChatInputPane({ inputValue, setInputValue, onSendClick, isAnimating, animatingTextValue }) {
    const textareaRef = useRef(null);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendClick();
        }
    }, [onSendClick]);

    return (
        <div className={styles.inputContainer}>
            <textarea
                ref={textareaRef}
                placeholder="Message ChatGPT"
                value={isAnimating ? animatingTextValue : inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimating ? styles.typingAnimation : ''}
                readOnly={isAnimating}
                aria-label="Message input"
            />
            <button
                onClick={onSendClick}
                className={`${styles.sendButton} ${inputValue.trim() ? styles.sendButtonActive : ''}`}
                disabled={!inputValue.trim() || isAnimating}
                aria-label="Send Message"
            >
                ↑
            </button>
        </div>
    );
}

export default ChatInputPane;
