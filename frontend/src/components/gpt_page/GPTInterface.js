// GPTInterface.js
import React from "react";
import styles from "./GPTInterface.module.css";
import Sidebar from "./sidebar/Sidebar";
import ChatComponent from "./chat/Chat";

function GPTInterface() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>ChatGPT</h1>
          <div className={styles.userIcon}>N</div>
        </header>

        <section className={styles.querySection}>
          <h2>What can I help with?</h2>
          <ChatComponent />
        </section>

        <footer className={styles.disclaimer}>
          ChatGPT can make mistakes. Check important info.
        </footer>
      </main>
    </div>
  );
}

export default GPTInterface;