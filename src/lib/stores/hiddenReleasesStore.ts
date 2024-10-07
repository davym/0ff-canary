import { writable } from 'svelte/store';
import { isBrowser } from '$lib/utils/isBrowser';
import type { Release } from '$lib/types';

function createReleasesStore(key: string, initialValue: string[]) {
	let value = initialValue;

	if (isBrowser) {
		const storedValue = localStorage.getItem(key);
		value = storedValue ? JSON.parse(storedValue) : initialValue;
	}

	const { subscribe, set, update } = writable<string[]>(value);

	if (isBrowser) {
		subscribe((currentValue) => {
			localStorage.setItem(key, JSON.stringify(currentValue));
		});
	}

	return {
		subscribe,
		set,
		update,
		add: (id: string) => update((data) => [...data, id]),
		remove: (id: string) => update((data) => data.filter((dataId) => dataId !== id))
	};
}

export const hiddenReleasesStore = createReleasesStore('hiddenReleases', []);
