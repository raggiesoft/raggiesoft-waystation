/**
 * @license MIT
 * ============================================================================
 * src/entry-client.ts — Client-Side Mithril.js Mount Entrypoint (`< 10 KB`)
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW:
 *   Reads `data-waystation-path` and `data-waystation-404` stamped onto `#app`
 *   during static pre-rendering, then calls `m.mount(root, component)` so the
 *   pre-rendered HTML becomes live and interactive—activating Gwen's Astrolabe
 *   search filter, radio pills, and smart 404 rift hostname detection!
 * ============================================================================
 */

import m from 'mithril';
import { createWaystationApp } from './components/WaystationApp.js';

const root = document.getElementById('app');
if (root) {
  const initialPath = root.getAttribute('data-waystation-path') || '/';
  const force404Mode = root.getAttribute('data-waystation-404') === 'true';
  m.mount(root, createWaystationApp({ initialPath, force404Mode }));

  // Keep open Waystation tabs synchronized when toggling Twin Moons / Sunlit Stone
  window.addEventListener('storage', (ev: StorageEvent) => {
    if (ev.key === 'color-scheme') {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
      if (meta) {
        meta.content = ev.newValue === 'light' || ev.newValue === 'dark' ? ev.newValue : 'light dark';
      }
    }
  });
}
