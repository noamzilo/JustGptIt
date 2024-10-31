// ChatComponent.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";

// Custom hook to animate text typing effect
const useTypeAnimation = (text, onComplete) => {
    const [displayText, setDisplayText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        if (isAnimating) {
            if (displayText.length < text.length) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayText(text.slice(0, displayText.length + 1));
                }, 50);
            } else {
                setIsAnimating(false);
                if (onComplete) {
                    onComplete(text);
                }
            }
        }
    }, [displayText, isAnimating, text, onComplete]);

    return { displayText, isAnimating };
};

const ChatComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);

    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const handleAnimationComplete = useCallback((text) => {
        setInputValue(text);
    }, []);

    const { displayText, isAnimating } = useTypeAnimation(decodedQuery, handleAnimationComplete);

    const handleSend = useCallback(() => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);

    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.scrollTop = textarea.scrollHeight;
        }
    }, [displayText, inputValue]);

    return (
        <div className={styles.inputContainer}>
            <textarea
                ref={textareaRef}
                placeholder="Message ChatGPT"
                value={isAnimating ? displayText : inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimating ? styles.typing : ''}
                readOnly={isAnimating}
                aria-label="Message input"
            />
            <button
                onClick={handleSend}
                className={`${styles.sendButton} ${inputValue.trim() ? styles.sendButtonActive : ''}`}
                disabled={!inputValue.trim() || isAnimating}
                aria-label="Send Message"
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;
