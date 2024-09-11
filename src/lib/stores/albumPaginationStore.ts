import { writable } from 'svelte/store';

interface AlbumPaginationState {
	currentPage: number;
	totalPages: number;
	albumsPerPage: number;
}

const initialState: AlbumPaginationState = {
	currentPage: 1,
	totalPages: 1,
	albumsPerPage: 60
};

const albumPaginationStore = writable<AlbumPaginationState>(initialState);

const increment = (): void => {
	albumPaginationStore.update((state) => ({
		...state,
		currentPage: state.currentPage + 1
	}));
};

const decrement = (): void => {
	albumPaginationStore.update((state) => ({
		...state,
		currentPage: state.currentPage - 1
	}));
};

const goToPage = (index: number): void => {
	albumPaginationStore.update((state) => ({
		...state,
		currentPage: index
	}));
};

export default {
	subscribe: albumPaginationStore.subscribe,
	increment,
	decrement,
	goToPage
};
