// this should display a large blinking dot

import React from "react";
import styles from "./ResponseThinkingPlaceholder.module.css";

function ResponseThinkingPlaceholder() {
	return (
		<div className={styles.thinkingContainer}>
			<div className={styles.thinkingDot}>○</div>
		</div>
	);
}

export default ResponseThinkingPlaceholder;
