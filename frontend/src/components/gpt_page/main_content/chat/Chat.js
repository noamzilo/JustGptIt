// ChatComponent.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";
import mitt from 'mitt';

const ChatComponent = () => {
    // Use useMemo to create a persistent emitter instance
    const emitter = useMemo(() => mitt(), []);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const [inputValue, setInputValue] = useState('');
    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');
    const textareaRef = useRef(null);

    // Handle query parameter changes and start mouse animation
    const handleQueryParamChange = useCallback(() => {
        if (!decodedQuery.trim()) {
            return;
        }
        setAnimatingTextValue('');
        setIsMouseAnimating(true);

        console.log('Mouse move effect started');
        const timeoutId = setTimeout(() => {
            setIsMouseAnimating(false);
            console.log('Mouse move effect complete');
            emitter.emit('mouseAnimationDone');
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [decodedQuery, emitter]);

    useEffect(() => {
        handleQueryParamChange();
    }, [handleQueryParamChange]);

    // Start typing animation when mouse animation is done
    const handleMouseAnimationDone = useCallback(() => {
        setIsAnimatingTyping(true);
    }, []);

    useEffect(() => {
        emitter.on('mouseAnimationDone', handleMouseAnimationDone);

        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, [emitter, handleMouseAnimationDone]);

    // Typing animation effect
    useEffect(() => {
        if (isAnimatingTyping) {
            const text = decodedQuery;
            let index = 0;

            const intervalId = setInterval(() => {
                index += 1;
                setAnimatingTextValue(text.slice(0, index));

                if (index >= text.length) {
                    clearInterval(intervalId);
                    setIsAnimatingTyping(false);
                    emitter.emit('typingAnimationDone');
                }
            }, 50);

            return () => clearInterval(intervalId);
        }
    }, [isAnimatingTyping, decodedQuery, emitter]);

    // Log when typing animation is done
    const handleTypingAnimationDone = useCallback(() => {
        console.log('Typing animation done');
        // Update the inputValue after typing animation is complete
        setInputValue(decodedQuery);
    }, [decodedQuery]);

    useEffect(() => {
        emitter.on('typingAnimationDone', handleTypingAnimationDone);

        return () => {
            emitter.off('typingAnimationDone', handleTypingAnimationDone);
        };
    }, [emitter, handleTypingAnimationDone]);

    // Scroll to bottom of textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [animatingTextValue, inputValue]);

    const handleSendClick = () => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    };

    let isAnimating = isAnimatingTyping || isAnimatingMouseMove;
    return (
        <div className={styles.inputContainer}>
            <textarea
                ref={textareaRef}
                placeholder="Message ChatGPT"
                value={isAnimating ? animatingTextValue : inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimating ? styles.typingAnimation : ''}
                readOnly={isAnimating}
                aria-label="Message input"
            />
            <button
                onClick={handleSendClick}
                className={`${styles.sendButton} ${inputValue.trim() ? styles.sendButtonActive : ''}`}
                disabled={!inputValue.trim() || isAnimatingTyping}
                aria-label="Send Message"
            >
                ↑
            </button>
        </div>
    );
};

export default ChatComponent;
