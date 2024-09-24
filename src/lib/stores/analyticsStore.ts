import { writable } from 'svelte/store';
import { isBrowser } from '$lib/utils';

const localStorageKey = 'analyticsPreference';

function createAnalyticsStore() {
	const initialValue =
		isBrowser && localStorage.getItem(localStorageKey) !== null
			? JSON.parse(localStorage.getItem(localStorageKey) as string)
			: true;

	const { subscribe, set, update } = writable<boolean>(initialValue);

	if (isBrowser) {
		subscribe((value) => {
			localStorage.setItem(localStorageKey, JSON.stringify(value));
		});
	}

	return { subscribe, set, update };
}

export const analyticsStore = createAnalyticsStore();
