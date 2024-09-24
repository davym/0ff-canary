import { writable } from 'svelte/store';

interface FilterState {
	isActive: boolean;
	message?: string;
}

const initialState: FilterState = {
	isActive: false
};

export const loadingStore = writable<FilterState>(initialState);
