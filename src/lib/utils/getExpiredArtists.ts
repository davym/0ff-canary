import type { Artist } from '$lib/types';

export const getExpiredArtists = (artists: Artist[], refetchInterval: number): Artist[] => {
	if (artists.length === 0) {
		return [];
	}

	return artists.filter((artist) => {
		const currentDate: Date = new Date();
		const newDate: Date = new Date(artist.lastFetched);
		newDate.setDate(newDate.getDate() + refetchInterval);
		return !artist.lastFetched || currentDate > newDate;
	});
};
