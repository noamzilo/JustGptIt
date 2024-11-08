// ChatInputPane.jsx

import React, { useCallback, useRef, useState } from 'react';
import styles from './ChatInputPane.module.css';

function ChatInputPane({ onSubmit, isAnimating, animatingTextValue }) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

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

  const displayValue = isAnimating ? animatingTextValue : inputValue;

  return (
    <div className={styles.inputContainer}>
      <textarea
        ref={textareaRef}
        placeholder="Message ChatGPT"
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
