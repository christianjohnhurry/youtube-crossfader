# youtube-crossfader

A DJ-style crossfader for YouTube: load two videos and fade the audio
between them with a single slider.

> **Desktop browsers only.** iOS ignores the YouTube player's `setVolume`,
> so the crossfade has no audible effect there.

## Running

Requires [pixi](https://pixi.sh).

```sh
pixi run serve   # static server on http://0.0.0.0:8000
pixi run test    # node --test (no npm dependencies)
```

The server binds to `0.0.0.0` so it is reachable from a dev-space.

## Release convention

- Every PR adds an entry under `## [Unreleased]` in `CHANGELOG.md`.
- To release: bump `VERSION` by hand, move the Unreleased entries under a new
  `## [X.Y.Z]` heading, and tag `vX.Y.Z`.

## License

[MIT](LICENSE)
