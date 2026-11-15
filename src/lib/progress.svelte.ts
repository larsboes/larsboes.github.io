/**
 * Practice progress, kept in this browser only (localStorage).
 * Each entry sits in a Leitner box 0–5: "Gewusst" moves it up one, "Nochmal" back to 0.
 */
export const MAX_BOX = 5;

export class Progress {
	boxes = $state<Record<string, number>>({});
	#key: string;

	constructor(deck: string) {
		this.#key = `wortschatz:${deck}`;
		if (typeof localStorage === 'undefined') return;
		try {
			this.boxes = JSON.parse(localStorage.getItem(this.#key) ?? '{}');
		} catch {
			this.boxes = {};
		}
	}

	box(id: string): number {
		return this.boxes[id] ?? 0;
	}

	grade(id: string, known: boolean) {
		this.boxes[id] = known ? Math.min(this.box(id) + 1, MAX_BOX) : 0;
		this.#save();
	}

	reset() {
		this.boxes = {};
		this.#save();
	}

	#save() {
		localStorage.setItem(this.#key, JSON.stringify(this.boxes));
	}
}
