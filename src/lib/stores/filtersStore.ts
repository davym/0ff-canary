import { writable } from 'svelte/store';
import deepEqual from 'deep-equal';

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

const createFiltersStore = () => {
	const { subscribe, set, update } = writable<FilterState>(structuredClone(initialState));

	return {
		subscribe,
		set,
		update,
		reset: () => set(structuredClone(initialState)),
		isInitial: (currentState: FilterState) => {
			return deepEqual(currentState, initialState);
		}
	};
};

export const filtersStore = createFiltersStore();
