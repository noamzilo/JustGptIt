// Sidebar.js
import React from "react";
import styles from "./Sidebar.module.css";

function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <button className={styles.closeSidebarButton}>☰</button>
                <button className={styles.newChatButton}>＋</button>
            </div>
            <div className={styles.sidebarContent}>
                <div className={styles.sidebarPinnedItems}>
                    <div className={styles.logo}>Pinned1</div>
                    <div className={styles.logo}>Pinend2</div>
                </div>

                <div className={styles.sidebarRecentChats}>
                    <div className={styles.sidebarRecentChat}>Chat1</div>
                    <div className={styles.sidebarRecentChat}>Chat2</div>
                </div>
            </div>
            <div className={styles.footer}>Upgrade plan</div>
        </aside>
    );
}

export default Sidebar;