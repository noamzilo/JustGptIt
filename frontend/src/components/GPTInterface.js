import React, { useState } from "react";
import styles from "./GPTInterface.module.css"; // Import the CSS Module
import ChatComponent from "./ChatComponent";

function GPTInterface() {
  const [message, setMessage] = useState(""); // Track the message input

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <button className={styles.closeSidebarButton}>☰</button>
          <div className={styles.logo}>ChatGPT</div>
          <button className={styles.newChatButton}>＋</button>
        </div>

        <nav className={styles.menu}>
          <ul>
            <li>ChatGPT</li>
            <li>Explore GPTs</li>
          </ul>
        </nav>
        <div className={styles.footer}>Upgrade plan</div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>ChatGPT</h1>
          <div className={styles.userIcon}>N</div>
        </header>

        <section className={styles.querySection}>
          <h2>What can I help with?</h2>
          <div className={styles.inputContainer}>
            <ChatComponent />
          </div>
        </section>

        <footer className={styles.disclaimer}>
          ChatGPT can make mistakes. Check important info.
        </footer>
      </main>
    </div>
  );
}

export default GPTInterface;
