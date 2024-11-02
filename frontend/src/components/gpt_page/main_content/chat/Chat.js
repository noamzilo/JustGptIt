// ChatComponent.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Chat.module.css";
import { emitter } from './eventEmitter';


// Custom hook to animate mouse move effect
function useMouseMoveAnimation(isAnimatingMouseMove, setIsMouseAnimating) {
    useEffect(() => {
        setIsMouseAnimating(true);
        // Mouse move effect: simulate a sleep of 1000 and then notify the animation is complete
        console.log('Mouse move effect started');
        setTimeout(() => {
            setIsMouseAnimating(false);
            console.log('Mouse move effect complete');
            emitter.emit('mouseAnimationDone');
        }, 1000);

    }, [decodedQuery]);
}

//start typing animation when mouse move effect is complete
function useRegisterEvents(handleTypingAnimation) {
    useEffect(() => {
        const handleMouseAnimationDone = () => {
            handleTypingAnimation();
        };

        emitter.on('mouseAnimationDone', handleMouseAnimationDone);

        return () => {
            emitter.off('mouseAnimationDone', handleMouseAnimationDone);
        };
    }, []);
}

// Custom hook to animate text typing effect. When done, send an event 
function handleTypingAnimation(
    isAnimatingTyping,
    setIsAnimatingTyping,
) {
    if (!isAnimatingTyping) {
        return { animatingTextValue: '', isAnimatingTyping, setDisplayText };
    }
    const [animatingTextValue, setDisplayText] = useState('');
    const timeoutRef = useRef();

    if (animatingTextValue.length < text.length) {
        timeoutRef.current = setTimeout(() => {
            setDisplayText(text.slice(0, animatingTextValue.length + 1));
        }, 50);
    } else {
        setIsAnimatingTyping(false);
        // emitter.emit('typingAnimationDone');
    }

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
    const [isAnimatingTyping, setIsAnimatingTyping] = useState(false);
    const [decodedQuery, setSearchParams] = useParsedSearchParams();
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null); //used for scrolling to bottom of textarea

    useMouseMoveAnimation(setDisplayText, isAnimatingMouseMove, setIsMouseAnimating);
    const { animatingTextValue, setDisplayText } = handleTypingAnimation(
        isAnimatingTyping,
        setIsAnimatingTyping,
        decodedQuery,
    );

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

    useScrollToBottomOfTextArea();
    useTypingAnimationComplete(isAnimatingTyping);
    useRegisterEvents(handleTypingAnimation)

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
