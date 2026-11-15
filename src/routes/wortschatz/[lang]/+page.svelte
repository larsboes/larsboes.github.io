<script lang="ts">
	import { resolve } from '$app/paths';
	import { TYPES, type Entry } from '#lib/wortschatz.ts';
	import { Progress, MAX_BOX } from '#lib/progress.svelte.ts';
	import Practice from '#lib/Practice.svelte';

	let { data } = $props();
	const deck = $derived(data.deck);

	const TYPE_LABEL: Record<string, string> = {
		word: 'Wort',
		phrase: 'Ausdruck',
		question: 'Frage',
		sentence: 'Satz'
	};

	let query = $state('');
	let type = $state<string | null>(null);
	let tags = $state<string[]>([]);
	let mode = $state<'list' | 'practice'>('list');
	let progress = $state<Progress | undefined>();

	$effect(() => {
		progress = new Progress(deck.code);
	});

	const allTags = $derived([...new Set(deck.entries.flatMap((e) => e.tags))].sort());
	const usedTypes = $derived(TYPES.filter((t) => deck.entries.some((e) => e.type === t)));

	const fold = (s: string) =>
		s
			.normalize('NFD')
			.replace(/\p{M}/gu, '')
			.toLowerCase();
	const haystack = (e: Entry) =>
		fold([e.term, e.de, e.literal, e.note, e.example?.term, e.example?.de].join(' '));

	const filtered = $derived.by(() => {
		const q = fold(query.trim());
		return deck.entries.filter(
			(e) =>
				(!type || e.type === type) &&
				(!tags.length || e.tags.some((t) => tags.includes(t))) &&
				(!q || haystack(e).includes(q))
		);
	});

	const toggleTag = (t: string) =>
		(tags = tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]);
</script>

<svelte:head>
	<title>{deck.language} → Deutsch · Wortschatz</title>
</svelte:head>

<main>
	<a class="back muted" href={resolve('/wortschatz')}>← Wortschatz</a>
	<h1>{deck.flag} {deck.language} <span class="muted">→ Deutsch</span></h1>

	<div class="mode" role="tablist">
		<button role="tab" aria-selected={mode === 'list'} onclick={() => (mode = 'list')}>Liste</button>
		<button role="tab" aria-selected={mode === 'practice'} onclick={() => (mode = 'practice')}>Üben</button>
	</div>

	<div class="filters">
		<input type="search" placeholder="Suchen…" bind:value={query} aria-label="Suchen" />
		<div class="chips">
			{#each usedTypes as t (t)}
				<button class="chip" aria-pressed={type === t} onclick={() => (type = type === t ? null : t)}>
					{TYPE_LABEL[t]}
				</button>
			{/each}
			<span class="sep"></span>
			{#each allTags as t (t)}
				<button class="chip" aria-pressed={tags.includes(t)} onclick={() => toggleTag(t)}>#{t}</button>
			{/each}
		</div>
	</div>

	{#if mode === 'practice' && progress}
		<Practice entries={filtered} {progress} language={deck.language} />
	{:else}
		<p class="count muted">{filtered.length} von {deck.entries.length}</p>
		<ul class="entries">
			{#each filtered as e (e.id)}
				<li>
					<div class="head">
						<span class="term">{e.term}</span>
						{#if progress && progress.box(e.id) > 0}
							<span class="level" title="Fortschritt {progress.box(e.id)} von {MAX_BOX}">
								{'●'.repeat(progress.box(e.id))}{'○'.repeat(MAX_BOX - progress.box(e.id))}
							</span>
						{/if}
					</div>
					<div class="de">{e.de}</div>
					{#if e.literal}<div class="literal muted">wörtlich: {e.literal}</div>{/if}
					{#if e.note}<div class="note">{e.note}</div>{/if}
					{#if e.example}
						<div class="example"><i>{e.example.term}</i> — {e.example.de}</div>
					{/if}
					<div class="meta muted">
						{TYPE_LABEL[e.type]} · {e.tags.map((t) => `#${t}`).join(' ')}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.back {
		font-size: 0.9rem;
		text-decoration: none;
	}
	h1 {
		margin-top: 0.75rem;
	}
	h1 .muted {
		font-weight: 400;
	}
	.mode {
		display: inline-flex;
		margin: 1.25rem 0 1rem;
		padding: 3px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 999px;
	}
	.mode button {
		border: none;
		background: none;
		padding: 0.35rem 1rem;
		border-radius: 999px;
		color: var(--muted);
	}
	.mode button[aria-selected='true'] {
		background: var(--ink);
		color: var(--bg);
	}
	.filters {
		display: grid;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}
	input[type='search'] {
		width: 100%;
		padding: 0.7rem 0.9rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
	}
	.chip {
		padding: 0.2rem 0.7rem;
		font-size: 0.85rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: none;
		color: var(--muted);
	}
	.chip[aria-pressed='true'] {
		background: var(--accent-soft);
		border-color: var(--accent);
		color: var(--accent);
	}
	.sep {
		width: 1px;
		height: 1.2rem;
		background: var(--line);
		margin: 0 0.2rem;
	}
	.count {
		font-size: 0.85rem;
		margin: 0 0 0.5rem;
	}
	.entries {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 1px solid var(--line);
	}
	.entries li {
		padding: 1rem 0.25rem;
		border-bottom: 1px solid var(--line);
		display: grid;
		gap: 0.2rem;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: baseline;
	}
	.term {
		font-family: var(--serif);
		font-size: 1.3rem;
		font-weight: 600;
	}
	.level {
		color: var(--good);
		font-size: 0.65rem;
		letter-spacing: 2px;
		white-space: nowrap;
	}
	.de {
		color: var(--accent);
	}
	.literal,
	.note,
	.example {
		font-size: 0.92rem;
	}
	.literal {
		font-style: italic;
	}
	.meta {
		font-size: 0.78rem;
		margin-top: 0.2rem;
	}
</style>
