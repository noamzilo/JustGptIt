// InitialChat.jsx

import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './InitialChat.module.css';
import mitt from 'mitt';
import ChatInputPane from './ChatInputPane';
import useMouseAnimation from './hooks/useMouseAnimation';
import useTypingAnimation from './hooks/useTypingAnimation';
import useLlmQuery from './hooks/useLlmQuery';

function InitialChat({ onTypingAnimationDone, onLlmResponse, onQueryChange }) {
  const mouse_cursor = `${process.env.PUBLIC_URL}/assets/mouse_cursor.svg`;
  const emitter = useMemo(() => mitt(), []);

  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));
  const queryParam = searchParams.get('query');
  const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

  const { isAnimatingMouseMove, startMouseAnimation, controls } = useMouseAnimation(emitter);
  const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);

  const animatingTextValue = useTypingAnimation(decodedQuery, isAnimatingTyping, () => {
    setIsAnimatingTyping(false);
    emitter.emit('typingAnimationDone');
  });

  const queryLlm = useLlmQuery(onLlmResponse);

  useEffect(() => {
    if (decodedQuery.trim()) {
      onQueryChange(decodedQuery);
      queryLlm(decodedQuery);
      startMouseAnimation();
    }
  }, [decodedQuery, onQueryChange, queryLlm, startMouseAnimation]);

  useEffect(() => {
    const handleMouseAnimationDone = () => {
      setIsAnimatingTyping(true);
    };
    emitter.on('mouseAnimationDone', handleMouseAnimationDone);
    return () => {
      emitter.off('mouseAnimationDone', handleMouseAnimationDone);
    };
  }, [emitter]);

  useEffect(() => {
    const handleTypingAnimationDone = () => {
      onTypingAnimationDone();
    };
    emitter.on('typingAnimationDone', handleTypingAnimationDone);
    return () => {
      emitter.off('typingAnimationDone', handleTypingAnimationDone);
    };
  }, [emitter, onTypingAnimationDone]);

  const handleSend = useCallback(
    (inputValue) => {
      console.log('Send button clicked in InitialChat');
      if (inputValue.trim()) {
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.set('query', inputValue);
        window.history.replaceState(null, '', `?${newSearchParams.toString()}`);
        setSearchParams(newSearchParams);
      }
    },
    [setSearchParams]
  );

  const isAnimating = isAnimatingTyping || isAnimatingMouseMove;

  return (
    <div className={styles.inputContainer}>
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
        isAnimating={isAnimating}
        animatingTextValue={animatingTextValue}
      />
    </div>
  );
}

export default InitialChat;
