## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Text clipping

Italic serif and large display type draw past their box. Never wrap text in a bare `overflow-hidden`:
- reveal masks: use the `text-mask` utility (`src/styles/global.css`)
- sideways scrollers/marquees: use `overflow-x-clip`, which hides horizontally but keeps ascenders/descenders
- gradient text (`bg-clip-text`) already gets padding from a global rule in `global.css`

In dev, `src/scripts/clip-guard.ts` measures real glyph ink and logs `[clip-guard]` console warnings for any text cut by its clipping box (rerun with `__clipGuard()`).
