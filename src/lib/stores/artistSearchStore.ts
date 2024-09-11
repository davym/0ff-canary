import { writable } from 'svelte/store';
import type { SearchResult } from '$lib/types';

export const searchTerm = writable<string>('');
export const searchResults = writable<SearchResult[]>([]);
