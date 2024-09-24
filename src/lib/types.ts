export interface Release {
	id: string;
	title: string;
	artists: Artist[];
	artistId: string;
	date: Date;
	type?: string;
	cover?: string;
}

export interface Artist {
	id: string;
	name: string;
}

export interface GroupedArtists {
	[key: string]: Artist[];
}

export interface BandcampAlbumArtist {
	url?: string;
	name?: string;
}

export interface BandcampAlbumTrack {
	position?: number;
	name: string;
	artist: string;
	streamUrl?: string;
	cover?: string;
	duration?: number;
}

export interface BandcampAlbum {
	artist: BandcampAlbumArtist;
	tracks?: BandcampAlbumTrack[];
	releaseDate?: string;
	url?: string;
	name: string;
	imageUrl?: string;
	description?: string;
	dataSource: string;
	type: string;
}

export interface OtherAlbum {
	artist: BandcampAlbumArtist;
	releaseDate?: string;
	name: string;
	imageUrl?: string;
	dataSource: string;
	type: string;
}

export interface Message {
	type: 'error' | 'success' | 'warning';
	text: string;
}

export interface SearchResult {
	id: string;
	name: string;
	disambiguation?: string;
}

export interface Interface {
	colorMode: 'light' | 'dark';
	animations: 'enabled' | 'disabled';
}
