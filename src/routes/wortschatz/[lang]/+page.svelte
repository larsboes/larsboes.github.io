<script lang="ts">
	import { resolve } from '$app/paths';
	import { PRIORITIES, TYPES, type Entry } from '#lib/wortschatz.ts';
	import { Progress, MAX_BOX } from '#lib/progress.svelte.ts';
	import Practice from '#lib/Practice.svelte';
	import GitHub from '#lib/icons/GitHub.svelte';
	import Speak from '#lib/Speak.svelte';
	import { matches } from '#lib/search.ts';
	import { REPO } from '#lib/site.ts';

	let { data } = $props();
	const deck = $derived(data.deck);

	const TYPE_LABEL: Record<string, string> = {
		word: 'Wort',
		phrase: 'Ausdruck',
		question: 'Frage',
		sentence: 'Satz'
	};

	const PRIORITY_LABEL: Record<number, string> = { 1: 'Top', 2: 'Umgangssprache', 3: 'Basis' };

	let query = $state('');
	let priority = $state<number | null>(null);
	let type = $state<string | null>(null);
	let tags = $state<string[]>([]);
	let mode = $state<'list' | 'practice'>('list');
	let progress = $state<Progress | undefined>();

	$effect(() => {
		progress = new Progress(deck.code);
	});

	const allTags = $derived([...new Set(deck.entries.flatMap((e) => e.tags))].sort());
	const usedTypes = $derived(TYPES.filter((t) => deck.entries.some((e) => e.type === t)));

	const filtered = $derived.by(() => {
		return deck.entries.filter(
			(e) =>
				(!priority || e.priority === priority) &&
				(!type || e.type === type) &&
				(!tags.length || e.tags.some((t) => tags.includes(t))) &&
				matches(e, query)
		);
	});

	const toggleTag = (t: string) =>
		(tags = tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]);
</script>

<svelte:head>
	<title>{deck.language} → {deck.target} · Wortschatz</title>
</svelte:head>

<main>
	<a class="back muted" href={resolve('/wortschatz')}>← Wortschatz</a>
	<h1>{deck.flag} {deck.language} <span class="muted">→ {deck.target}</span></h1>
	{#if deck.links.length}
		<p class="sources muted">
			Mehr:
			{#each deck.links as l, i (l.url)}{#if i}, {/if}<a href={l.url} rel="noopener">{l.label}</a>{/each}
		</p>
	{/if}

	<div class="mode" role="tablist">
		<button role="tab" aria-selected={mode === 'list'} onclick={() => (mode = 'list')}>Liste</button>
		<button role="tab" aria-selected={mode === 'practice'} onclick={() => (mode = 'practice')}>Üben</button>
	</div>

	<div class="filters">
		<input type="search" placeholder="Suchen…" bind:value={query} aria-label="Suchen" />
		<div class="chips">
			{#each PRIORITIES as p (p)}
				<button class="chip" aria-pressed={priority === p} onclick={() => (priority = priority === p ? null : p)}>
					{PRIORITY_LABEL[p]}
				</button>
			{/each}
			<span class="sep"></span>
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
		<Practice entries={filtered} {progress} language={deck.language} target={deck.target} speech={deck.speech} />
	{:else}
		<p class="count muted">{filtered.length} von {deck.entries.length}</p>
		<ul class="entries">
			{#each filtered as e (e.id)}
				<li>
					<div class="head">
						<span class="term">{e.term}{#if deck.speech}<Speak text={e.term} lang={deck.speech} />{/if}</span>
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
						{PRIORITY_LABEL[e.priority]} · {TYPE_LABEL[e.type]} · {e.tags.map((t) => `#${t}`).join(' ')}
					</div>
				</li>
			{/each}
		</ul>
	{/if}

	<p class="edit muted">
		<a href="{REPO}/edit/main/content/wortschatz/{deck.code}.yaml"><GitHub /> Fehler gefunden oder Ergänzung? Auf GitHub bearbeiten</a>
	</p>
</main>

<style>
	.back {
		font-size: 0.9rem;
		text-decoration: none;
	}
	h1 {
		margin-top: 0.75rem;
	}
	.sources {
		margin: 0;
		font-size: 0.9rem;
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
	.edit {
		margin-top: 2.5rem;
		font-size: 0.85rem;
	}
	.edit a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}
	.meta {
		font-size: 0.78rem;
		margin-top: 0.2rem;
	}
</style>
