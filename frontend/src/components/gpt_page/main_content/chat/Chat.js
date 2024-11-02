// ChatComponent.jsx

import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";
import mitt from 'mitt';

const ChatComponent = () => {
    const emitter = mitt();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const [inputValue, setInputValue] = useState('');
    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');
    const textareaRef = useRef(null);

    // Function to start mouse animation
    const startMouseAnimation = () => {
        if (!decodedQuery.trim()) {
            return;
        }

        setIsMouseAnimating(true);
        console.log('Mouse move effect started');
        setTimeout(() => {
            setIsMouseAnimating(false);
            console.log('Mouse move effect complete');
            emitter.emit('mouseAnimationDone');
        }, 1000);
    };

    // Effect to start mouse animation when query param changes
    useEffect(() => {
        startMouseAnimation();
    }, [decodedQuery]);

    // Function to start typing animation
    const startTypingAnimation = () => {
        setIsAnimatingTyping(true);
        setAnimatingTextValue('');
    };

    // Effect to start typing animation when mouse animation is done
    useEffect(() => {
        const handleMouseAnimationDone = () => {
            startTypingAnimation();
        };
        emitter.on('mouseAnimationDone', handleMouseAnimationDone);

        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, []);

    // Function to run typing animation
    const runTypingAnimation = () => {
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
    };

    // Effect to handle typing animation
    useEffect(() => {
        if (isAnimatingTyping) {
            const cleanup = runTypingAnimation();
            return cleanup;
        }
    }, [isAnimatingTyping, decodedQuery]);

    // Function to handle typing animation completion
    const handleTypingAnimationDone = () => {
        console.log('Typing animation done');
        // Update the inputValue after typing animation is complete
        setInputValue(decodedQuery);
    };

    // Effect to handle typing animation completion
    useEffect(() => {
        emitter.on('typingAnimationDone', handleTypingAnimationDone);

        return () => {
            emitter.off('typingAnimationDone', handleTypingAnimationDone);
        };
    }, [decodedQuery]);

    // Effect to scroll to bottom of textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [animatingTextValue, inputValue]);

    // Function to handle send button click
    const handleSendClick = () => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    };

    // Function to handle key press in textarea
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
