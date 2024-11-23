import React, { useCallback, useRef, useState, useEffect } from 'react';
import useTypingAnimation from './hooks/useTypingAnimation';
import styles from './ChatInputPane.module.css';

function ChatInputPane({
  onSubmit,
  isAnimating,
  animatingTextValue,
  onAnimationComplete,
  placeholder,
  clearInputTrigger,
  onTextareaRef, // Ensure this prop is passed as a function
}) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  // Pass textareaRef to parent if onTextareaRef is provided
  useEffect(() => {
    if (textareaRef.current && typeof onTextareaRef === 'function') {
      onTextareaRef(textareaRef.current);
    }
  }, [onTextareaRef]);

  // Integrate useTypingAnimation
  const animatedText = useTypingAnimation(animatingTextValue, isAnimating, async () => {
    if (!isAnimating) {
      setInputValue('');
    }
    await new Promise((r) => setTimeout(r, 300));
    onAnimationComplete();
  });

  // Determine the display value based on whether it's animating
  const displayValue = isAnimating ? animatedText : inputValue;

  // Clear input when clearInputTrigger changes and focus the textarea
  useEffect(() => {
    setInputValue(''); // Clear input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [clearInputTrigger]);

  // Adjust textarea height based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to calculate the new height
      const computedStyle = window.getComputedStyle(textarea);
      const maxHeight = parseFloat(computedStyle.maxHeight);
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, []);

  // Scroll textarea to the bottom
  const scrollToBottom = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, []);

  // Effect to adjust height and scroll when displayValue changes
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
