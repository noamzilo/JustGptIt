// MainContent.js
import React from "react";
import styles from "./MainContent.module.css";
import ChatComponent from "./chat/Chat";
import { GPT_PAGE_CONSTANTS } from "../constants";

const MainContent = () => {
    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1>{GPT_PAGE_CONSTANTS.TITLE}</h1>
                <div className={styles.userIcon}>{GPT_PAGE_CONSTANTS.USER_ICON_TEXT}</div>
            </header>

            <section className={styles.querySection}>
                <h2>{GPT_PAGE_CONSTANTS.QUERY_SECTION_TEXT}</h2>
                <ChatComponent />
            </section>

            <footer className={styles.disclaimer}>
                {GPT_PAGE_CONSTANTS.disclaimer}
            </footer>
        </main>
    );
};

export default MainContent;