import { writable } from 'svelte/store';

interface FilterType {
	value: string;
	checked: boolean;
}

interface FilterState {
	type: FilterType[];
	artist: string;
}

const initialState: FilterState = {
	type: [
		{
			value: 'Album',
			checked: true
		},
		{
			value: 'EP',
			checked: true
		},
		{
			value: 'Single',
			checked: true
		}
	],
	artist: ''
};

export const filtersStore = writable(initialState);
