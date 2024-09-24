export const downloadLocalStorageItem = (key: string): void => {
	const data = localStorage.getItem(key);

	if (data) {
		const formattedJSON = JSON.stringify(JSON.parse(data), null, 2);

		const jsonBlob = new Blob([formattedJSON], { type: 'application/json' });

		const link = document.createElement('a');
		link.href = URL.createObjectURL(jsonBlob);
		link.download = `canary_artists.${new Date().toISOString()}.json`; // Updated file name for download

		link.click();

		URL.revokeObjectURL(link.href);
	} else {
		console.warn('No data found in localStorage for the given key.');
	}
};
