// Show a chat-like view with a user query and a response from the model.

import React from "react";
import styles from "./ResponseChat.module.css";
import { GPT_PAGE_CONSTANTS } from "../../constants";

function ResponseChat({ query, response }) {
    return (
        <div className={styles.chatContainer}>
            <div className={styles.queryContainer}>
                <div className={styles.queryText}>{query}</div>
            </div>
            <div className={styles.responseContainer}>
                <div className={styles.responseText}>{response}</div>
            </div>
        </div>
    );
}

export default ResponseChat;