// ChatMessage.jsx

import React from 'react';
import styles from './ChatMessage.module.css';
import AnimatedText from './AnimatedText';
import ResponseThinkingPlaceholder from './ResponseThinkingPlaceholder';

function ChatMessage({ message, isUser }) {
  console.log(`ChatMessage: message=${message}, isUser=${isUser}`);

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
          <AnimatedText text={message} />
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
