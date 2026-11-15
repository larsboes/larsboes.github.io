<script lang="ts">
	import { resolve } from '$app/paths';
	import { matches } from '#lib/search.ts';

	let { data } = $props();

	const LIMIT = 50;
	let query = $state('');
	const results = $derived(query.trim() ? data.entries.filter((e) => matches(e, query)) : []);
</script>

<svelte:head>
	<title>Wortschatz · Lars Boes</title>
</svelte:head>

<main>
	<h1>Wortschatz</h1>
	<p class="muted">Wörter und Sätze, die ich nach und nach sammle, immer mit Deutsch als Ziel.</p>

	<input type="search" placeholder="In allen Listen suchen…" bind:value={query} aria-label="In allen Listen suchen" />

	{#if query.trim()}
		<p class="count muted">
			{results.length} Treffer{results.length > LIMIT ? `, die ersten ${LIMIT}` : ''}
		</p>
		<ul class="results">
			{#each results.slice(0, LIMIT) as e (e.deck + e.id)}
				<li>
					<a href={resolve('/wortschatz/[lang]', { lang: e.deck })}>
						<span class="flag">{e.flag}</span>
						<span class="term">{e.term}</span>
						<span class="de">{e.de}</span>
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<ul class="decks">
			{#each data.decks as deck (deck.code)}
				<li>
					<a href={resolve('/wortschatz/[lang]', { lang: deck.code })}>
						<span class="flag">{deck.flag}</span>
						<span class="name">{deck.language} → {deck.target}</span>
						<span class="muted">{deck.count}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	input[type='search'] {
		width: 100%;
		margin-top: 1.5rem;
		padding: 0.7rem 0.9rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
	}
	.decks {
		gap: 0.6rem;
	}
	.decks a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		text-decoration: none;
	}
	.decks a:hover {
		border-color: var(--accent);
	}
	.flag {
		font-size: 1.5rem;
	}
	.name {
		flex: 1;
		font-family: var(--serif);
		font-size: 1.2rem;
	}
	.count {
		font-size: 0.85rem;
		margin: 0.75rem 0 0;
	}
	.results {
		border-top: 1px solid var(--line);
	}
	.results a {
		display: grid;
		grid-template-columns: 2rem 1fr;
		column-gap: 0.5rem;
		padding: 0.7rem 0.25rem;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
	}
	.results a:hover .term {
		color: var(--accent);
	}
	.results .flag {
		grid-row: span 2;
		font-size: 1.2rem;
	}
	.results .term {
		font-family: var(--serif);
		font-weight: 600;
	}
	.results .de {
		color: var(--muted);
		font-size: 0.92rem;
	}
</style>
