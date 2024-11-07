import React, { useEffect, useState } from 'react';
import mitt from 'mitt';
import styles from './ChatMessage.module.css';
import AnimatedText from './AnimatedText';
import ResponseThinkingPlaceholder from './ResponseThinkingPlaceholder';

const emitter = mitt();

function ChatMessage({ message, isUser }) {
    console.log(`ChatMessage: message=${message}, isUser=${isUser}`);

    const [waitingForResponse, setwaitingForResponse] = useState(true);
    useEffect(() => {
        if (!message) {
            setwaitingForResponse(true);
        } else {
            setwaitingForResponse(false);
        }
    }, [message]);

    return (
        <div className={`${styles.messageListItem} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.messageContent}>
                {
                    isUser ? 
                        (
                            <div className={styles.messageText}>{message}</div>
                        ) :
                        waitingForResponse?
                            ResponseThinkingPlaceholder()
                            : AnimatedText({ text: message })
                }
            </div>
        </div>
    );
}

export default ChatMessage;
export { emitter };



