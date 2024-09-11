import type { Artist, Release } from '$lib/types';

export function isReleasesStoreValid(artists: Artist[], releases: Release[]): boolean {
	const artistIds = new Set(artists.map((item) => item.id));
	const releaseArtistIds = new Set(releases.map((item) => item.artistId));

	const allArtistsIdsInReleases = [...artistIds].every((id) => releaseArtistIds.has(id));
	const allReleasesIdsInArtists = [...releaseArtistIds].every((artistId) =>
		artistIds.has(artistId)
	);

	if (allArtistsIdsInReleases && allReleasesIdsInArtists) {
		return true;
	} else {
		return false;
	}
}
