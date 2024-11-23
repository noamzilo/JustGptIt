// useMouseAnimation.js

import { useState, useCallback } from 'react';
import { useAnimation } from 'framer-motion';

function useMouseAnimation(emitter, targetPositionTop, targetPositionLeft) {
	const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
	const controls = useAnimation();

	const startMouseAnimation = useCallback(async () => {
		setIsMouseAnimating(true);
		console.log('Mouse move effect started');

		await controls.set({ top: 0, left: 0, opacity: 0 });
		await controls.set({ opacity: 1 });
		await controls.start(
			{
				top: targetPositionTop,
				left: targetPositionLeft,
			},
			{ duration: 1.5, ease: 'easeOut' }
		);

		setIsMouseAnimating(false);
		emitter.emit('mouseAnimationDone');
	}, [controls, emitter, targetPositionTop, targetPositionLeft]);

	return { isAnimatingMouseMove, startMouseAnimation, controls };
}

export default useMouseAnimation;
