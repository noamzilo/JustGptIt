import React from "react";
import styles from "./ResponseChat.module.css";
import ChatMessage from "./ChatMessage";
import ResponseThinkingPlaceholder from "./ResponseThinkingPlaceholder";

function ResponseChat({ query, response }) {
    return (
        <div className={styles.chatContainer}>
            <ChatMessage message={query} isUser={true} />
            <ChatMessage message={response} isUser={false} />
        </div>
    );
}

export default ResponseChat;
