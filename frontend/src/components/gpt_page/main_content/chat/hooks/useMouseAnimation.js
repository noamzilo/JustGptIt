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

		try {
			// Initialize position and make it invisible
			controls.set({ top: 0, left: 0, opacity: 0 });

			// Make the element visible instantly
			controls.set({ opacity: 1 });

			// Animate to target position
			const duration_sec = 1.5;
			controls.start(
				{
					top: targetPositionTop,
					left: targetPositionLeft,
				},
				{ duration: duration_sec, ease: 'easeOut' }
			);

			const static_wait_sec = 0.1;
			// Wait for 100ms after the animation finishes
			await new Promise(resolve => {
				timeoutRef.current = setTimeout(resolve, 1000 * (duration_sec + static_wait_sec));
			});

			// Immediately hide the element without animation
			controls.set({ opacity: 0 });

			// Notify the emitter and update state
			emitter.emit('mouseAnimationDone');
		} finally {
			setIsMouseAnimating(false);
		}
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
