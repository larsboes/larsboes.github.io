import { loadDecks } from '#lib/decks.ts';

export const load = () => ({
	decks: loadDecks().map(({ code, language, flag, target, entries }) => ({
		code,
		language,
		flag,
		target,
		count: entries.length
	}))
});
