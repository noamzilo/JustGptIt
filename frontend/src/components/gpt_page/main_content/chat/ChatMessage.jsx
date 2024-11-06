import React, { useEffect } from 'react';
import mitt from 'mitt';
import styles from './ChatMessage.module.css';
import AnimatedText from './AnimatedText';


const emitter = mitt();

function ChatMessage({ message, isUser }) {
    console.log(`ChatMessage: message=${message}, isUser=${isUser}`);

    useEffect(() => {
        emitter.emit('typingCompleted');
    }, [message]);

    return (
        <div className={`${styles.messageListItem} ${isUser ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.messageContent}>
                {isUser ? (
                    <div className={styles.messageText}>{message}</div>
                ) : AnimatedText({ text: message })
                }
            </div>
        </div>
    );
}

export default ChatMessage;
export { emitter };



