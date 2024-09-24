import { writable } from 'svelte/store';

interface FilterType {
	value: string;
	checked: boolean;
}

interface FilterState {
	type: FilterType[];
	artist: string;
	timeframe: {
		start: number;
		end: number;
	};
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
	artist: '',
	timeframe: {
		start: 0,
		end: 9999
	}
};

export const filtersStore = writable(initialState);
