# ????????????????

HyperFrames ????????

`token -> prefill -> ttft -> kv-cache -> decode -> tpot -> batch-scheduling -> pd-separation`

## Preview

```bash
npx --yes hyperframes lint materials/hyperframes/latency-prefill-decode
npx --yes hyperframes validate materials/hyperframes/latency-prefill-decode
npx --yes hyperframes inspect materials/hyperframes/latency-prefill-decode --samples 15
npx --yes hyperframes preview materials/hyperframes/latency-prefill-decode --port 3017
```

Studio URL:

```text
http://localhost:3017/#project/latency-prefill-decode
```

## Notes

- This is an external HyperFrames experiment and is not imported by the app.
- No narration or audio is included.
- MP4 rendering needs FFmpeg available on PATH.
