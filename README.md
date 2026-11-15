# larsboes.github.io

Personal site, served at <https://larsboes.github.io>. SvelteKit with `adapter-static`, built with Bun, deployed by GitHub Actions on every push to `main`.

## Wortschatz

Phrases and words I am learning, always with German as the target language. Each language is one file in [`content/wortschatz/`](content/wortschatz/), e.g. [`es.yaml`](content/wortschatz/es.yaml). The field list is at the top of each file.

- **Add or fix an entry:** edit the YAML file and open a pull request. Corrections from native speakers are very welcome.
- **Add a language:** copy `es.yaml` to `<code>.yaml` (`it.yaml`, `fr.yaml` …), set `language` and `flag`, and replace the entries. The site picks it up automatically.
- **Validate:** `bun run check:data`. The build also fails on an invalid entry, so CI catches it on the pull request.

Practice progress (the "Üben" mode) stays in your browser's local storage. It is not part of the repository.

## Develop

```sh
bun install
bun run dev          # http://localhost:5173
bun run check        # types
bun run build        # static site in build/
```

Links on the home page are in [`src/lib/links.ts`](src/lib/links.ts).
