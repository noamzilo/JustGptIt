import GptQueryService from "../../../services/GptQueryService";
import { useState } from "react";
import styles from "./Chat.module.css"; // Import the CSS Module


function ChatComponent() {
    const [message, setMessage] = useState('');

    const handleSendClick = async () => {
        if (message.trim()) {
            const isValid = await GptQueryService.queryGPT(message);
            if (isValid) {
                console.log('Message sent successfully');
                setMessage(''); // Clear the input if the message was valid
            } else {
                console.log('Message failed to send');
            }
        }
    };

    return (
        <div className={styles.inputContainer}>
            <input
                type="text"
                placeholder="Message ChatGPT"
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Update message on input change
            />
            <button
                className={`${styles.sendButton} ${message ? styles.sendButtonActive : ""}`}
            >
                ↑
            </button>
        </div>
    );
}

export default ChatComponent;
