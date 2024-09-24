import { isBrowser } from './isBrowser';

export const navigateBack = (event: Event): void | false => {
	if (isBrowser) {
		if (window.history.length > 1) {
			event.preventDefault();
			window.history.back();
		}
	}
};
