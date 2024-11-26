// useMouseAnimation.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAnimation } from 'framer-motion';

function useMouseAnimation(emitter, targetPositionTop, targetPositionLeft) {
	const [isAnimatingMouseMove, setIsMouseAnimating] = useState(false);
	const controls = useAnimation();
	const timeoutRef = useRef(null); // To keep track of the timeout for cleanup

	const startMouseAnimation = useCallback(async () => {
		setIsMouseAnimating(true);
		console.log('Mouse move effect started');

		// Initialize position and make it invisible
		await controls.set({ top: 0, left: 0, opacity: 0 });

		// Make the element visible instantly
		await controls.set({ opacity: 1 });

		// Animate to target position
		await controls.start(
			{
				top: targetPositionTop,
				left: targetPositionLeft,
			},
			{ duration: 1.5, ease: 'easeOut' }
		);

		// Wait for 100ms before making it disappear
		timeoutRef.current = setTimeout(async () => {
			// Immediately hide the element without animation
			await controls.set({ opacity: 0 });

			setIsMouseAnimating(false);
			emitter.emit('mouseAnimationDone');
		}, 150);
	}, [controls, emitter, targetPositionTop, targetPositionLeft]);

	// Cleanup the timeout if the component unmounts before timeout completes
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { isAnimatingMouseMove, startMouseAnimation, controls };
}

export default useMouseAnimation;
