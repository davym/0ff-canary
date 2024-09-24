import { ensureHttps, headers } from '$lib/utils';
import type { Release, Artist } from '$lib/types';

export const fetchCoverArt = async (
	releaseGroupId: string,
	size: '1200' | '250' | '500' | 'large' | 'small' = 'small'
) => {
	const coverArtUrl = `https://coverartarchive.org/release-group/${releaseGroupId}`;
	try {
		const coverArtResponse = await fetch(coverArtUrl);
		const coverArtData = await coverArtResponse.json();
		if (coverArtData.image && (size === 'large' || size === '1200')) {
			return ensureHttps(coverArtData.image);
		}
		if (coverArtData.images && coverArtData.images.length > 0) {
			return ensureHttps(coverArtData.images[0].thumbnails[size]);
		}
	} catch (error) {
		console.warn(`No cover art found for release group: ${releaseGroupId}`, error);
	}
};

const fetchArtistReleases = async (id: string): Promise<Release[]> => {
	const releaseUrl = `https://musicbrainz.org/ws/2/release-group?artist=${id}&type=album|ep|single&fmt=json&inc=artist-credits&sort=date-desc`;

	try {
		const releaseRes = await fetch(releaseUrl, { headers });
		if (!releaseRes.ok) {
			throw new Error(`Failed to fetch releases: ${releaseRes.status} ${releaseRes.statusText}`);
		}
		const releaseData = await releaseRes.json();
		const filteredReleases = releaseData['release-groups']
			.filter((group: { 'first-release-date'?: string }) => group['first-release-date'])
			.sort(
				(a: { 'first-release-date': string }, b: { 'first-release-date': string }) =>
					new Date(b['first-release-date']).getTime() - new Date(a['first-release-date']).getTime()
			);

		const mappedReleases: Release[] = await Promise.all(
			filteredReleases.map(
				async (release: {
					id: string;
					title: string;
					'artist-credit': Artist[];
					'first-release-date': string;
					'primary-type': string;
				}) => ({
					id: release.id,
					title: release.title,
					artists: release['artist-credit'],
					artistId: id,
					date: new Date(release['first-release-date']),
					type: release['primary-type'],
					cover: await fetchCoverArt(release.id)
				})
			)
		);
		return mappedReleases || [];
	} catch (error) {
		console.error('Error fetching releases:', error);
		return [];
	}
};

export { fetchArtistReleases };
