export const removePunctuation = (input: string): string =>
	input.replace(/[.,'"‘’“”\-\!\?\:\;\(\)\[\]\{\}…]/g, '');
