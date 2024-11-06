// AnimatedText.js
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AnimatedText.module.css'; // Optional: Separate styles if needed

function AnimatedText({ text }) {
    return (
        <motion.div
            className={styles.messageText}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.01, // Controls typing speed
                    },
                },
            }}
        >
            {text.split('').map((char, index) => (
                <motion.span key={index} variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 },
                }}>
                    {char}
                </motion.span>
            ))}
        </motion.div>
    );
}

export default AnimatedText;
