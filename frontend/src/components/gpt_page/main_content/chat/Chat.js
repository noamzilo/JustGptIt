import GptQueryService from "../../../../services/GptQueryService";
import { useState, useEffect } from "react";
import styles from "./Chat.module.css";

function ChatComponent() {
    const [message, setMessage] = useState('');

    const sendQuery = async () => {
        if (message.trim()) {
            const isValid = await GptQueryService.queryGPT(message);
            if (isValid) {
                console.log('Message sent successfully');
            } else {
                console.log('Message failed to send');
            }
            setMessage('');
        }
    };

    const handleKeyboardPress = (e) => {
        if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowUp') {
            e.preventDefault();
            sendQuery();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeyboardPress);
        return () => document.removeEventListener('keydown', handleKeyboardPress);
    }, [message]); // Re-bind when message changes

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                placeholder="Message ChatGPT"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyboardPress}
            />
            <button
                onClick={sendQuery}
                className={`${styles.sendButton} ${message ? styles.sendButtonActive : ""}`}
                disabled={!message.trim()}
            >
                ↑
            </button>
        </div>
    );
}

export default ChatComponent;