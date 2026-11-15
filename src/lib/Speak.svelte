<script lang="ts">
	import { onMount } from 'svelte';

	let { text, lang }: { text: string; lang: string } = $props();
	let supported = $state(false);

	onMount(() => {
		supported = 'speechSynthesis' in window;
	});

	/** Drops grammar hints like "(+ Inf.)" or "[alguien]" before speaking. */
	const spoken = (t: string) => t.replace(/\([^)]*\)|\[[^\]]*\]/g, ' ').replace(/…/g, '');

	function speak(e: MouseEvent) {
		e.stopPropagation();
		const u = new SpeechSynthesisUtterance(spoken(text));
		u.lang = lang;
		const voices = speechSynthesis.getVoices();
		u.voice =
			voices.find((v) => v.lang === lang) ??
			voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ??
			null;
		u.rate = 0.9;
		speechSynthesis.cancel();
		speechSynthesis.speak(u);
	}
</script>

{#if supported}
	<button class="speak" onclick={speak} aria-label="Vorlesen" title="Vorlesen">
		<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M11 5 6 9H2v6h4l5 4V5z" />
			<path d="M15.5 8.5a5 5 0 0 1 0 7" />
			<path d="M19 5a10 10 0 0 1 0 14" />
		</svg>
	</button>
{/if}

<style>
	.speak {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.25rem;
		border: none;
		background: none;
		color: var(--muted);
		font-size: 1rem;
		border-radius: 6px;
		vertical-align: middle;
	}
	.speak:hover {
		color: var(--accent);
	}
</style>
