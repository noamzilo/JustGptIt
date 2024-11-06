// InitialChat.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import styles from "./InitialChat.module.css";
import mitt from 'mitt';
import LlmQueryService from "../../../../services/LlmQueryService";

function InitialChat({onTypingAnimationDone, onLlmResponse}) {
    const mouse_cursor = `${process.env.PUBLIC_URL}/assets/mouse_cursor.svg`;
    const emitter = useMemo(() => mitt(), []);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    // useEffect(async () => {
    //     const response = await LlmQueryService.queryLLMService(decodedQuery);
    //     console.log("Response from LLM:", response);
    //     onLlmResponse(decodedQuery, response);
    // }, [decodedQuery]);


    const [inputValue, setInputValue] = useState('');
    const cursorRef = useRef(null);
    const textareaRef = useRef(null);

    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');

    const controls = useAnimation();

    const startMouseAnimation = useCallback(async () => {
        setAnimatingTextValue('');
        setIsMouseAnimating(true);
        console.log('Mouse move effect started');

        if (!cursorRef.current && !textareaRef.current) {
            return;
        }

        // Jump to (0,0) of the DOM
        await controls.set({
            top: 0,
            left: 0,
            opacity: 0,
        });

        // Get textarea position relative to the viewport
        const textBoxRect = textareaRef.current.getBoundingClientRect();

        const targetPosition = {
            top: (textBoxRect.top + textBoxRect.height / 4) + window.scrollY,
            left: (textBoxRect.left + 10) + window.scrollX
        };

        console.log('Animating cursor to text box position:', targetPosition);

        // Animate cursor to textarea position
        await controls.set({
            opacity: 1,
        });
        await controls.start({
            top: targetPosition.top,
            left: targetPosition.left,
        }, { duration: 1.5, ease: "easeOut" });

        await new Promise(resolve => setTimeout(resolve, 0));
        await controls.set({
            top: 0,
            left: 0,
            opacity: 0,
        });
        await new Promise(resolve => setTimeout(resolve, 150));

        console.log('Mouse move effect done');
        setIsMouseAnimating(false);
        emitter.emit('mouseAnimationDone');
    }, [controls, emitter]);

    let count = 0
    const queryLlm = useCallback(async (decodedQuery) => {
        try {
            console.log(`LlmQueryService ${++count} asked ${decodedQuery} and awaiting response`)
            const response = await LlmQueryService.queryLLMService(decodedQuery);
            // const response = "SOME RESPONSE";
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Response from LLM:", response);
            onLlmResponse(decodedQuery, response);
        } catch (error) {
            console.error("Error communicating with LLM:", error);
        }
    }, [decodedQuery]);
    
    useEffect(() => {
        if (!decodedQuery.trim()) {
            return;
        }
        queryLlm(decodedQuery);
        startMouseAnimation();
    }, [decodedQuery, startMouseAnimation]);

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
        // setInputValue(decodedQuery);
        onTypingAnimationDone();
    }, [decodedQuery, onTypingAnimationDone]);

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

    const handleSendClick = useCallback(async () => {
        console.log('Send button clicked');
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
            <motion.img
                src={mouse_cursor}
                ref={cursorRef}
                alt="Animated Mouse Cursor"
                initial={{ top: 0, left: 0 }}
                animate={controls}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ position: 'fixed', width: '20px', height: '20px', pointerEvents: 'none', opacity: 0 }}
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

export default InitialChat;
