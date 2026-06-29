# ??????????

HyperFrames ????????

`token -> attention -> context-window -> context-compression -> context-pollution -> hallucination -> eval`

## Preview

```bash
npx --yes hyperframes lint materials/hyperframes/long-context-quality
npx --yes hyperframes validate materials/hyperframes/long-context-quality
npx --yes hyperframes inspect materials/hyperframes/long-context-quality --samples 15
npx --yes hyperframes preview materials/hyperframes/long-context-quality --port 3018
```

Studio URL:

```text
http://localhost:3018/#project/long-context-quality
```

## Notes

- This is an external HyperFrames experiment and is not imported by the app.
- No narration or audio is included.
- MP4 rendering needs FFmpeg available on PATH.
