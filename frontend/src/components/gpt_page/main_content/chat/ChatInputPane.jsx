import React, { useCallback, useRef, useState } from 'react';
import useTypingAnimation from './hooks/useTypingAnimation'; // Import the useTypingAnimation hook
import styles from './ChatInputPane.module.css';

function ChatInputPane({ onSubmit, isAnimating, animatingTextValue }) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Integrate useTypingAnimation
  const animatedText = useTypingAnimation(animatingTextValue, isAnimating, () => {
    // Animation completion callback to clear animation or handle state change
    if (!isAnimating) setInputValue(''); 
  });

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

  // Display animated text when animating, otherwise show the regular input
  const displayValue = isAnimating ? animatedText : inputValue;

  return (
    <div className={styles.inputContainer}>
      <textarea
        ref={textareaRef}
        placeholder="Message ChatGPT"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        className={isAnimating ? styles.typingAnimation : ''}
        readOnly={isAnimating} // Disable editing while animating
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
