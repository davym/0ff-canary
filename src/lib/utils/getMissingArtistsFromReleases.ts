import type { Release, Artist } from '$lib/types';

export const getMissingArtistsFromReleases = (artists: Artist[], releases: Release[]): Artist[] => {
	if (artists.length === 0) {
		return [];
	}

	if (!releases || releases.length === 0) {
		return artists;
	}

	return artists.filter((artist) => !releases.some((release) => release.artistId === artist.id));
};
