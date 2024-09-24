export const ensureHttps = (url: string): string =>
	url.startsWith('http://') ? url.replace('http://', 'https://') : url;
