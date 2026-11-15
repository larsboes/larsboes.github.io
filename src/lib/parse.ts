import { parse } from 'yaml';
import { TYPES, type Deck, type Entry, type EntryType } from './wortschatz.ts';

/** Stable id from the term, so practice progress survives reordering the file. */
export function entryId(term: string): string {
	return term
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-|-$/g, '');
}

const str = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/** Parses one deck file. Throws with every problem listed, so a bad edit fails the build. */
export function parseDeck(code: string, text: string): Deck {
	const raw = parse(text) as Record<string, unknown> | null;
	const errors: string[] = [];
	const at = (i: number, msg: string) => errors.push(`${code}.yaml entry ${i + 1}: ${msg}`);

	if (!raw || typeof raw !== 'object') throw new Error(`${code}.yaml: empty or not a mapping`);
	if (!str(raw.language)) errors.push(`${code}.yaml: missing "language"`);
	if (!Array.isArray(raw.entries)) throw new Error(`${code}.yaml: "entries" must be a list`);

	const seen = new Map<string, number>();
	const entries: Entry[] = [];

	raw.entries.forEach((e: Record<string, unknown>, i: number) => {
		if (!e || typeof e !== 'object') return at(i, 'not a mapping');
		if (!str(e.term)) at(i, 'missing "term"');
		if (!str(e.de)) at(i, `missing "de" (${e.term ?? '?'})`);
		if (!TYPES.includes(e.type as EntryType))
			at(i, `"type" must be one of ${TYPES.join(', ')} (${e.term ?? '?'})`);
		if (!Array.isArray(e.tags) || e.tags.length === 0 || !e.tags.every(str))
			at(i, `"tags" must be a non-empty list (${e.term ?? '?'})`);
		for (const k of ['literal', 'note'] as const)
			if (e[k] !== undefined && !str(e[k])) at(i, `"${k}" must be text`);
		const ex = e.example as Record<string, unknown> | undefined;
		if (ex !== undefined && !(str(ex?.term) && str(ex?.de)))
			at(i, '"example" needs "term" and "de"');
		const known = ['term', 'de', 'type', 'tags', 'literal', 'note', 'example'];
		for (const k of Object.keys(e)) if (!known.includes(k)) at(i, `unknown field "${k}"`);

		if (!str(e.term)) return;
		const id = entryId(e.term);
		if (seen.has(id)) at(i, `duplicate of entry ${seen.get(id)! + 1} (${e.term})`);
		seen.set(id, i);
		entries.push({ ...(e as unknown as Omit<Entry, 'id'>), id });
	});

	if (errors.length) throw new Error(errors.join('\n'));
	return {
		code,
		language: raw.language as string,
		flag: str(raw.flag) ? raw.flag : '',
		entries
	};
}
