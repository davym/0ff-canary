import { writable } from 'svelte/store';

interface MusicState {
	title: string;
	artist: string;
	releaseId: string;
	src: string;
	isPlaying: boolean;
	currentTime: number;
	cover?: string;
}

const initialState: MusicState = {
	title: '',
	artist: '',
	releaseId: '',
	src: '',
	cover: '',
	isPlaying: false,
	currentTime: 0
};

const musicStore = writable(initialState);

const playTrack = (
	title: string,
	artist: string,
	releaseId: string,
	src: string,
	cover?: string
): void => {
	musicStore.update((state) => ({
		...state,
		title,
		releaseId,
		artist,
		src,
		cover,
		isPlaying: true,
		currentTime: 0
	}));
};

const resumeTrack = (): void => {
	musicStore.update((state) => ({
		...state,
		isPlaying: true
	}));
};

const pauseTrack = (): void => {
	musicStore.update((state) => ({
		...state,
		isPlaying: false
	}));
};

const updateCurrentTime = (time: number): void => {
	musicStore.update((state) => ({
		...state,
		currentTime: time
	}));
};

const reset = (): void => {
	musicStore.set(initialState);
};

export default {
	subscribe: musicStore.subscribe,
	playTrack,
	resumeTrack,
	pauseTrack,
	updateCurrentTime,
	reset
};
