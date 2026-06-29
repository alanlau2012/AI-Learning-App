# ?????????? MaaS

HyperFrames ????????

`maas -> model-gateway -> multi-model-routing -> cost-routing -> capability-routing -> rate-limit-circuit-break -> sla -> observability`

## Preview

```bash
npx --yes hyperframes lint materials/hyperframes/maas-control-plane
npx --yes hyperframes validate materials/hyperframes/maas-control-plane
npx --yes hyperframes inspect materials/hyperframes/maas-control-plane --samples 15
npx --yes hyperframes preview materials/hyperframes/maas-control-plane --port 3019
```

Studio URL:

```text
http://localhost:3019/#project/maas-control-plane
```

## Notes

- This is an external HyperFrames experiment and is not imported by the app.
- No narration or audio is included.
- MP4 rendering needs FFmpeg available on PATH.
