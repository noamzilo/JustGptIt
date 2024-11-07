// MainContent.js
import React, { useCallback, useState, useEffect } from "react";
import styles from "./MainContent.module.css";
import InitialChat from "./chat/InitialChat";
import { GPT_PAGE_CONSTANTS } from "../constants";
import ResponseChat from "./chat/ResponseChat";

const MainContent = () => {
    const [isInitialChatDoneAnimating, setIsInitialChatDoneAnimating] = useState(false);
    const [llmQuery, setLlmQuery] = useState('');
    const [llmResponse, setLlmResponse] = useState('');

    const handleTypingAnimationDone = useCallback(() => {
        console.log('MainContent: Typing animation done');
        setIsInitialChatDoneAnimating(true);
    }, []);

    const onLlmResponse = useCallback((query, response) => {
        console.log(`MainContent: LLM query: ${query}, response:`, response);
        setLlmQuery(query);
        setLlmResponse(response);
    }, []);

    const [initialChatDone, setInitialChatDone] = useState(false);

    useEffect(() => {
        if (llmResponse !== '' && isInitialChatDoneAnimating) {
            setInitialChatDone(true);
            console.log('MainContent: Initial chat done');
        }
    }, [llmResponse, isInitialChatDoneAnimating]);

    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1>{GPT_PAGE_CONSTANTS.TITLE}</h1>
                <div className={styles.userIcon}>{GPT_PAGE_CONSTANTS.USER_ICON_TEXT}</div>
            </header>

            <section className={styles.querySection}>
                {isInitialChatDoneAnimating
                    ? <h2>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
                    : null}
                {
                    !isInitialChatDoneAnimating ?
                        <InitialChat onTypingAnimationDone={handleTypingAnimationDone} onLlmResponse={onLlmResponse} />
                        :
                        // < ResponseChat query="Hello is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchange" response="Hi there! is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchange" />
                        < ResponseChat query={llmQuery} response={llmResponse} />
                }
            </section>

            <footer className={styles.disclaimer}>
                {GPT_PAGE_CONSTANTS.disclaimer}
            </footer>
        </main>
    );
};

export default MainContent;