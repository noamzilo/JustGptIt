import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";

const ChatComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const queryParam = searchParams.get('query');
        if (queryParam) {
            setMessage(decodeURIComponent(queryParam));
        }
    }, [searchParams]);

    const sendQuery = useCallback(async () => {
        if (message.trim()) {
            setSearchParams({ query: message });

            // const isValid = await GptQueryService.queryGPT(message);
            // if (isValid) {
            //     console.log('Message sent successfully');
            // } else {
            //     console.log('Message failed to send');
            // }

            setMessage('');
        }
    }, [message, setSearchParams]);

    const handleKeyboardPress = useCallback((e) => {
        if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowUp') {
            e.preventDefault();
            sendQuery();
        }
    }, [sendQuery]);

    const buttonClass = message ? styles.sendButtonActive : styles.sendButton;

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                placeholder="Message ChatGPT"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyboardPress}
            />
            <button
                onClick={sendQuery}
                className={styles.button}
                disabled={!message.trim()}
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;