export const TYPES = ['word', 'phrase', 'question', 'sentence'] as const;
export type EntryType = (typeof TYPES)[number];

export interface Entry {
	id: string;
	term: string;
	de: string;
	type: EntryType;
	tags: string[];
	literal?: string;
	note?: string;
	example?: { term: string; de: string };
}

export interface Deck {
	code: string;
	language: string;
	flag: string;
	entries: Entry[];
}
