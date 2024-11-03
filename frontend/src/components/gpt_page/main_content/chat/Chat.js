// ChatComponent.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./Chat.module.css";
import mitt from 'mitt';
import mouse_cursor from "../../../../assets/mouse_cursor.svg";

function ChatComponent() {
    const emitter = useMemo(() => mitt(), []);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const [inputValue, setInputValue] = useState('');
    const [cursorPosition, setCursorPosition] = useState({ top: -50, left: -50 });
    const cursorRef = useRef(null);
    const textareaRef = useRef(null);

    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');

    const startMouseAnimation = useCallback(() => {
        setAnimatingTextValue('');
        setIsMouseAnimating(true); // Retained for component logic
        console.log('Mouse move effect started');

        if (!cursorRef.current && !textareaRef.current) {
            return;
        }

        const textBoxRect = textareaRef.current.getBoundingClientRect();

        const targetPosition = {
            top: textBoxRect.top + window.scrollY,
            left: textBoxRect.left + window.scrollX
        };

        console.log('Setting cursor position to:', targetPosition);
        setCursorPosition(targetPosition); // Set cursor to textarea position

        setTimeout(() => {
            setIsMouseAnimating(false); // Retained for component logic
            emitter.emit('mouseAnimationDone');
        }, 2000); // animation duration

    }, [emitter]);

    const handleQueryParamChange = useCallback(() => {
        if (!decodedQuery.trim()) {
            return;
        }
        return startMouseAnimation();
    }, [decodedQuery, startMouseAnimation]);

    useEffect(() => {
        handleQueryParamChange();
    }, [handleQueryParamChange]);

    const handleMouseAnimationDone = useCallback(() => {
        setIsAnimatingTyping(true);
    }, []);

    useEffect(() => {
        emitter.on('mouseAnimationDone', handleMouseAnimationDone);

        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, [emitter, handleMouseAnimationDone]);

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

            return () => clearInterval(intervalId);
        }
    }, [isAnimatingTyping, decodedQuery, emitter]);

    useEffect(() => {
        const cleanup = typingAnimationEffect();
        return cleanup;
    }, [typingAnimationEffect]);

    const handleTypingAnimationDone = useCallback(() => {
        console.log('Typing animation done');
        setInputValue(decodedQuery);
    }, [decodedQuery]);

    useEffect(() => {
        emitter.on('typingAnimationDone', handleTypingAnimationDone);

        return () => {
            emitter.off('typingAnimationDone', handleTypingAnimationDone);
        };
    }, [emitter, handleTypingAnimationDone]);

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
        <div className={styles.inputContainer} style={{ position: 'relative' }}> {/* Ensure relative positioning */}
            <motion.img
                src={mouse_cursor}
                ref={cursorRef}
                alt="Animated Mouse Cursor"
                initial={{ top: -50, left: -50 }}
                animate={{
                    top: cursorPosition.top,
                    left: cursorPosition.left,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                style={{ position: 'absolute', width: '20px', height: '20px' }}
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
