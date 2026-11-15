<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import GitHub from '#lib/icons/GitHub.svelte';
	import { GITHUB_PROFILE } from '#lib/site.ts';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<a class="home" href={resolve('/')}>Lars Boes</a>
	<nav>
		<a href={resolve('/wortschatz')} aria-current={page.url.pathname.includes('/wortschatz') ? 'page' : undefined}>Wortschatz</a>
		<a class="icon" href={GITHUB_PROFILE} aria-label="GitHub" title="GitHub"><GitHub /></a>
	</nav>
</header>

{@render children()}

<style>
	header {
		max-width: 46rem;
		margin: 0 auto;
		padding: 1.25rem 1.25rem 0;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}
	.home {
		font-family: var(--serif);
		font-weight: 600;
		text-decoration: none;
	}
	nav {
		display: flex;
		gap: 1.1rem;
		align-items: center;
	}
	nav a {
		color: var(--muted);
		text-decoration: none;
	}
	nav .icon {
		display: flex;
		font-size: 1.15rem;
	}
	nav a:hover,
	nav a[aria-current='page'] {
		color: var(--ink);
	}
</style>
