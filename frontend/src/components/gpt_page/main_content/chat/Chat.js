import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";

const ChatComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const queryParam = searchParams.get('query');
        if (queryParam && queryParam !== message) {
            setIsTyping(true);
            const decodedQuery = decodeURIComponent(queryParam);
            setMessage(''); // Clear the message first

            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex < decodedQuery.length) {
                    setMessage(prev => decodedQuery.slice(0, currentIndex + 1));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTyping(false);
                }
            }, 50);

            return () => clearInterval(typingInterval);
        }
    }, [searchParams]);

    const sendQuery = useCallback(async () => {
        if (message.trim()) {
            setSearchParams({ query: message });
            setMessage('');
        }
    }, [message, setSearchParams]);

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
                onChange={(e) => !isTyping && setMessage(e.target.value)}
                onKeyDown={handleKeyboardPress}
                className={isTyping ? styles.typing : ''}
                readOnly={isTyping}
            />
            <button
                onClick={sendQuery}
                className={`${styles.sendButton} ${message ? styles.sendButtonActive : ""}`}
                disabled={!message.trim() || isTyping}
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;