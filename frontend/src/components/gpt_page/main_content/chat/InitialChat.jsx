// InitialChat.jsx

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import styles from "./InitialChat.module.css";
import mitt from 'mitt';
import LlmQueryService from "../../../../services/LlmQueryService";
import ChatInputPane from "./ChatInputPane";

function InitialChat({ onTypingAnimationDone, onLlmResponse, onQueryChange }) {
    const mouse_cursor = `${process.env.PUBLIC_URL}/assets/mouse_cursor.svg`;
    const emitter = useMemo(() => mitt(), []);

    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    const [inputValue, setInputValue] = useState('');
    const cursorRef = useRef(null);

    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [animatingTextValue, setAnimatingTextValue] = useState('');

    const controls = useAnimation();

    useEffect(() => {
        if (decodedQuery.trim()) {
            onQueryChange(decodedQuery);
        }
    }, [decodedQuery, onQueryChange]);

    const startMouseAnimation = useCallback(async () => {
        setAnimatingTextValue('');
        setIsMouseAnimating(true);
        console.log('Mouse move effect started');

        if (!cursorRef.current) return;

        await controls.set({ top: 0, left: 0, opacity: 0 });
        const targetPosition = {
            top: window.innerHeight / 2,
            left: window.innerWidth / 2,
        };

        await controls.set({ opacity: 1 });
        await controls.start({
            top: targetPosition.top,
            left: targetPosition.left,
        }, { duration: 1.5, ease: "easeOut" });

        setIsMouseAnimating(false);
        emitter.emit('mouseAnimationDone'); // Trigger mouse animation done event
    }, [controls, emitter]);

    const queryLlm = useCallback(async (decodedQuery) => {
        try {
            console.log(`LlmQueryService asked ${decodedQuery} and awaiting response`)
            const response = await LlmQueryService.queryLLMService(decodedQuery);
            if (!response) {
                throw new Error(`Llm Query with query ${decodedQuery} got empty response`);
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log("Response from LLM:", response);
            onLlmResponse(response);
        } catch (error) {
            console.error("Error communicating with LLM:", error);
        }
    }, [onLlmResponse]);

    useEffect(() => {
        if (!decodedQuery.trim()) return;
        queryLlm(decodedQuery);
        startMouseAnimation();
    }, [decodedQuery, startMouseAnimation, queryLlm]);

    const handleMouseAnimationDone = useCallback(() => {
        setIsAnimatingTyping(true);
    }, []);

    // Listen for mouse animation done and start typing animation
    useEffect(() => {
        emitter.on('mouseAnimationDone', handleMouseAnimationDone);
        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, [emitter, handleMouseAnimationDone]);

    const typingAnimationEffect = useCallback(() => {
        if (!isAnimatingTyping) {
            return () => {};
        }
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
        
    }, [isAnimatingTyping, emitter, decodedQuery]);

    useEffect(() => {
        const cleanup = typingAnimationEffect();
        return cleanup;
    }, [typingAnimationEffect]);

    const handleTypingAnimationDone = useCallback(async () => {
        setInputValue(decodedQuery);
        await new Promise(resolve => setTimeout(resolve, 200));  // would put this in the typing animation but that is hard to do now
        console.log('Typing animation done');
        onTypingAnimationDone();
    }, [decodedQuery, onTypingAnimationDone]);

    useEffect(() => {
        emitter.on('typingAnimationDone', handleTypingAnimationDone);
        return () => {
            emitter.off('typingAnimationDone', handleTypingAnimationDone);
        };
    }, [emitter, handleTypingAnimationDone]);

    const handleSendClick = useCallback(async () => {
        console.log('Send button clicked');
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);

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
                style={{ 
                    position: 'fixed',
                     width: '20px',
                      height: '20px', 
                      pointerEvents: 'none',
                       opacity: 0,
                       zIndex: 9999,
                }}
                
            />
            <ChatInputPane
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSendClick={handleSendClick}
                isAnimating={isAnimating}
                animatingTextValue={animatingTextValue}
            />
        </div>
    );
}

export default InitialChat;
