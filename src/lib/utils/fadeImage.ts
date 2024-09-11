export const fadeImage = (node: HTMLImageElement): { destroy(): void } => {
	const fadeIn = () => {
		node.style.transition = 'opacity 1s ease-out';
		node.style.opacity = '1';
	};

	if (node.complete && node.naturalHeight !== 0) {
		node.style.opacity = '1';
	} else {
		node.style.opacity = '0';
		node.addEventListener('load', fadeIn);
	}

	return {
		destroy() {
			node.removeEventListener('load', fadeIn);
		}
	};
};
