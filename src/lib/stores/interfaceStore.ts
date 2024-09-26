import { writable } from 'svelte/store';
import { isBrowser } from '$lib/utils/isBrowser';
import type { Interface } from '$lib/types';

let initialState: Interface = {
	colorMode: 'dark',
	animations:
		isBrowser && window.matchMedia('(prefers-reduced-motion)').matches ? 'disabled' : 'enabled',
	refetch: 7
};

if (isBrowser) {
	const storedInterface: string | null = localStorage.getItem('interface');
	initialState = storedInterface ? JSON.parse(storedInterface) : initialState;
}

export const interfaceStore = writable<Interface>(initialState);

if (isBrowser) {
	interfaceStore.subscribe((value) => {
		localStorage.setItem('interface', JSON.stringify(value));
	});
}
