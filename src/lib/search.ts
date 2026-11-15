import type { Entry } from './wortschatz.ts';

/** Lowercase without accents, so "que" finds "qué". */
export const fold = (s: string) =>
	s
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase();

export const haystack = (e: Entry) =>
	fold([e.term, e.de, e.literal, e.note, e.example?.term, e.example?.de].join(' '));

export const matches = (e: Entry, query: string) => {
	const q = fold(query.trim());
	return !q || haystack(e).includes(q);
};
