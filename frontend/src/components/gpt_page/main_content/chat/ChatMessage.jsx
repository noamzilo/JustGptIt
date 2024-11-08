// ChatMessage.jsx
import React, { useState } from 'react';
import styles from './ChatMessage.module.css';
import AnimatedText from './AnimatedText';
import ResponseThinkingPlaceholder from './ResponseThinkingPlaceholder';

function ChatMessage({ message, isUser }) {
  const [isAnimating, setIsAnimating] = useState(true);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    // You can perform additional actions here if needed
  };

  const waitingForResponse = !message;

  return (
    <div
      className={`${styles.messageListItem} ${
        isUser ? styles.userMessage : styles.assistantMessage
      }`}
    >
      <div className={styles.messageContent}>
        {isUser ? (
          <div className={styles.messageText}>{message}</div>
        ) : waitingForResponse ? (
          <ResponseThinkingPlaceholder />
        ) : (
          <AnimatedText
            text={message}
            isAnimating={isAnimating}
            onComplete={handleAnimationComplete}
          />
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
