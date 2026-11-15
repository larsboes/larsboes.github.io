// Validates every deck in content/wortschatz/ with the same parser the site uses.
import { Glob } from 'bun';
import { parseDeck } from '../src/lib/parse.ts';

let failed = false;
for await (const path of new Glob('content/wortschatz/*.yaml').scan('.')) {
	const code = path.split('/').pop()!.replace(/\.yaml$/, '');
	try {
		const deck = parseDeck(code, await Bun.file(path).text());
		console.log(`ok  ${path}: ${deck.entries.length} ${deck.entries.length === 1 ? "entry" : "entries"}`);
	} catch (e) {
		failed = true;
		console.error(`bad ${path}\n${(e as Error).message}`);
	}
}
process.exit(failed ? 1 : 0);
