<script lang="ts">
	import { resolve } from '$app/paths';
	import { links } from '#lib/links.ts';
	import GitHub from '#lib/icons/GitHub.svelte';

	const shown = links.filter((l) => l.href);
	const href = (h: string) => (h.startsWith('/') ? resolve(h as '/') : h);
</script>

<svelte:head>
	<title>Lars Boes</title>
</svelte:head>

<main>
	<h1>Lars Boes</h1>
	<ul>
		{#each shown as link (link.label)}
			<li>
				<a href={href(link.href!)}>
					<span class="label">{#if link.icon === 'github'}<GitHub />{/if}{link.label}</span>
					{#if link.note}<small class="muted">{link.note}</small>{/if}
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
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.9rem 1.1rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		text-decoration: none;
		transition: border-color 0.15s;
	}
	.label {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}
	a:hover {
		border-color: var(--accent);
	}
</style>
