// MainContent.js
import React, { useCallback, useState } from "react";
import styles from "./MainContent.module.css";
import InitialChat from "./chat/InitialChat";
import { GPT_PAGE_CONSTANTS } from "../constants";
import ResponseChat from "./chat/ResponseChat";

const MainContent = () => {
    const [isInitialChat, setIsInitialChat] = useState(true);

    const handleTypingAnimationDone = useCallback(() => {
        setIsInitialChat(false);
    }, []);


    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1>{GPT_PAGE_CONSTANTS.TITLE}</h1>
                <div className={styles.userIcon}>{GPT_PAGE_CONSTANTS.USER_ICON_TEXT}</div>
            </header>

            <section className={styles.querySection}>
                {isInitialChat
                    ? <h2>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
                    : null}
                {
                    // isInitialChat
                    // ? <InitialChat onTypingAnimationDone={handleTypingAnimationDone} />
                    // :
                    < ResponseChat query="Hello" response="Hi there!" />
                }
            </section>

            <footer className={styles.disclaimer}>
                {GPT_PAGE_CONSTANTS.disclaimer}
            </footer>
        </main>
    );
};

export default MainContent;