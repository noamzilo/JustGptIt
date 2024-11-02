// ChatComponent.jsx

import React, { useState, useEffect, useRef, useMemo } from "react";
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
    function handleQueryParamChange() {
        if (decodedQuery) {
            setIsMouseAnimating(true);
            console.log('Mouse move effect started');
            setTimeout(() => {
                setIsMouseAnimating(false);
                console.log('Mouse move effect complete');
                emitter.emit('mouseAnimationDone');
            }, 1000);
        }
    }

    useEffect(handleQueryParamChange, [decodedQuery]);

    // Start typing animation when mouse animation is done
    function handleMouseAnimationDone() {
        setIsAnimatingTyping(true);
    }

    useEffect(() => {
        emitter.on('mouseAnimationDone', handleMouseAnimationDone);

        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, [emitter]);

    // Typing animation effect
    function typingAnimationEffect() {
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
    }

    useEffect(typingAnimationEffect, [isAnimatingTyping, decodedQuery, emitter]);

    // Log when typing animation is done
    function handleTypingAnimationDone() {
        console.log('Typing animation done');
        // Update the inputValue after typing animation is complete
        setInputValue(decodedQuery);
    }

    useEffect(() => {
        emitter.on('typingAnimationDone', handleTypingAnimationDone);

        return () => {
            emitter.off('typingAnimationDone', handleTypingAnimationDone);
        };
    }, [decodedQuery, emitter]);

    // Scroll to bottom of textarea
    function scrollToBottomEffect() {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }

    useEffect(scrollToBottomEffect, [animatingTextValue, inputValue]);

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

    return (
        <div className={styles.inputContainer}>
            <textarea
                ref={textareaRef}
                placeholder="Message ChatGPT"
                value={isAnimatingTyping ? animatingTextValue : inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className={isAnimatingTyping ? styles.typingAnimation : ''}
                readOnly={isAnimatingTyping || isAnimatingMouseMove}
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
