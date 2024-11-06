import React from "react";
import styles from "./ResponseChat.module.css";

function ResponseChat({ query, response }) {
  return (
    <div className={styles.chatContainer}>
      {/* User message */}
      <div className={`${styles.messageContainer} ${styles.userMessage}`}>
        <div className={styles.avatar}>
          {/* User avatar */}
          <span className={styles.avatarText}>U</span>
        </div>
        <div className={styles.messageContent}>
          <div className={styles.messageText}>{query}</div>
        </div>
      </div>

      {/* Assistant response */}
      <div className={`${styles.messageContainer} ${styles.assistantMessage}`}>
        <div className={styles.avatar}>
          {/* Assistant avatar */}
          <span className={styles.avatarText}>A</span>
        </div>
        <div className={styles.messageContent}>
          <div className={styles.messageText}>{response}</div>
        </div>
      </div>
    </div>
  );
}

export default ResponseChat;
