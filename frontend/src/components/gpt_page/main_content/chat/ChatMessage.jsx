// Component which represents each chat message in the chat window
// Each message takes up all of the width of the parent container

import React from 'react';
import styles from './ChatMessage.module.css';

function ChatMessage({ message, isUser }) {
    return (
        <div className={`${styles.messageContainer} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.messageContent}>
            <div className={styles.messageText}>{message}</div>
            </div>
        </div>
    );
}

export default ChatMessage;