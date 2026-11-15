<script lang="ts">
	import { untrack } from 'svelte';
	import type { Entry } from './wortschatz.ts';
	import { MAX_BOX, type Progress } from './progress.svelte.ts';

	let {
		entries,
		progress,
		language,
		target
	}: { entries: Entry[]; progress: Progress; language: string; target: string } = $props();

	let reverse = $state(false);
	let revealed = $state(false);
	let current = $state<Entry | undefined>();
	let last: string | undefined;

	/**
	 * Lower score comes first. Each priority step counts as two boxes, so a new priority-2 card
	 * comes up once the priority-1 cards have been known twice.
	 */
	const score = (e: Entry) => progress.box(e.id) + (e.priority - 1) * 2;

	/** Next card: one of the lowest-scoring entries, never the same card twice in a row. */
	function next() {
		revealed = false;
		const pool = entries.length > 1 ? entries.filter((e) => e.id !== last) : entries;
		if (!pool.length) return (current = undefined);
		const low = Math.min(...pool.map(score));
		const candidates = pool.filter((e) => score(e) === low);
		current = candidates[Math.floor(Math.random() * candidates.length)];
		last = current.id;
	}

	function grade(known: boolean) {
		if (!current) return;
		progress.grade(current.id, known);
		next();
	}

	// New card when the filter changes; grading must not retrigger this.
	$effect(() => {
		void entries;
		untrack(next);
	});

	function onkey(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement) return;
		if (e.key === ' ' && !revealed) {
			e.preventDefault();
			revealed = true;
		} else if (revealed && e.key === '1') grade(false);
		else if (revealed && e.key === '2') grade(true);
	}

	const solid = $derived(entries.filter((e) => progress.box(e.id) >= 3).length);
	const seen = $derived(entries.filter((e) => progress.box(e.id) > 0).length);
</script>

<svelte:window onkeydown={onkey} />

<div class="bar">
	<button class="link" onclick={() => ((reverse = !reverse), (revealed = false))}>
		{reverse ? `${target} → ${language}` : `${language} → ${target}`} ⇄
	</button>
	<span class="muted">{solid} sitzen · {seen - solid} in Arbeit · {entries.length - seen} neu</span>
</div>

{#if current}
	<div class="card">
		<div class="front">{reverse ? current.de : current.term}</div>
		{#if revealed}
			<div class="back">{reverse ? current.term : current.de}</div>
			{#if current.literal}<div class="muted">wörtlich: {current.literal}</div>{/if}
			{#if current.note}<div class="muted note">{current.note}</div>{/if}
		{/if}
		<div class="boxes" aria-label="Fortschritt {progress.box(current.id)} von {MAX_BOX}">
			{#each { length: MAX_BOX }, i (i)}
				<span class:on={i < progress.box(current.id)}></span>
			{/each}
		</div>
	</div>

	<div class="actions">
		{#if revealed}
			<button class="again" onclick={() => grade(false)}>Nochmal <kbd>1</kbd></button>
			<button class="known" onclick={() => grade(true)}>Gewusst <kbd>2</kbd></button>
		{:else}
			<button class="reveal" onclick={() => (revealed = true)}>Aufdecken <kbd>Leertaste</kbd></button>
		{/if}
	</div>
{:else}
	<p class="muted">Keine Einträge für diesen Filter.</p>
{/if}

<p class="foot muted">
	Der Fortschritt bleibt nur in diesem Browser.
	<button class="link" onclick={() => confirm('Fortschritt löschen?') && progress.reset()}>Zurücksetzen</button>
</p>

<style>
	.bar {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.9rem;
	}
	.card {
		margin-top: 1rem;
		min-height: 15rem;
		padding: 2rem 1.5rem 1.25rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.6rem;
		text-align: center;
	}
	.front {
		font-family: var(--serif);
		font-size: 1.9rem;
		line-height: 1.2;
	}
	.back {
		font-size: 1.25rem;
		color: var(--accent);
	}
	.note {
		font-size: 0.9rem;
		max-width: 30rem;
	}
	.boxes {
		display: flex;
		gap: 4px;
		margin-top: auto;
		padding-top: 1rem;
	}
	.boxes span {
		width: 18px;
		height: 4px;
		border-radius: 2px;
		background: var(--line);
	}
	.boxes span.on {
		background: var(--good);
	}
	.actions {
		display: flex;
		gap: 0.6rem;
		margin-top: 0.75rem;
	}
	.actions button {
		flex: 1;
		padding: 0.85rem;
		border-radius: var(--radius);
		border: 1px solid var(--line);
		background: var(--surface);
		font-weight: 500;
	}
	.actions .known {
		border-color: var(--good);
		color: var(--good);
	}
	.actions .reveal {
		background: var(--ink);
		color: var(--bg);
		border-color: var(--ink);
	}
	kbd {
		font: 0.75rem var(--sans);
		opacity: 0.55;
		margin-left: 0.35rem;
	}
	.link {
		background: none;
		border: none;
		padding: 0;
		text-decoration: underline;
		text-decoration-color: var(--line);
		text-underline-offset: 3px;
	}
	.foot {
		margin-top: 2rem;
		font-size: 0.85rem;
	}
	@media (hover: none) {
		kbd {
			display: none;
		}
	}
</style>
