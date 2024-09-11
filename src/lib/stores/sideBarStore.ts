import { writable } from 'svelte/store';

export const sideBarStore = writable<boolean>(false);
