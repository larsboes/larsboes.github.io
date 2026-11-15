import { loadDecks } from '#lib/decks.ts';

export const load = () => {
	const decks = loadDecks();
	return {
		decks: decks.map(({ code, language, flag, target, entries }) => ({
			code,
			language,
			flag,
			target,
			count: entries.length
		})),
		entries: decks.flatMap((d) => d.entries.map((e) => ({ ...e, deck: d.code, flag: d.flag })))
	};
};
