import type { Artist } from '$lib/types';

export const mergeArtists = (a: Artist[], b: Artist[]) => {
	const mergedArray = [...a, ...b];

	return mergedArray.reduce((acc: Artist[], current: Artist) => {
		const existingIndex = acc.findIndex((item: Artist) => item.id === current.id);

		if (existingIndex === -1) {
			acc.push(current);
		}

		return acc;
	}, []);
};
