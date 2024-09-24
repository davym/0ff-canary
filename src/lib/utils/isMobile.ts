import { isBrowser } from '$lib/utils';

export const isMobile = (): boolean => isBrowser && window.innerWidth < 769;
