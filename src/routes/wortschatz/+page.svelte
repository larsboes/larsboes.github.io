<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Wortschatz · Lars Boes</title>
</svelte:head>

<main>
	<h1>Wortschatz</h1>
	<p class="muted">Wörter und Sätze, die ich gerade lerne — immer mit Deutsch als Ziel.</p>
	<ul>
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
</main>

<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
		display: grid;
		gap: 0.6rem;
	}
	a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.1rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		text-decoration: none;
	}
	a:hover {
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
</style>
