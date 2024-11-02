// ChatComponent.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";


// Custom hook to animate mouse move effect
function useMouseMoveAnimation(isAnimatingMouseMove, setIsMouseAnimating) {
    useEffect(() => {
        if (!isAnimatingMouseMove) {
            return;
        }
        // Mouse move effect: simulate a sleep of 1000 and then notify the animation is complete
        setTimeout(() => {
            setIsMouseAnimating(false);
        }, 1000);

    }, [isAnimatingMouseMove]);
}

// Custom hook to animate text typing effect
function useTypeAnimation(text) {
    const [animatingTextValue, setDisplayText] = useState('');
    const [isAnimatingTyping, setIsAnimating] = useState(false);
    const timeoutRef = useRef();

    useEffect(() => {
        if (isAnimatingTyping) {
            if (animatingTextValue.length < text.length) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayText(text.slice(0, animatingTextValue.length + 1));
                }, 50);
            } else {
                setIsAnimating(false);
            }
        }
    }, [animatingTextValue, isAnimatingTyping, text]);

    return { animatingTextValue, isAnimatingTyping, setDisplayText };
};

function useTypingAnimationComplete(isAnimating) {
    // Make sure text area gets the value of the query after typing animation is complete
    useEffect(() => {
        if (!isAnimating) {
            textareaRef.current.value = decodedQuery;
        }
    }, [isAnimating]);
}

function useParsedSearchParams() {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryParam = searchParams.get('query');
    const decodedQuery = queryParam ? decodeURIComponent(queryParam) : '';

    return [decodedQuery, setSearchParams];
}

function handleSendClick() {

    useCallback(() => {
        if (inputValue.trim()) {
            setSearchParams({ query: inputValue });
        }
    }, [inputValue, setSearchParams]);
}

function handleKeyPress() {
    useCallback(
        (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendClick();
            }
        },
        [handleSendClick]
    );
}

// Custom hook to scroll to bottom of textarea
function useScrollToBottomOfTextArea() {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
            textarea.scrollTop = textarea.scrollHeight;
        }
    }, [animatingTextValue, inputValue]);
}

const ChatComponent = () => {
    const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
    const [decodedQuery, setSearchParams] = useParsedSearchParams();
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null); //used for scrolling to bottom of textarea

    const { animatingTextValue, isAnimatingTyping, setDisplayText } = useTypeAnimation(decodedQuery, handleTypingAnimationComplete);
    useMouseMoveAnimation(setDisplayText, isAnimatingMouseMove, setIsMouseAnimating);
    useScrollToBottomOfTextArea();
    useTypingAnimationComplete(isAnimatingTyping);


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
