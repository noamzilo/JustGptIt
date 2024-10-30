import GptQueryService from "../../../../services/GptQueryService";
import { useState, useCallback } from "react";
import styles from "./Chat.module.css";

function ChatComponent() {
    const [message, setMessage] = useState('');

    const sendQuery = useCallback(async () => {
        if (message.trim()) {
            const isValid = await GptQueryService.queryGPT(message);
            if (isValid) {
                console.log('Message sent successfully');
            } else {
                console.log('Message failed to send');
            }
            setMessage('');
        }
    }, [message]);

    const handleKeyboardPress = useCallback((e) => {
        if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowUp') {
            e.preventDefault();
            sendQuery();
        }
    }, [sendQuery]);

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                placeholder="Message ChatGPT"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyboardPress} // Use onKeyDown directly
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
