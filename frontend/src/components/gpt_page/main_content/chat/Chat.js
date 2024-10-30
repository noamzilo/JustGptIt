// ChatComponent.jsx

import React, { useState, useCallback, useEffect, useRef } from "react";
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
                onComplete?.(text);
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

    const textareaRef = useRef(null); // Ref for the textarea

    const handleAnimationComplete = useCallback((text) => {
        setInputValue(text);
        navigator.clipboard.writeText(text);
        // window.open('https://chat.openai.com', '_blank');
    }, []);

    const { displayText, isAnimating } = useTypeAnimation(decodedQuery, handleAnimationComplete);

    const handleSend = useCallback(() => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // Function to adjust the height and scroll
    const adjustTextarea = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scrollHeight
            textarea.scrollTop = textarea.scrollHeight; // Scroll to bottom
        }
    }, []);

    useEffect(() => {
        adjustTextarea();
    }, [displayText, inputValue, adjustTextarea]);

    return (
        <div className={styles.inputContainer}>
            <textarea
                ref={textareaRef}
                placeholder="Message ChatGPT"
                value={isAnimating ? displayText : inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimating ? styles.typing : ''}
                readOnly={isAnimating}
                aria-label="Message input"
            />
            <button
                onClick={handleSend}
                className={`${styles.sendButton} ${inputValue ? styles.sendButtonActive : ""}`}
                disabled={!inputValue.trim() || isAnimating}
                aria-label="Send Message"
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;
