import { loadDecks } from '#lib/decks.ts';

export const load = () => ({
	decks: loadDecks().map(({ code, language, flag, entries }) => ({
		code,
		language,
		flag,
		count: entries.length
	}))
});
