import { useState, useEffect } from 'react';

function useTypingAnimation(text, isAnimating, onComplete) {
	const [animatingTextValue, setAnimatingTextValue] = useState('');
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (!isAnimating || index >= text.length) return;

		const intervalId = setInterval(() => {
			setAnimatingTextValue((prev) => text.slice(0, prev.length + 1));
			setIndex((prevIndex) => prevIndex + 1);

			// When complete, clear the interval and call onComplete once
			if (index >= text.length - 1) {
				clearInterval(intervalId);
				onComplete();
			}
		}, 50);

		return () => clearInterval(intervalId);
	}, [text, isAnimating, index, onComplete]);

	// Reset animation on start
	useEffect(() => {
		if (isAnimating) {
			setAnimatingTextValue('');
			setIndex(0);
		}
	}, [isAnimating, text]);

	return animatingTextValue;
}

export default useTypingAnimation;
