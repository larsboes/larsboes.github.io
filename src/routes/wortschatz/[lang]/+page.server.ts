import { error } from '@sveltejs/kit';
import { loadDecks } from '#lib/decks.ts';

export const entries = () => loadDecks().map(({ code }) => ({ lang: code }));

export const load = ({ params }) => {
	const deck = loadDecks().find((d) => d.code === params.lang);
	if (!deck) error(404, 'Diese Sprache gibt es hier (noch) nicht.');
	return { deck };
};
