/**
 * @license MIT
 * ============================================================================
 * src/components/WaystationApp.ts — Mithril.js Hyperscript Application (`m()`)
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL INTRO TO MITHRIL.JS & HYPERSCRIPT):
 *   What is Mithril.js, and why are there zero `<div ...>` angle brackets here?
 *     In React, SolidJS, or Lit, you write HTML-like templates (`JSX` or `html`
 *     tagged strings) that a compiler translates into JavaScript function calls.
 *     **Mithril.js** skips template syntax altogether and gives you `m()`
 *     ("**Hyperscript**"—short for "Hypertext JavaScript") directly!
 *
 *     Every `m(selector, attributes, children)` call builds a lightweight
 *     Virtual-DOM node ("Vnode"):
 *       - `m('section.ws-hero', { 'aria-labelledby': 'hero-title' }, [...])`
 *         creates `<section class="ws-hero" aria-labelledby="hero-title">...</section>`.
 *       - When a user types in our `<search>` box or picks a realm category radio
 *         button, Mithril automatically re-evaluates `view()` and patches ONLY
 *         the changed DOM nodes in under a millisecond—all in `< 10 KB` of JS!
 *
 *   Four Canonical Routes + Dual-Mode 404 Safety Net:
 *     - `/`: Courtyard Astrolabe, Three-Keeper Spotlight, 16-Portal Directory,
 *       and Keepers' Hall Sanctuary overview.
 *     - `/guides`: Full character dossiers for **Nolan Lennox**, **Gwen Lennox**,
 *       and **Mallory Walsh**, Keepers' Hall & Cloudbrook Hollow tour, and the
 *       complete Tidewater Earth & Vaeloria supporting cast (including **Tammy**,
 *       **Grandpa Walter**, **Denise Carter**, and Vaeloria's route keepers).
 *     - `/story`: Six-act illustrated walkthrough from Norfolk's bus terminal
 *       and Studio 205 across the 9:15 PM amber rift into Vaeloria.
 *     - `/realms`: Dedicated 16-portal Global RaggieSoft Directory.
 *     - `/404.html` (and any unconfigured `*.raggiesoft.com` typo subdomain):
 *       `detectUnchartedRift()` activates the **404 Rift Banner** and suggests
 *       the closest matching RaggieSoft archway right on top!
 * ============================================================================
 */

import m from 'mithril';
import {
  CDN_BASE,
  REALM_CATEGORIES,
  SUPPORTING_CAST,
  TWO_WORLD_CHRONICLES,
  UNIVERSE_REALMS,
  WAYSTATION_KEEPERS,
  WAYSTATION_ROUTES,
  type RealmCategory,
  type SupportingCharacter,
  type UniverseRealm
} from '../data/realms.js';

export interface AppConfig {
  initialPath: string;
  force404Mode?: boolean;
}

interface RiftDetection {
  isRift404: boolean;
  attemptedAddress: string;
  suggestedRealm: UniverseRealm | null;
}

/**
 * Checks whether a normalized pathname matches one of our pre-rendered routes
 * (`/`, `/guides`, `/story`, `/realms`) defined in `WAYSTATION_ROUTES`.
 */
function isCanonicalWaystationPath(pathname: string): boolean {
  return WAYSTATION_ROUTES.some((route) => route.path === pathname);
}

/**
 * Inspects the current browser URL (when running client-side) or `force404Mode`
 * (when pre-rendering `dist/404.html` on Node.js) to see if the traveler arrived
 * via an unconfigured subdomain (`book.raggiesoft.com`) or a missing path (`404`).
 */
function detectUnchartedRift(initialPath: string, force404Mode: boolean): RiftDetection {
  // Node.js Static Site Generation (`typeof window === 'undefined'`)
  if (typeof window === 'undefined') {
    const defaultBooksRealm =
      UNIVERSE_REALMS.find((r) => r.id === 'books') ?? UNIVERSE_REALMS[0] ?? null;
    return {
      isRift404: force404Mode,
      attemptedAddress: 'an unmapped *.raggiesoft.com trail',
      suggestedRealm: defaultBooksRealm
    };
  }

  const host = (window.location.hostname || '').toLowerCase();
  const pathname = window.location.pathname || '/';
  const isCanonicalHost =
    host === 'waystation.raggiesoft.com' || host === 'localhost' || host === '127.0.0.1';
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const isKnownWaystationRoute = isCanonicalWaystationPath(normalizedPath);

  const isRift404 = force404Mode || !isCanonicalHost || !isKnownWaystationRoute;
  const fullAttempt = `${host}${pathname === '/' ? '' : pathname}`;

  // Score each RaggieSoft realm against keywords found in the mistyped hostname/path
  const haystack = `${host} ${pathname} ${initialPath}`.toLowerCase();
  let bestMatch: UniverseRealm | null = null;
  for (const realm of UNIVERSE_REALMS) {
    if (realm.hintKeywords.some((kw) => haystack.includes(kw))) {
      bestMatch = realm;
      break;
    }
  }

  return {
    isRift404,
    attemptedAddress: fullAttempt || 'an uncharted trail',
    suggestedRealm: bestMatch
  };
}

/**
 * Factory closure component (`createWaystationApp`):
 * In Mithril, a closure component is a function returning `{ view() { ... } }`,
 * holding local reactive state (`activePath`, `selectedCategory`, `searchQuery`)
 * cleanly inside a lexical TypeScript closure—zero global mutable variables!
 */
export function createWaystationApp(config: AppConfig): m.Component {
  let activePath = config.initialPath || '/';
  let is404Override = Boolean(config.force404Mode);
  let selectedCategory: RealmCategory = 'all';
  let searchQuery = '';

  // Sync browser Back/Forward buttons when navigating between `/`, `/guides`, `/story`, `/realms`
  if (typeof window !== 'undefined') {
    const startNorm = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    if (isCanonicalWaystationPath(startNorm)) {
      activePath = startNorm;
    }
    window.addEventListener('popstate', () => {
      const p = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
      if (isCanonicalWaystationPath(p)) {
        activePath = p;
        is404Override = false;
        m.redraw();
      }
    });
  }

  /**
   * Intercepts plain left-clicks on internal Waystation navigation links when
   * already on `waystation.raggiesoft.com` so route changes feel instantaneous,
   * updates `<head>` metadata for accessibility/sharing, and scrolls smoothly to top.
   */
  function navigateLocal(e: MouseEvent, targetPath: string): void {
    if (
      typeof window === 'undefined' ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0 ||
      window.location.hostname.toLowerCase() !== 'waystation.raggiesoft.com'
    ) {
      return;
    }
    e.preventDefault();
    activePath = targetPath;
    is404Override = false;
    window.history.pushState({}, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'auto' });

    const matchedRoute = WAYSTATION_ROUTES.find((r) => r.path === targetPath);
    if (matchedRoute) {
      document.title = matchedRoute.seoTitle;
      const canonicalHref = `https://waystation.raggiesoft.com${
        matchedRoute.path === '/' ? '/' : matchedRoute.path
      }`;
      const setMeta = (selector: string, content: string): void => {
        const el = document.querySelector<HTMLMetaElement>(selector);
        if (el) el.content = content;
      };
      setMeta('meta[name="description"]', matchedRoute.seoDescription);
      setMeta('meta[property="og:title"]', matchedRoute.seoTitle);
      setMeta('meta[property="og:description"]', matchedRoute.seoDescription);
      setMeta('meta[property="og:url"]', canonicalHref);
      setMeta('meta[property="og:image"]', matchedRoute.ogImage);
      setMeta('meta[property="og:image:secure_url"]', matchedRoute.ogImage);
      setMeta('meta[property="og:image:alt"]', matchedRoute.ogImageAlt);
      setMeta('meta[name="twitter:title"]', matchedRoute.seoTitle);
      setMeta('meta[name="twitter:description"]', matchedRoute.seoDescription);
      setMeta('meta[name="twitter:image"]', matchedRoute.ogImage);
      setMeta('meta[name="twitter:image:alt"]', matchedRoute.ogImageAlt);
      const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (canonicalEl) canonicalEl.href = canonicalHref;
    }
    const mainEl = document.getElementById('main-content');
    mainEl?.focus();
  }

  /**
   * Toggles between Sunlit Stone (Light) and Twin Moons (Dark) reading modes,
   * automatically clearing any manual override when returning to OS preference.
   */
  function toggleReadingLamp(): void {
    if (typeof window === 'undefined') return;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    if (!meta) return;
    let systemDark = true;
    try {
      systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {}
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('color-scheme');
    } catch {}
    const current: 'light' | 'dark' =
      saved === 'light' || saved === 'dark' ? saved : systemDark ? 'dark' : 'light';
    const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark';
    const systemScheme: 'light' | 'dark' = systemDark ? 'dark' : 'light';

    if (next === systemScheme) {
      try {
        localStorage.removeItem('color-scheme');
      } catch {}
      meta.content = 'light dark';
    } else {
      try {
        localStorage.setItem('color-scheme', next);
      } catch {}
      meta.content = next;
    }
  }

  /**
   * Filters `UNIVERSE_REALMS` by active radio category AND free-text search query.
   */
  function filterRealms(): UniverseRealm[] {
    const q = searchQuery.trim().toLowerCase();
    return UNIVERSE_REALMS.filter((realm) => {
      const catOk = selectedCategory === 'all' || realm.category === selectedCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        realm.name.toLowerCase().includes(q) ||
        realm.archwayTitle.toLowerCase().includes(q) ||
        realm.description.toLowerCase().includes(q) ||
        realm.hostDisplay.toLowerCase().includes(q) ||
        realm.nolanOrGwenTip.toLowerCase().includes(q) ||
        realm.hintKeywords.some((k) => k.includes(q))
      );
    });
  }

  /**
   * Renders the 3-card spotlight for Nolan Lennox, Gwen Lennox, and Mallory Walsh.
   * On `/` (`compact = true`), displays a concise welcoming introduction with buttons
   * into `/guides` and `/story`. On `/guides` (`compact = false`), displays full
   * Astrolabe Ring assignments, mobility/gear notes, and first-person quotes!
   */
  function renderKeepersDossierGrid(baseOrigin: string, compact: boolean): m.Vnode {
    return m(
      'section.ws-section',
      { 'aria-labelledby': compact ? 'home-keepers-heading' : 'full-keepers-heading' },
      [
        m('div.ws-section-head', [
          m('span.ws-eyebrow', [
            m('span', { 'aria-hidden': 'true' }, '🧭'),
            m('span', 'Three Keepers • Three Bronze Astrolabe Rings')
          ]),
          m(
            'h2.ws-section-title',
            { id: compact ? 'home-keepers-heading' : 'full-keepers-heading' },
            compact
              ? 'Meet Nolan, Gwen & Mallory—Your Three Waystation Keepers'
              : 'The Three Keepers Who Harmonized the Bronze Astrolabe'
          ),
          m(
            'p.ws-muted',
            'Originally built for three harmonizers by Vaeloria’s Slow-Footed Order, the Three-Ring Bronze Astrolabe waited centuries for older brother Nolan Lennox, his tall younger sister Gwen, and his devoted girlfriend Mallory Walsh to arrive together from Studio 205.'
          )
        ]),

        m(
          'div.ws-keeper-grid',
          WAYSTATION_KEEPERS.map((keeper) =>
            m('article.ws-arch-card.ws-keeper-card', { key: keeper.id }, [
              m('span.ws-arch-subtitle', keeper.statsBadge),
              m('h3.ws-card-title', keeper.name),
              m('p.ws-keeper-ring', [
                m('strong', 'Astrolabe Role: '),
                keeper.astrolabeRing
              ]),
              !compact
                ? m('p.ws-keeper-gear', [
                    m('strong', 'Everyday Stride & Gear: '),
                    keeper.mobilityAndGear
                  ])
                : null,
              m('p.ws-card-body', keeper.summary),
              m('p.ws-guide-whisper', keeper.voiceQuote)
            ])
          )
        ),

        compact
          ? m('div.ws-btn-row.ws-mt-md', [
              m(
                'a.ws-btn.ws-btn-primary',
                {
                  href: `${baseOrigin}/guides`,
                  onclick: (e: MouseEvent) => navigateLocal(e, '/guides')
                },
                [
                  m('span', { 'aria-hidden': 'true' }, '👥'),
                  m('span', 'Meet Tammy & Full Cast Dossier →')
                ]
              ),
              m(
                'a.ws-btn.ws-btn-secondary',
                {
                  href: `${baseOrigin}/story`,
                  onclick: (e: MouseEvent) => navigateLocal(e, '/story')
                },
                [
                  m('span', { 'aria-hidden': 'true' }, '🗺️'),
                  m('span', 'Explore the 6-Act Two-World Story →')
                ]
              )
            ])
          : null
      ]
    );
  }

  /**
   * Renders the interactive 16-Portal Astrolabe Directory (`<search>` + category radios).
   */
  function renderAstrolabeDirectory(): m.Vnode {
    const filtered = filterRealms();

    return m('section.ws-section', { id: 'astrolabe-directory', 'aria-labelledby': 'astrolabe-heading' }, [
      m('div.ws-section-head', [
        m('span.ws-eyebrow', [
          m('span', { 'aria-hidden': 'true' }, '🔮'),
          m(
            'span',
            `Global RaggieSoft Directory • All ${UNIVERSE_REALMS.length} Portals (+ Waystation = 17 Sites)`
          )
        ]),
        m('h2.ws-section-title', { id: 'astrolabe-heading' }, 'Choose Your Archway Across the RaggieSoft Universe'),
        m('p.ws-muted', [
          'This courtyard serves as both our friendly 404 safety net and the single ',
          m('strong', 'Global Directory'),
          ' for every RaggieSoft site. Filter below or visit ',
          m('a', { href: 'https://jessica.raggiesoft.com/directory' }, 'Jessica’s Study'),
          ' to read the personal story behind why each project was created!'
        ])
      ]),

      // Semantic `<search>` landmark + `<form>` + visible `<label>` + `<fieldset>/<legend>` radios
      m('search.ws-search-box', { 'aria-label': 'Find a RaggieSoft destination' }, [
        m(
          'form.ws-search-form',
          {
            action: 'https://waystation.raggiesoft.com/realms',
            method: 'GET',
            onsubmit: (e: SubmitEvent) => {
              e.preventDefault();
            }
          },
          [
            m('div.ws-field-group', [
              m(
                'label.ws-label',
                { for: 'waystation-q' },
                'Search destinations by title, character, or topic:'
              ),
              m('div.ws-search-row', [
                m('input.ws-search-input', {
                  type: 'search',
                  id: 'waystation-q',
                  name: 'q',
                  value: searchQuery,
                  placeholder: 'Try "Mallory", "Cedar Run", "Listening Room", or "synth"...',
                  autocorrect: 'off',
                  autocapitalize: 'none',
                  spellcheck: 'false',
                  enterkeyhint: 'search',
                  oninput: (e: InputEvent) => {
                    searchQuery = (e.target as HTMLInputElement).value;
                  }
                }),
                searchQuery
                  ? m(
                      'button.ws-btn.ws-btn-secondary',
                      {
                        type: 'button',
                        onclick: () => {
                          searchQuery = '';
                        }
                      },
                      'Clear'
                    )
                  : null
              ])
            ]),

            m('fieldset.ws-fieldset', [
              m('legend.ws-legend', 'Filter archways by realm category:'),
              m(
                'div.ws-radio-row',
                REALM_CATEGORIES.map((cat) => {
                  const inputId = `ws-cat-${cat.id}`;
                  const checked = selectedCategory === cat.id;
                  return m('div.ws-radio-pill', { class: checked ? 'is-checked' : '' }, [
                    m('input.ws-radio-input', {
                      type: 'radio',
                      id: inputId,
                      name: 'category',
                      value: cat.id,
                      checked,
                      onchange: () => {
                        selectedCategory = cat.id;
                      }
                    }),
                    m('label.ws-radio-label', { for: inputId }, [
                      m('span', { 'aria-hidden': 'true' }, cat.runeIcon),
                      m('span', ` ${cat.label}`)
                    ])
                  ]);
                })
              )
            ])
          ]
        ),

        // Polite live status announcing active filter count to screen readers
        m(
          'p.ws-status-line',
          { role: 'status', 'aria-live': 'polite' },
          filtered.length === 1
            ? 'Showing 1 glowing archway.'
            : `Showing ${filtered.length} glowing archways across the courtyard.`
        )
      ]),

      filtered.length === 0
        ? m('div.ws-story-frame', [
            m('h3.ws-card-title', 'Even Gwen & Mallory’s Astrolabe Didn’t Spot That Spell!'),
            m(
              'p.ws-muted',
              `No archway matched that exact search word—reset the filter below to light all ${UNIVERSE_REALMS.length} portals back up.`
            ),
            m(
              'button.ws-btn.ws-btn-primary',
              {
                type: 'button',
                onclick: () => {
                  searchQuery = '';
                  selectedCategory = 'all';
                }
              },
              `Show All ${UNIVERSE_REALMS.length} Archways`
            )
          ])
        : m(
            'div.ws-realm-grid',
            filtered.map((realm) =>
              m('article.ws-arch-card', { key: realm.id }, [
                m('div.ws-arch-top', [
                  m('span.ws-arch-glyph', { 'aria-hidden': 'true' }, realm.glyph),
                  m('span.ws-arch-subtitle', realm.archwayTitle)
                ]),
                m('h3.ws-card-title', realm.name),
                m('p.ws-card-body', realm.description),
                m('p.ws-guide-whisper', realm.nolanOrGwenTip),
                m('div.ws-arch-footer', [
                  m('a.ws-btn.ws-btn-primary.ws-arch-cta', { href: realm.url }, [
                    m('span', `Step Into ${realm.name}`),
                    m('span', { 'aria-hidden': 'true' }, '→')
                  ]),
                  m('span.ws-host-tag', realm.hostDisplay)
                ])
              ])
            )
          )
    ]);
  }

  /**
   * Renders Nolan, Gwen & Mallory's Star-Moss arrival story and Keepers' Hall tour.
   */
  function renderGuidesStorySection(baseOrigin: string, includeWaterwheelTeaScene: boolean): m.Vnode {
    return m('div', [
      m('section.ws-section', { 'aria-labelledby': 'guides-story-heading' }, [
        m('div.ws-story-frame.ws-two-col', [
          m('figure.ws-figure', [
            m('img', {
              src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_sofa_blanket_bench.jpg`,
              alt: 'Under two glowing moons in a 1980s fantasy twilight hollow of silver-blue star-moss, barefoot twenty-four-year-old Nolan Lennox (5-foot-7, navy t-shirt and jeans) sits right in the middle on a mossy fallen cedar log between his taller nineteen-year-old sister Gwen Lennox (6-foot-1, burgundy t-shirt and jeans) and his girlfriend Mallory Walsh (5-foot-5, copper-auburn ponytail with blue pen behind her right ear, thin silver wire-rimmed glasses, forest-green cardigan over cream tee, barefoot) under Grandpa Walter’s green-and-navy plaid wool blanket, with Nolan’s matte-silver and Gwen’s matte-charcoal single-tube Lofstrand forearm crutches leaning cleanly beside them',
              width: 1200,
              height: 675,
              loading: 'lazy'
            }),
            m(
              'figcaption.ws-caption',
              'Cuddled three-across under Grandpa Walter’s plaid blanket beside their ergonomic forearm crutches—Nolan (24, 5\'7") in the middle with sister Gwen (19, 6\'1") and girlfriend Mallory Walsh (24, 5\'5") in Vaeloria.'
            )
          ]),
          m('div', [
            m('span.ws-eyebrow', [
              m('span', { 'aria-hidden': 'true' }, '🏡'),
              m('span', 'From a Tiny One-Room Studio to Three Keepers of Vaeloria')
            ]),
            m(
              'h2.ws-section-title',
              { id: 'guides-story-heading' },
              '“Nobody Handed Us This Sanctuary—All Three of Us Walked Every Gentle Mile Together to Wake It.”'
            ),
            m(
              'p.ws-card-body',
              '“After Grandpa Walter passed away and Gwen and I moved into our eleven-by-eighteen-foot Norfolk studio—where the lobby elevator stayed taped off and one full-sized bed barely fit two of us—my girlfriend Mallory Walsh climbed twenty-two wet stairs on a rainy Friday night just to hang out barefoot with us after forty-seven minutes on speakerphone hold for Gwen’s bent wheelchair fork,” twenty-four-year-old Nolan shares, seated right between his six-foot-one sister and Mallory beside their four forearm crutches. “When the amber stained-glass rift opened beside our bed at 9:15 PM, none of us let go—all three of us tumbled into Vaeloria together with Grandpa’s plaid blanket and our crutches.”'
            ),
            m(
              'p.ws-card-body.ws-mt-sm',
              '“We had zero idea Earth time was paused until Gwen’s orbital math, Mallory’s runic logic, and Nolan’s steady pace woke the Three-Ring Bronze Astrolabe and we stepped back into Studio 205 to see the VCR clock still glowing at 9:15 PM!” nineteen-year-old Gwen beams, resting her cheek on Nolan’s head while Mallory holds his other hand. “We brought Grandpa’s framed photo, our laptops, Mallory’s sneakers, and both wheelchairs back into Keepers’ Hall—where every town, ramp, and wide cedar bed has room for all three of us while Earth waits peacefully whenever we visit!”'
            ),
            m('div.ws-btn-row.ws-mt-md', [
              m('a.ws-btn.ws-btn-primary', { href: 'https://books.raggiesoft.com/waystation' }, [
                m('span', { 'aria-hidden': 'true' }, '📖'),
                m('span', 'Read Our Story Crossroads Novel →')
              ]),
              m(
                'a.ws-btn.ws-btn-secondary',
                {
                  href: `${baseOrigin}/story`,
                  onclick: (e: MouseEvent) => navigateLocal(e, '/story')
                },
                [
                  m('span', { 'aria-hidden': 'true' }, '🗺️'),
                  m('span', '6-Act Story & Crossroads Guide')
                ]
              ),
              m(
                'a.ws-btn.ws-btn-secondary',
                { href: 'https://backstage.raggiesoft.com/books/waystation/the-paused-vcr-clock-and-two-world-time' },
                [
                  m('span', { 'aria-hidden': 'true' }, '🎬'),
                  m('span', 'Backstage: The 9:15 PM Clock')
                ]
              )
            ])
          ])
        ])
      ]),

      // Earned Sanctuary Architecture Section: Keepers' Hall & The Glowing Hearth-Archway
      m('section.ws-section', { 'aria-labelledby': 'sanctuary-home-heading' }, [
        m('div.ws-story-frame', [
          m('div.ws-two-col', [
            m('div', [
              m('span.ws-eyebrow', [
                m('span', { 'aria-hidden': 'true' }, '🏛️'),
                m('span', 'Architectural Tour • Keepers’ Hall & The Glowing Hearth-Archway')
              ]),
              m(
                'h2.ws-section-title',
                { id: 'sanctuary-home-heading' },
                'Built Around the Glowing Archway: Inside Nolan, Gwen & Mallory’s Vaeloria Home'
              ),
              m(
                'p.ws-card-body',
                'Once Nolan, Gwen, and Mallory reach the high peaks on their Crossroads journey and re-harmonize the Three-Ring Bronze Astrolabe, they discover the Slow-Footed Order built Keepers’ Hall—and the valley towns beyond—as a living, step-free world that answers every hardship of their old Norfolk studio:'
              ),
              m('div.ws-realm-grid.ws-mt-md', [
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🚪 The Glowing Hearth-Archway'),
                  m(
                    'p.ws-card-body',
                    'Built directly into the living rock between the Astrolabe courtyard and Keepers’ Hall, a gentle curtain of warm starlight keeps out mountain wind and rain without a single heavy door or step—so nobody ever has to let go of a forearm-crutch grip or wheelchair rim to glide inside.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🛏️ Eight-Foot Twin-Moon Canopy Bed'),
                  m(
                    'p.ws-card-body',
                    'Retiring Studio 205’s cramped fifty-four-inch mattress, a wide transfer-height carved cedar bed beneath a crystal twin-moon skylight easily sleeps all three adults—Nolan right in the middle with sister Gwen on one side and girlfriend Mallory on the other under Grandpa Walter’s plaid blanket.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🍲 Seated Hearth Kitchen & Cloudbrook Lifts'),
                  m(
                    'p.ws-card-body',
                    'Step-free stone-and-copper seated counters take every ounce of strain off wrists and knees, while water-balanced cliff lifts connect Keepers’ Hall straight down to Cloudbrook Hollow’s wheelchair-height artisan markets and tea terraces.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🔭 Moon-Glass Ramps & Thermal Bath'),
                  m(
                    'p.ws-card-body',
                    'Sweeping, stair-free rose-quartz ramps link a spacious ninety-eight-degree mineral soaking bath to the Moon-Glass Observatory, where Gwen’s star-vellum charts, Mallory’s runic slates, and Nolan’s causeway maps chart sixteen active portals.'
                  )
                ])
              ])
            ]),
            m('figure.ws-figure', [
              m('img', {
                src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/waystation_keepers_hearth_home.jpg`,
                alt: 'Inside Keepers’ Hall—a cozy, step-free 1980s fantasy sanctuary of honeyed cedar, warm stone hearth fire, seated copper kitchen, and a wide three-person twin-moon canopy bed—barefoot twenty-four-year-old Nolan Lennox (5-foot-7) sits warmly between his taller nineteen-year-old sister Gwen Lennox (6-foot-1) and his girlfriend Mallory Walsh (5-foot-5, copper-auburn ponytail, thin silver wire-rimmed glasses, forest-green cardigan) under Grandpa Walter’s plaid blanket beside their four ergonomic Lofstrand forearm crutches, looking out through the glowing Hearth-Archway toward the Bronze Astrolabe and twin moons',
                width: 1200,
                height: 675,
                loading: 'lazy'
              }),
              m(
                'figcaption.ws-caption',
                'Inside Keepers’ Hall: the glowing crystal Hearth-Archway forms the step-free doorway between Nolan, Gwen, and Mallory’s hearth home and the outdoor Astrolabe courtyard.'
              )
            ])
          ])
        ])
      ]),

      includeWaterwheelTeaScene
        ? m('section.ws-section', { 'aria-labelledby': 'cloudbrook-tea-heading' }, [
            m('div.ws-story-frame.ws-two-col', [
              m('figure.ws-figure', [
                m('img', {
                  src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e002/e002_c006_p002_vaeloria_tea_terrace_three_keepers.jpg`,
                  alt: 'On the cedar-and-stone Waterwheel Tea-Terrace beside a gently turning mossy millwheel in Cloudbrook Hollow, twenty-four-year-old Nolan Lennox and his six-foot-one sister Gwen Lennox sit comfortably in their manual wheelchairs with single-tube forearm crutches clipped behind their backrests beside Mallory Walsh in her forest-green cardigan and wire-rimmed glasses over warm mugs of spiced pear cider, honey-oat scones, brass star-vellum charts, and runic slates',
                  width: 1200,
                  height: 675,
                  loading: 'lazy'
                }),
                m(
                  'figcaption.ws-caption',
                  'Afternoon at Cloudbrook Hollow’s Waterwheel Tea-Terrace: spiced pear cider, honey-oat scones, Gwen’s star-vellum charts, and Mallory’s runic slates.'
                )
              ]),
              m('div', [
                m('span.ws-eyebrow', [
                  m('span', { 'aria-hidden': 'true' }, '🫖'),
                  m('span', 'Beyond Keepers’ Hall • Living Valley Towns')
                ]),
                m(
                  'h2.ws-section-title',
                  { id: 'cloudbrook-tea-heading' },
                  'A Whole Step-Free Realm Waiting Beyond the Courtyard'
                ),
                m(
                  'p.ws-card-body',
                  'Keepers’ Hall is not an isolated tower—it is Nolan, Gwen, and Mallory’s front porch onto all of Vaeloria. Down the water-balanced cliff lift lies Cloudbrook Hollow, where Master Doran’s woodshop and Baker Tamsin’s hearth ovens were built centuries ago around smooth cedar ramps and thirty-six-inch-low slate counters so wheelchair users and forearm-crutch walkers move right alongside everyone else.'
                ),
                m(
                  'p.ws-card-body.ws-mt-sm',
                  'On the Waterwheel Tea-Terrace, Mallory translates Slow-Footed Order cipher slates with her blue pen while Gwen plots twin-moon eclipses and Nolan maps the Western Star-Bridges—where their next Vaeloria adventures are only just beginning.'
                )
              ])
            ])
          ])
        : null
    ]);
  }

  /**
   * Renders the Tidewater Earth & Vaeloria Supporting Cast cards on `/guides`.
   */
  function renderSupportingCastSection(): m.Vnode {
    const earthCast: SupportingCharacter[] = SUPPORTING_CAST.filter((c) => c.world === 'earth');
    const vaeloriaCast: SupportingCharacter[] = SUPPORTING_CAST.filter(
      (c) => c.world === 'vaeloria'
    );

    const renderGroup = (
      headingId: string,
      eyebrow: string,
      title: string,
      subtitle: string,
      members: SupportingCharacter[]
    ): m.Vnode =>
      m('section.ws-section', { 'aria-labelledby': headingId }, [
        m('div.ws-section-head', [
          m('span.ws-eyebrow', eyebrow),
          m('h2.ws-section-title', { id: headingId }, title),
          m('p.ws-muted', subtitle)
        ]),
        m(
          'div.ws-realm-grid',
          members.map((person) =>
            m('article.ws-arch-card', { key: person.id }, [
              m('div.ws-arch-top', [
                m('span.ws-arch-glyph', { 'aria-hidden': 'true' }, person.icon),
                m('span.ws-arch-subtitle', person.roleBadge)
              ]),
              m('h3.ws-card-title', person.name),
              m('p.ws-card-body', person.summary)
            ])
          )
        )
      ]);

    return m('div', [
      renderGroup(
        'earth-cast-heading',
        '🌎 Book One Cast • Tidewater Virginia (1999–2002)',
        'Allies & Foil Back Home in Tidewater Virginia',
        'Before the amber rift ever opened beside Studio 205’s bed, these four people shaped Nolan, Gwen, and Mallory’s two-year road to freedom and self-respect on Earth.',
        earthCast
      ),
      renderGroup(
        'vaeloria-cast-heading',
        '🌙 Book Two Cast • Twin-Moon Vaeloria',
        'Keepers, Pilots & Artisans of Vaeloria',
        'Across all three Sunken Milestone routes and down into Cloudbrook Hollow, Vaeloria’s neighbors welcome Nolan, Gwen, and Mallory at an unhurried human pace.',
        vaeloriaCast
      )
    ]);
  }

  /**
   * Renders the full 6-Act Illustrated Two-World Story & Crossroads Guide on `/story`.
   */
  function renderChroniclesPage(baseOrigin: string): m.Vnode {
    return m('div', [
      m('header.ws-page-intro', [
        m('span.ws-eyebrow', '📖 Book One & Book Two • 4 Story Crossroads • 51 Illustrations'),
        m(
          'h1.ws-hero-title',
          'From Norfolk’s Bus Terminal & Studio 205 to Twin-Moon Vaeloria'
        ),
        m(
          'p.ws-lead',
          'Explore how twenty-four-year-old Nolan Lennox, his six-foot-one sister Gwen, and his girlfriend Mallory Walsh weathered two turbulent years in Tidewater Virginia, shut Tammy’s manipulation down for good, and crossed barefoot through a 9:15 PM stained-glass rift into Vaeloria.'
        ),
        m('div.ws-btn-row', [
          m('a.ws-btn.ws-btn-primary', { href: 'https://books.raggiesoft.com/waystation' }, [
            m('span', { 'aria-hidden': 'true' }, '📚'),
            m('span', 'Start Reading in Book Reader →')
          ]),
          m('a.ws-btn.ws-btn-secondary', { href: 'https://books.raggiesoft.com/waystation/illustrations' }, [
            m('span', { 'aria-hidden': 'true' }, '🖼️'),
            m('span', 'Browse All 51 Book Illustrations')
          ]),
          m(
            'a.ws-btn.ws-btn-secondary',
            {
              href: `${baseOrigin}/guides`,
              onclick: (e: MouseEvent) => navigateLocal(e, '/guides')
            },
            [
              m('span', { 'aria-hidden': 'true' }, '👥'),
              m('span', 'Meet the Keepers & Cast')
            ]
          )
        ])
      ]),

      m(
        'div.ws-chronicle-list',
        TWO_WORLD_CHRONICLES.map((item, idx) =>
          m(
            'section.ws-story-frame.ws-two-col.ws-chronicle-card',
            {
              key: item.actLabel,
              'aria-labelledby': `act-heading-${idx + 1}`
            },
            idx % 2 === 0
              ? [
                  m('figure.ws-figure', [
                    m('img', {
                      src: item.imageUrl,
                      alt: item.imageAlt,
                      width: 1200,
                      height: 675,
                      loading: idx === 0 ? 'eager' : 'lazy'
                    }),
                    m('figcaption.ws-caption', item.imageCaption)
                  ]),
                  m('div', [
                    m('span.ws-eyebrow', `${item.actLabel} • ${item.eraBadge}`),
                    m('h2.ws-section-title', { id: `act-heading-${idx + 1}` }, item.title),
                    m('p.ws-card-body', item.body),
                    m('p.ws-guide-whisper.ws-mt-sm', item.crossroadsNote)
                  ])
                ]
              : [
                  m('div', [
                    m('span.ws-eyebrow', `${item.actLabel} • ${item.eraBadge}`),
                    m('h2.ws-section-title', { id: `act-heading-${idx + 1}` }, item.title),
                    m('p.ws-card-body', item.body),
                    m('p.ws-guide-whisper.ws-mt-sm', item.crossroadsNote)
                  ]),
                  m('figure.ws-figure', [
                    m('img', {
                      src: item.imageUrl,
                      alt: item.imageAlt,
                      width: 1200,
                      height: 675,
                      loading: 'lazy'
                    }),
                    m('figcaption.ws-caption', item.imageCaption)
                  ])
                ]
          )
        )
      )
    ]);
  }

  return {
    view(): m.Vnode {
      const rift = detectUnchartedRift(activePath, is404Override);
      const baseOrigin = rift.isRift404 ? 'https://waystation.raggiesoft.com' : '';

      return m('div.ws-shell', [
        // 1. Primary 1980s Fantasy-Adventure Header Banner
        m('header.ws-header', [
          m('div.ws-container.ws-header-inner', [
            m(
              'a.ws-brand',
              {
                href: `${baseOrigin}/`,
                onclick: (e: MouseEvent) => navigateLocal(e, '/')
              },
              [
                m('span.ws-brand-medallion', { 'aria-hidden': 'true' }, '🔮'),
                m('span', [
                  m('span.ws-brand-title', 'The Uncharted Waystation'),
                  m('span.ws-brand-sub', 'Nolan, Gwen & Mallory’s Portal Guide Across RaggieSoft')
                ])
              ]
            ),

            m(
              'button.rs-mobile-header-toggle',
              {
                type: 'button',
                'data-rs-mobile-toggle': '',
                'data-open-label': 'Open menu',
                'data-close-label': 'Close menu',
                'aria-expanded': 'false',
                'aria-controls': 'header-navigation-panel',
                'aria-label': 'Open menu'
              },
              m.trust(
                '<svg class="rs-icon-bars" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true" focusable="false"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg><svg class="rs-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" aria-hidden="true" focusable="false"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
              )
            ),

            m(
              'div.ws-nav-cluster',
              { id: 'header-navigation-panel', 'data-rs-collapsible': 'true' },
              [
                m(
                  'nav',
                  { 'aria-label': 'Waystation Navigation' },
                  m(
                    'ul.ws-nav-list',
                    WAYSTATION_ROUTES.map((route) => {
                      const isActive = !rift.isRift404 && activePath === route.path;
                      return m('li', { key: route.path }, [
                        m(
                          'a.ws-nav-link',
                          {
                            href: `${baseOrigin}${route.path}`,
                            'aria-current': isActive ? 'page' : undefined,
                            onclick: (e: MouseEvent) => navigateLocal(e, route.path)
                          },
                          route.navLabel
                        )
                      ]);
                    })
                  )
                ),

                m(
                  'button.ws-lamp-btn',
                  {
                    type: 'button',
                    onclick: toggleReadingLamp
                  },
                  [
                    m('span.ws-lamp-to-light', [
                      m('span', { 'aria-hidden': 'true' }, '☀️'),
                      m('span', 'Sunlit Stone')
                    ]),
                    m('span.ws-lamp-to-dark', [
                      m('span', { 'aria-hidden': 'true' }, '🌙'),
                      m('span', 'Twin Moons')
                    ])
                  ]
                ),

                m('div.rs-vdom-slot', {
                  oncreate: () => {
                    if (typeof window !== 'undefined') {
                      (window as unknown as { initRaggieSoftNetworkMenu?: () => void }).initRaggieSoftNetworkMenu?.();
                    }
                  }
                })
              ]
            )
          ])
        ]),

        // 2. Main Landmark Content
        m('main.ws-main', { id: 'main-content', tabindex: -1 }, [
          m('div.ws-container', [
            // 404 RIFT ARRIVAL CALLOUT (Shown prominently whenever serving HTTP 404!)
            rift.isRift404
              ? m('section.ws-rift-banner', { 'aria-labelledby': 'rift-404-heading' }, [
                  m('div.ws-rift-header', [
                    m('span.ws-rift-pill', [
                      m('span', { 'aria-hidden': 'true' }, '⚡'),
                      m('span', '404 • Uncharted Dimensional Rift')
                    ]),
                    m(
                      'h1.ws-hero-title',
                      { id: 'rift-404-heading' },
                      'Whoa—Looks Like You Tumbled Into the Waystation Too!'
                    ),
                    m('p.ws-lead', [
                      'Hey there! There’s no realm mapped at ',
                      m('strong', rift.attemptedAddress),
                      '—so the dimensional current dropped you onto the warm flagstones right beside barefoot Keepers ',
                      m('strong', 'Nolan & Gwen Lennox and Mallory Walsh'),
                      '. Don’t worry: every real RaggieSoft world is one archway away!'
                    ])
                  ]),

                  rift.suggestedRealm
                    ? m('div.ws-suggested-box', [
                        m(
                          'span.ws-eyebrow',
                          `🧭 Gwen & Mallory’s Closest Match for "${rift.attemptedAddress}"`
                        ),
                        m('div.ws-suggested-row', [
                          m('div', [
                            m(
                              'h2.ws-card-title',
                              `${rift.suggestedRealm.glyph} ${rift.suggestedRealm.name}`
                            ),
                            m('p.ws-card-body', rift.suggestedRealm.description)
                          ]),
                          m(
                            'a.ws-btn.ws-btn-primary',
                            { href: rift.suggestedRealm.url },
                            `Step Into ${rift.suggestedRealm.name} →`
                          )
                        ])
                      ])
                    : null
                ])
              : null,

            // Canonical Hero on `/` (or companion visual right under the 404 banner!)
            activePath === '/' || rift.isRift404
              ? m(
                  'section.ws-hero',
                  { 'aria-labelledby': rift.isRift404 ? 'courtyard-welcome' : 'hero-main-heading' },
                  [
                    m('div', [
                      m('span.ws-eyebrow', [
                        m('span', { 'aria-hidden': 'true' }, '🏰'),
                        m('span', '1980s Fantasy Outpost • Three Everyday Human Guides')
                      ]),
                      rift.isRift404
                        ? m(
                            'h2.ws-section-title',
                            { id: 'courtyard-welcome' },
                            'Welcome to the Courtyard Between Worlds'
                          )
                        : m(
                            'h1.ws-hero-title',
                            { id: 'hero-main-heading' },
                            'Three Barefoot Keepers in a 1980s Fantasy World—Pointing You Home.'
                          ),
                      m(
                        'p.ws-lead',
                        'Pulled barefoot off Studio 205’s full-sized bed with Grandpa Walter’s plaid blanket and their four ergonomic forearm crutches—leaving both wheelchairs behind on Earth—twenty-four-year-old Nolan (5\'7"), his six-foot-one nineteen-year-old sister Gwen Lennox, and his girlfriend Mallory Walsh (5\'5") journeyed across Vaeloria, woke the Three-Ring Bronze Astrolabe, and built an unhurried life together in Keepers’ Hall.'
                      ),
                      m('div.ws-btn-row', [
                        m('a.ws-btn.ws-btn-primary', { href: 'https://books.raggiesoft.com/waystation' }, [
                          m('span', { 'aria-hidden': 'true' }, '📖'),
                          m('span', 'Read Our Crossroads Adventure')
                        ]),
                        m(
                          'a.ws-btn.ws-btn-secondary',
                          {
                            href: `${baseOrigin}/guides`,
                            onclick: (e: MouseEvent) => navigateLocal(e, '/guides')
                          },
                          [
                            m('span', { 'aria-hidden': 'true' }, '👥'),
                            m('span', 'Meet Keepers & Cast')
                          ]
                        ),
                        m(
                          'a.ws-btn.ws-btn-secondary',
                          {
                            href: `${baseOrigin}/story`,
                            onclick: (e: MouseEvent) => navigateLocal(e, '/story')
                          },
                          [
                            m('span', { 'aria-hidden': 'true' }, '🗺️'),
                            m('span', 'Two-World Story')
                          ]
                        ),
                        m('a.ws-btn.ws-btn-secondary', { href: 'https://raggiesoft.com' }, [
                          m('span', { 'aria-hidden': 'true' }, '🌐'),
                          m('span', 'RaggieSoft Hub')
                        ])
                      ])
                    ]),

                    m('figure.ws-figure', [
                      m('img', {
                        src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_waystation_hero.jpg`,
                        alt: 'High on the rose-quartz Star-Court parapet of the Uncharted Waystation beneath two rising moons, twenty-four-year-old Nolan Lennox (5-foot-7, navy t-shirt and jeans, on his matte-silver single-tube Lofstrand forearm crutches) stands right in the middle between his taller nineteen-year-old sister Gwen Lennox (6-foot-1, burgundy t-shirt, on her matte-charcoal single-tube Lofstrand forearm crutches) and his girlfriend Mallory Walsh (5-foot-5, copper-auburn ponytail with blue pen behind her ear, thin silver wire-rimmed glasses, forest-green cardigan over cream tee, holding a runic slate) beside the Three-Ring Bronze Astrolabe and glowing stained-glass portal archways',
                        width: 1200,
                        height: 675,
                        fetchpriority: 'high'
                      }),
                      m(
                        'figcaption.ws-caption',
                        'Standing together beside the Three-Ring Bronze Astrolabe and glowing archway—Nolan (5\'7"), sister Gwen (6\'1"), and Mallory Walsh (5\'5") welcoming travelers.'
                      )
                    ])
                  ]
                )
              : null,

            // Page-specific heading for `/guides`
            !rift.isRift404 && activePath === '/guides'
              ? m('header.ws-page-intro', [
                  m('span.ws-eyebrow', '🧭 Meet Your Wayfinders, Keepers’ Hall & Full Supporting Cast'),
                  m(
                    'h1.ws-hero-title',
                    'Nolan, Gwen, Mallory & the People of Tidewater and Vaeloria'
                  ),
                  m(
                    'p.ws-lead',
                    'Get to know the three Keepers tending the Bronze Astrolabe—plus Grandpa Walter, cabbie Denise Carter, Nolan’s controlling ex Tammy, and the barge pilots, herbalists, and Cloudbrook Hollow artisans across Vaeloria.'
                  )
                ])
              : null,

            // Page-specific heading for `/realms`
            !rift.isRift404 && activePath === '/realms'
              ? m('header.ws-page-intro', [
                  m('span.ws-eyebrow', '🗺️ Complete Universe Directory'),
                  m('h1.ws-hero-title', 'Every Glowing Archway in the RaggieSoft Universe')
                ])
              : null,

            // Full 6-Act Illustrated Two-World Story route (`/story`)
            !rift.isRift404 && activePath === '/story' ? renderChroniclesPage(baseOrigin) : null,

            // Full Keepers Dossiers at top of `/guides`
            !rift.isRift404 && activePath === '/guides'
              ? renderKeepersDossierGrid(baseOrigin, false)
              : null,

            // Render Astrolabe Directory on `/`, `/realms`, and all `404` Rift arrivals
            activePath === '/' || activePath === '/realms' || rift.isRift404
              ? renderAstrolabeDirectory()
              : null,

            // Compact Three-Keeper Spotlight on `/` (right below the directory so visitors meet Mallory, Nolan & Gwen!)
            !rift.isRift404 && activePath === '/'
              ? renderKeepersDossierGrid(baseOrigin, true)
              : null,

            // Render Star-Moss Blanket & Keepers' Hall Sanctuary Tour on `/`, `/guides`, and `404`
            activePath === '/' || activePath === '/guides' || rift.isRift404
              ? renderGuidesStorySection(baseOrigin, !rift.isRift404 && activePath === '/guides')
              : null,

            // Render Earth & Vaeloria Supporting Cast on `/guides`
            !rift.isRift404 && activePath === '/guides' ? renderSupportingCastSection() : null
          ])
        ]),

        // 3. Global Waystation Footer with Mandatory Fictitious Persons & Entities Disclaimer
        m('footer.ws-footer', [
          m('div.ws-container', [
            m('div.ws-footer-row', [
              m('div', [
                m('h2.ws-card-title', 'The Uncharted Waystation'),
                m(
                  'p.ws-muted',
                  'Official universe directory, character & world companion for The Uncharted Waystation, and friendly 404 wayfinder across RaggieSoft, Ocean View Archives, RaggieSoft Story Crossroads, and Engine Room Records.'
                )
              ]),
              m('div', [
                m('h2.ws-card-title', 'Creative Licensing & Governance'),
                m('p.ws-muted', [
                  'Original narratives, characters, and artwork are shared under ',
                  m('a', { href: 'https://creativecommons.org/licenses/by-sa/4.0/' }, 'CC BY-SA 4.0'),
                  ' alongside commercial licensing via ',
                  m(
                    'a',
                    { href: 'https://raggiesoft.com/raggiesoft-media/licensing/commercial' },
                    'RaggieSoft Media'
                  ),
                  '.'
                ]),
                m('p.ws-muted', { style: 'margin-top: 0.45rem;' }, [
                  m('a', { href: 'https://raggiesoft.com/about/privacy' }, 'Privacy Policy'),
                  ' • ',
                  m('a', { href: 'https://raggiesoft.com/about/terms' }, 'Terms of Service'),
                  ' • ',
                  m(
                    'a',
                    { href: 'https://raggiesoft.com/about/ai-disclaimer' },
                    'AI & Creative Process | RaggieSoft Governance'
                  )
                ])
              ])
            ]),

            m(
              'div.ws-disclaimer',
              { role: 'note', 'aria-label': 'Fictitious Persons and Entities Disclaimer' },
              [
                m('strong', 'Work of Fiction Disclaimer: '),
                'All RaggieSoft characters (including Nolan, Gwen & Walter Lennox, Mallory Walsh, Tammy, Ray Halstead, Denise Carter, Bramwell Kettle, Rowan & Iris Hawthorne, the Bridger triplets, and the OVA Siblings), bands, biographies, universities (including CPI, VDU, The Forgers, and The Crucible), corporations (OmniCorp, Apex Records, Prairie Coachworks, Sainte-Claire), transit agencies (BRT, CVTA), in-universe legal filings, and events are works of fiction. Any resemblance to actual persons, living or dead, or real-world entities is purely coincidental.'
              ]
            )
          ])
        ])
      ]);
    }
  };
}
