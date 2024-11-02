// ChatComponent.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";
import mitt from 'mitt';
import mouse_cursor from "../../../../assets/mouse_cursor.svg";

function ChatComponent() {
    // Use useMemo to create a persistent emitter instance
    const emitter = useMemo(() => mitt(), []);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const [inputValue, setInputValue] = useState('');
    const [cursorPosition, setCursorPosition] = useState({ top: '-50px', left: '-50px' });
    const cursorRef = useRef(null);
    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');
    const textareaRef = useRef(null);

    // Function to handle the mouse animation with a delay
    const startMouseAnimation = useCallback(() => {
        setAnimatingTextValue('');
        setIsMouseAnimating(true);
        console.log('Mouse move effect started');

        if (!cursorRef.current && !textareaRef.current) {
            return;
        }

        const textBoxRect = textareaRef.current.getBoundingClientRect();

        // Move cursor from off-screen to the textarea
        setCursorPosition({ top: '-50px', left: '-50px' }); // Initial off-screen position
        let index = 0;
        const interval = 50;
        const animationDuration = 2000;
        const n_steps = animationDuration / interval; // 50ms interval
        const pixels_per_step = [(textBoxRect.top + window.scrollY) / n_steps, (textBoxRect.left + window.scrollX) / n_steps];
        const intervalId = setInterval(() => {
            index += 1;
            setCursorPosition({ top: `${textBoxRect.top + index * pixels_per_step[1]}px`, left: `${textBoxRect.left + index * pixels_per_step[0]}px` });

            if (index >= n_steps) {
                clearInterval(intervalId);
                setIsMouseAnimating(false);
                emitter.emit('mouseAnimationDone');
            }
        }, interval);



        // Cleanup if component unmounts
        return () => clearTimeout(intervalId);

    }, [emitter]);    // Handle query parameter changes and trigger mouse animation

    const handleQueryParamChange = useCallback(() => {
        if (!decodedQuery.trim()) {
            return;
        }
        return startMouseAnimation();
    }, [decodedQuery, startMouseAnimation]);

    useEffect(() => {
        const cleanup = handleQueryParamChange();
        return cleanup;
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
    const typingAnimationEffect = useCallback(() => {
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

            // Cleanup in case the component unmounts before interval completes
            return () => clearInterval(intervalId);
        }
    }, [isAnimatingTyping, decodedQuery, emitter]);

    useEffect(() => {
        const cleanup = typingAnimationEffect();
        return cleanup;
    }, [typingAnimationEffect]);

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
    const scrollToBottomEffect = useCallback(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        scrollToBottomEffect();
    }, [animatingTextValue, inputValue, scrollToBottomEffect]);

    const handleSendClick = useCallback(() => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
        }
    }, [handleSendClick]);

    const isAnimating = isAnimatingTyping || isAnimatingMouseMove;
    return (
        <div className={styles.inputContainer}>
            <img
                src={mouse_cursor}
                ref={cursorRef}
                className={isAnimatingMouseMove ? styles.cursorAnimation : styles.cursorAnimationHidden}
                alt="Animated Mouse Cursor"
                location={cursorPosition}
            />
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
}

export default ChatComponent;
