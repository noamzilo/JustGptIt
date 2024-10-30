import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";

const useTypeAnimation = (text, onComplete) => {
    const [displayText, setDisplayText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!text) return;

        setIsAnimating(true);
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setIsAnimating(false);
                onComplete?.();
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, [text, onComplete]);

    return { displayText, isAnimating };
};

const ChatComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState('');

    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const { displayText, isAnimating } = useTypeAnimation(decodedQuery);

    useEffect(() => {
        if (displayText && !isAnimating) {
            setInputValue(displayText);
        }
    }, [displayText, isAnimating]);

    const handleSend = useCallback(() => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);

    const handleKeyPress = useCallback((e) => {
        if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'ArrowUp') {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                placeholder="Message ChatGPT"
                value={isAnimating ? displayText : inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimating ? styles.typing : ''}
                readOnly={isAnimating}
            />
            <button
                onClick={handleSend}
                className={`${styles.sendButton} ${inputValue ? styles.sendButtonActive : ""}`}
                disabled={!inputValue.trim() || isAnimating}
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;