import { writable } from 'svelte/store';
import { isBrowser } from '$lib/utils/isBrowser';
import type { Artist } from '$lib/types';
import { releasesStore } from '$lib/stores/releasesStore';
import { sortArtistsByName } from '$lib/utils';

function createLocalStorageStore(key: string, initialValue: Artist[]) {
	let value = initialValue;

	if (isBrowser) {
		const storedValue = localStorage.getItem(key);
		value = storedValue ? JSON.parse(storedValue) : initialValue;
	}

	const { subscribe, set, update } = writable<Artist[]>(value);

	if (isBrowser) {
		// Sync store with localStorage on change
		subscribe((currentValue) => {
			localStorage.setItem(key, JSON.stringify(sortArtistsByName(currentValue)));
		});
	}

	return {
		subscribe,
		set,
		update,
		isFollowing: (name: string) => value.some((artist) => artist.name === name),
		add: ({ id, name }: { id: string; name: string }) =>
			update((data) => [...data, { id, name, lastFetched: new Date() }]),
		remove: (id: string) => {
			update((ids) => ids.filter((artist) => artist.id !== id));
			releasesStore.update((ids) => ids.filter((release) => release.artistId !== id));
		}
	};
}

export const artistsStore = createLocalStorageStore('artistsStore', []);
