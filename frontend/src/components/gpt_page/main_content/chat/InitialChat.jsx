import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './InitialChat.module.css';
import mitt from 'mitt';
import ChatInputPane from './ChatInputPane';
import useMouseAnimation from './hooks/useMouseAnimation';
import { GPT_PAGE_CONSTANTS } from '../../constants';

function InitialChat({
  initialQuery,
  onTypingAnimationDone,
  onLlmResponse,
  onQueryChange,
  clearInputTrigger,
}) {
  const mouse_cursor = `${process.env.PUBLIC_URL}/assets/mouse_cursor.svg`;
  const emitter = useMemo(() => mitt(), []);
  const [textareaElement, setTextareaElement] = useState(null);
  const [mouseTarget, setMouseTarget] = useState({
    top: window.innerHeight / 2,
    left: window.innerWidth / 2,
  });

  const decodedQuery = initialQuery || '';

  // Call useMouseAnimation before using startMouseAnimation in useEffect
  const { isAnimatingMouseMove, startMouseAnimation, controls } = useMouseAnimation(
    emitter,
    mouseTarget.top,
    mouseTarget.left
  );

  // Update mouseTarget when textareaElement is available
  useEffect(() => {
    if (textareaElement) {
      const rect = textareaElement.getBoundingClientRect();
      setMouseTarget({
        top: rect.top + rect.height / 2 + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  }, [textareaElement]);

  useEffect(() => {
    if (decodedQuery.trim()) {
      onQueryChange(decodedQuery);
      startMouseAnimation();
    }
  }, [decodedQuery, onQueryChange, startMouseAnimation]);

  // Correctly initialize isAnimatingTyping with useState
  const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
  const [readyForTypingAnimation, setReadyForTypingAnimation] = useState(false);
  const [animatingTextValue, setAnimatingTextValue] = useState('');

  useEffect(() => {
    const handleMouseAnimationDone = () => {
      setReadyForTypingAnimation(true); // Set readyForTypingAnimation to true when mouse animation is done
    };

    emitter.on('mouseAnimationDone', handleMouseAnimationDone);
    return () => {
      emitter.off('mouseAnimationDone', handleMouseAnimationDone);
    };
  }, [emitter]);

  useEffect(() => {
    // Start typing animation only after the mouse animation is done
    if (readyForTypingAnimation) {
      setAnimatingTextValue(decodedQuery);
      setIsAnimatingTyping(true);
    }
  }, [readyForTypingAnimation, decodedQuery]);

  const handleTypingAnimationDone = useCallback(() => {
    setIsAnimatingTyping(false);
    emitter.emit('typingAnimationDone');
  }, [emitter]);

  useEffect(() => {
    const handleAnimationDone = () => {
      onTypingAnimationDone();
    };
    emitter.on('typingAnimationDone', handleAnimationDone);
    return () => {
      emitter.off('typingAnimationDone', handleAnimationDone);
    };
  }, [emitter, onTypingAnimationDone]);

  const handleSend = useCallback(
    (inputValue) => {
      console.log('Send button clicked in InitialChat');
      if (inputValue.trim()) {
        onQueryChange(inputValue);
      }
    },
    [onQueryChange]
  );

  return (
    <div className={styles.inputContainer}>
      <h2 className={styles.querySectionText}>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
      <motion.img
        src={mouse_cursor}
        alt="Animated Mouse Cursor"
        initial={{ top: 0, left: 0 }}
        animate={controls}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          width: '20px',
          height: '20px',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 9999,
        }}
      />
      <ChatInputPane
        onSubmit={handleSend}
        isAnimating={isAnimatingMouseMove || isAnimatingTyping}
        animatingTextValue={animatingTextValue}
        onAnimationComplete={handleTypingAnimationDone}
        placeholder={GPT_PAGE_CONSTANTS.QUERY_PLACEHOLDER}
        clearInputTrigger={clearInputTrigger} // Pass down to ChatInputPane
        onTextareaRef={setTextareaElement} // Ensure this is passed as a function
      />
    </div>
  );
}

export default InitialChat;
