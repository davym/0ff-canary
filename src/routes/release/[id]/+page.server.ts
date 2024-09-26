import bcfetch from 'bandcamp-fetch';
import { fetchCoverArt, removePunctuation, headers } from '$lib/utils';
import type { PageServerLoad } from './$types';
import type { BandcampAlbum, OtherAlbum, Artist } from '$lib/types';

interface ReleaseGroupData {
	title: string;
	'artist-credit': Artist[];
	'first-release-date': string;
	'primary-type': string;
	id: string;
}

export const load: PageServerLoad = async ({ params }) => {
	const releaseGroupUrl = `https://musicbrainz.org/ws/2/release-group/${params.id}?inc=artist-credits&fmt=json`;
	const releaseGroupRes = await fetch(releaseGroupUrl, { headers });
	let album: OtherAlbum | BandcampAlbum;

	if (!releaseGroupRes.ok) {
		throw new Error(
			`Failed to fetch releases: ${releaseGroupRes.status} ${releaseGroupRes.statusText}`
		);
	}
	const releaseGroupData: ReleaseGroupData = await releaseGroupRes.json();

	const baseParams = {
		albumImageFormat: 'art_app_large',
		artistImageFormat: 'bio_featured'
	};

	album = {
		name: releaseGroupData.title,
		artist: {
			name:
				releaseGroupData['artist-credit'][0].name ||
				releaseGroupData['artist-credit'][0]?.artist?.name,
			id: releaseGroupData['artist-credit'][0]?.artist?.id
		},
		id: releaseGroupData.id,
		imageUrl: await fetchCoverArt(params.id, 'large'),
		dataSource: 'other',
		type: releaseGroupData['primary-type'],
		releaseDate: releaseGroupData['first-release-date']
	};

	const albums = await bcfetch.search.albums({
		...baseParams,
		query: `${releaseGroupData.title} ${releaseGroupData['artist-credit'][0].name}`
	});

	if (!albums || albums?.items.length === 0) {
		return { album };
	}

	const filteredAlbums = albums.items.filter((album) => {
		const bcName = album.name.toLowerCase();
		const bcArtist = album.artist?.toLowerCase();
		const rgName = releaseGroupData.title.toLowerCase();
		const rgArtist = releaseGroupData['artist-credit'][0].name.toLowerCase();

		return (
			(bcName === rgName ||
				bcName.includes(rgName) ||
				removePunctuation(bcName) === removePunctuation(rgName) ||
				removePunctuation(bcName).includes(removePunctuation(rgName))) &&
			(bcArtist === rgArtist ||
				bcArtist?.includes(rgArtist) ||
				removePunctuation(bcArtist || '') === removePunctuation(rgArtist) ||
				removePunctuation(bcArtist || '').includes(removePunctuation(rgArtist)))
		);
	});

	if (!filteredAlbums || filteredAlbums.length === 0) {
		return { album };
	}

	const albumUrl = filteredAlbums.length > 0 ? filteredAlbums[0].url : albums.items[0].url;

	const albumInfo = await bcfetch.album.getInfo({
		albumUrl,
		albumImageFormat: 'art_app_large',
		artistImageFormat: 'bio_featured'
	});

	album = {
		artist: {
			name:
				albumInfo.artist?.name ||
				releaseGroupData['artist-credit'][0].name ||
				releaseGroupData['artist-credit'][0]?.artist?.name,
			url: albumInfo.artist?.url,
			id: releaseGroupData['artist-credit'][0].artist?.id
		},
		tracks: albumInfo.tracks?.map(({ position, name, duration, streamUrl }) => ({
			position,
			name,
			duration,
			streamUrl,
			artist: albumInfo.artist?.name || '',
			releaseId: releaseGroupData.id
		})),
		releaseDate: albumInfo.releaseDate,
		url: albumInfo.url,
		name: albumInfo.name,
		imageUrl: albumInfo.imageUrl,
		description: albumInfo.description,
		dataSource: 'bandcamp',
		type: releaseGroupData['primary-type'],
		id: releaseGroupData.id
	};

	return {
		album
	};
};
