import { parseDeck } from './parse.ts';
import type { Deck } from './wortschatz.ts';

const files = import.meta.glob('/content/wortschatz/*.yaml', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

export function loadDecks(): Deck[] {
	return Object.entries(files)
		.map(([path, text]) => parseDeck(path.split('/').pop()!.replace(/\.yaml$/, ''), text))
		.sort((a, b) => a.language.localeCompare(b.language));
}
