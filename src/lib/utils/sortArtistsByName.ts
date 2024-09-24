import type { Artist } from '$lib/types';

export const sortArtistsByName = (artists: Artist[]): Artist[] => {
	return artists.sort((a, b) => {
		const nameA = removeThePrefix(a.name);
		const nameB = removeThePrefix(b.name);

		return nameA.localeCompare(nameB);
	});
};

const removeThePrefix = (name: string): string => {
	return name.toLowerCase().startsWith('the ')
		? name.slice(4)
		: name.startsWith('…')
			? name.slice(1)
			: name;
};
