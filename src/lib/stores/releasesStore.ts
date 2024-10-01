import { writable } from 'svelte/store';
import { isBrowser } from '$lib/utils/isBrowser';
import type { Release } from '$lib/types';

function createReleasesStore(key: string, initialValue: Release[]) {
	let value = initialValue;

	if (isBrowser) {
		const storedValue = localStorage.getItem(key);
		value = storedValue ? JSON.parse(storedValue) : initialValue;
	}

	const { subscribe, set, update } = writable<Release[]>(value);

	if (isBrowser) {
		subscribe((currentValue) => {
			localStorage.setItem(key, JSON.stringify(currentValue));
		});
	}

	return {
		subscribe,
		set,
		update,
		merge: (releases: Release[]) => {
			update((data) => {
				const releaseMap = new Map(data.map((item) => [item.id, item]));
				releases.forEach((release) => {
					releaseMap.set(release.id, release);
				});
				return Array.from(releaseMap.values());
			});
		},
		add: (release: Release) => update((data) => [...(<[]>data), { ...release }]),
		remove: (artistId: string) =>
			update((data) => data && data.filter((release) => release.artistId !== artistId))
	};
}

export const releasesStore = createReleasesStore('releasesStore', []);
