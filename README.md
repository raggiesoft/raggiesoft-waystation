# The Uncharted Waystation (`https://waystation.raggiesoft.com`)

1980s Fantasy-Adventure RaggieSoft Universe Wayfinder & Default Unconfigured-Subdomain HTTP `404` Catch-All, hosted by barefoot modern-day siblings **Nolan & Gwen Lennox**.

## Tech Stack (`Mithril.js` + `TypeScript` Hyperscript Static SSG)

- **Pure Functional Hyperscript (`m()`)**: Every component in `src/components/WaystationApp.ts` is authored in TypeScript using Mithril's `m()` Virtual-DOM hyperscript functions (`< 10 KB` gzipped runtime, zero JSX).
- **Static Server-Side Pre-Rendering (`mithril-node-render`)**: `scripts/prerender.ts` renders every canonical route (`/`, `/guides`, `/realms`) AND `/404.html` into static HTML at build time, then mounts live Mithril interactivity (`m.mount`) on the client.
- **Dual Nginx Role**: Serves `200 OK` at `https://waystation.raggiesoft.com`, and acts as Nginx's `default_server` returning genuine `HTTP 404 Not Found` (`X-Robots-Tag: noindex, follow`) with smart destination suggestions for any mistyped `*.raggiesoft.com` subdomain!
