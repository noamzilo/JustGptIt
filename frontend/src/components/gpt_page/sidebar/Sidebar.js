// Sidebar.js
import React from "react";
import styles from "./Sidebar.module.css";

function Sidebar() {
    return (
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
    );
}

export default Sidebar;