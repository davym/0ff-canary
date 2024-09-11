import { get } from 'svelte/store';
import type { Release, Artist } from '$lib/types';
import { artistsStore, releasesStore } from '$lib/stores';

export const deleteOrphanedReleases = (): void => {
	const artists: Artist[] = get(artistsStore);
	const releases: Release[] = get(releasesStore);

	const orphanedReleases: Release[] = releases.filter(
		(release: Release) => !artists.some((artist: Artist) => artist.id === release.artistId)
	);

	orphanedReleases.forEach((release: Release) => {
		releasesStore.remove(release.artistId);
	});
};
