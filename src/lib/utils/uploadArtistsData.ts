import { artistsStore } from '$lib/stores';
import type { Message } from '$lib/types';

export async function uploadArtistsData(file: File): Promise<Message> {
	if (!file) {
		return {
			type: 'error',
			text: 'No file selected.'
		};
	}

	try {
		const text = await file.text();
		const data = JSON.parse(text);

		if (validateJSON(data)) {
			localStorage.setItem('artistsStore', JSON.stringify(data));
			artistsStore.set(data);
			return {
				type: 'success',
				text: 'File uploaded and data updated!'
			};
		} else {
			return {
				type: 'error',
				text: 'Invalid JSON format!'
			};
		}
	} catch (error) {
		console.error(error);
		return {
			type: 'error',
			text: 'Error reading the file or invalid JSON!'
		};
	}
}

const validateJSON = (data: unknown): boolean => {
	if (Array.isArray(data)) {
		return data.every((item) => typeof item.id === 'string' && typeof item.name === 'string');
	}
	return false;
};
