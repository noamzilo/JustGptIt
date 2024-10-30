// GPTInterface.js
import React from "react";
import styles from "./GPTInterface.module.css";
import Sidebar from "./sidebar/Sidebar";
import MainContent from "./main_content/MainContent";

function GPTInterface() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default GPTInterface;