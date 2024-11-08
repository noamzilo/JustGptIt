// ResponseChat.jsx

import React, { useCallback } from 'react';
import styles from './ResponseChat.module.css';
import ChatMessage from './ChatMessage';
import ChatInputPane from './ChatInputPane';

function ResponseChat({ query, response, setResponse, onSendMessage }) {
  const handleSend = useCallback(
    (inputValue) => {
      onSendMessage(inputValue);
      setResponse('');
    },
    [onSendMessage]
  );

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        <ChatMessage message={query} isUser={true} />
        <ChatMessage message={response} isUser={false} />
      </div>
      <ChatInputPane onSubmit={handleSend} isAnimating={false} animatingTextValue="" />
    </div>
  );
}

export default ResponseChat;
