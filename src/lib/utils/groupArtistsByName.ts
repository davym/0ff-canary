import type { Artist, GroupedArtists } from '$lib/types';

export const groupArtistsByName = (artists: Artist[]): GroupedArtists => {
	return artists.reduce((acc, artist) => {
		const name = artist.name.replace(/^(The\s+|…\s*)/i, '');
		let firstChar = name.charAt(0).toLowerCase();

		if (!/^[a-z]$/.test(firstChar)) {
			firstChar = '#';
		}

		if (!acc[firstChar]) {
			acc[firstChar] = [];
		}

		acc[firstChar].push(artist);

		return acc;
	}, {} as GroupedArtists);
};
