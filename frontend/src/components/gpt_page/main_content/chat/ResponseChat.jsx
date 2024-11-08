// ResponseChat.jsx

import React, { useCallback } from 'react';
import styles from './ResponseChat.module.css';
import ChatMessage from './ChatMessage';
import ChatInputPane from './ChatInputPane';

function ResponseChat({ query, response, onSendMessage }) {
  const handleSend = useCallback(
    (inputValue) => {
      onSendMessage(inputValue);
    },
    [onSendMessage]
  );

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        <ChatMessage message={query} isUser={true} />
        <ChatMessage message={response} isUser={false} />
        {/* Add more ChatMessage components as needed */}
      </div>
      <ChatInputPane onSubmit={handleSend} isAnimating={false} animatingTextValue="" />
    </div>
  );
}

export default ResponseChat;
