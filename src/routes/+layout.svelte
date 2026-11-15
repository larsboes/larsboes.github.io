<script lang="ts">
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
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
	nav a {
		color: var(--muted);
		text-decoration: none;
	}
	nav a[aria-current='page'] {
		color: var(--ink);
	}
</style>
