// useTypingAnimation.js

import { useState, useEffect } from 'react';

function useTypingAnimation(text, isAnimating, onComplete) {
	const [animatingTextValue, setAnimatingTextValue] = useState('');

	useEffect(() => {
		if (!isAnimating) return;

		let index = 0;
		const intervalId = setInterval(() => {
			index += 1;
			setAnimatingTextValue(text.slice(0, index));

			if (index >= text.length) {
				clearInterval(intervalId);
				onComplete();
			}
		}, 50);

		return () => clearInterval(intervalId);
	}, [text, isAnimating, onComplete]);

	return animatingTextValue;
}

export default useTypingAnimation;
