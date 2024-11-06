// GPTInterface.js
import React from "react";
import styles from "./GPTInterface.module.css";
import Sidebar from "./sidebar/Sidebar";
import MainContent from "./main_content/MainContent";
import { useEffect } from "react";
import { GPT_PAGE_CONSTANTS } from "./constants";

function GPTInterface() {
  useEffect(() => {
    document.title = GPT_PAGE_CONSTANTS.TITLE;
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default GPTInterface;