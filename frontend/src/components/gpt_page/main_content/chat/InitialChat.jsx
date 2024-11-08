import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './InitialChat.module.css';
import mitt from 'mitt';
import ChatInputPane from './ChatInputPane';
import useMouseAnimation from './hooks/useMouseAnimation';
import AnimatedText from './AnimatedText';
import { GPT_PAGE_CONSTANTS } from '../../constants';

function InitialChat({ initialQuery, onTypingAnimationDone, onLlmResponse, onQueryChange }) {
  const mouse_cursor = `${process.env.PUBLIC_URL}/assets/mouse_cursor.svg`;
  const emitter = useMemo(() => mitt(), []);

  const decodedQuery = initialQuery || '';

  const { isAnimatingMouseMove, startMouseAnimation, controls } = useMouseAnimation(emitter);
  const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
  const [readyForTypingAnimation, setReadyForTypingAnimation] = useState(false);
  const [animatingTextValue, setAnimatingTextValue] = useState('');

  useEffect(() => {
    if (decodedQuery.trim()) {
      onQueryChange(decodedQuery);
      startMouseAnimation();
    }
  }, [decodedQuery, onQueryChange, startMouseAnimation]);

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
      <h2>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
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
      />
      {/* {isAnimatingTyping && (
        <AnimatedText text={decodedQuery} onComplete={handleTypingAnimationDone} />
      )} */}
    </div>
  );
}

export default InitialChat;
