export const TYPES = ['word', 'phrase', 'question', 'sentence'] as const;
export type EntryType = (typeof TYPES)[number];

export const PRIORITIES = [1, 2, 3] as const;
export type Priority = (typeof PRIORITIES)[number];

export interface Entry {
	id: string;
	term: string;
	de: string;
	type: EntryType;
	tags: string[];
	/** 1 = learn first, 3 = basics. */
	priority: Priority;
	literal?: string;
	note?: string;
	example?: { term: string; de: string };
}

export interface Deck {
	code: string;
	language: string;
	flag: string;
	/** What `de` holds: "Deutsch" by default, e.g. "Hochdeutsch" for a dialect. */
	target: string;
	/** Sites with more, shown on the deck page. */
	links: { label: string; url: string }[];
	entries: Entry[];
}
