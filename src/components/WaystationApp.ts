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
 *   Dual Mode (Canonical `waystation.raggiesoft.com` vs. Unmapped `404` Rift):
 *     - On `waystation.raggiesoft.com` (`/`, `/guides`, `/realms`), visitors
 *       explore the courtyard, read Nolan & Gwen's sofa-to-fantasy story, and
 *       use the Astrolabe Directory.
 *     - On `/404.html`—OR whenever Nginx's `default_server` serves this app on
 *       an unconfigured/mistyped subdomain like `https://book.raggiesoft.com`—
 *       `detectUnchartedRift()` activates the **404 Rift Banner** and uses
 *       keyword matching to suggest the exact RaggieSoft archway right on top!
 * ============================================================================
 */

import m from 'mithril';
import {
  CDN_BASE,
  REALM_CATEGORIES,
  UNIVERSE_REALMS,
  WAYSTATION_ROUTES,
  type RealmCategory,
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
 * Inspects the current browser URL (when running client-side) or `force404Mode`
 * (when pre-rendering `dist/404.html` on Node.js) to see if the traveler arrived
 * via an unconfigured subdomain (`book.raggiesoft.com`) or a missing path (`404`).
 */
function detectUnchartedRift(initialPath: string, force404Mode: boolean): RiftDetection {
  if (typeof window === 'undefined') {
    return {
      isRift404: force404Mode,
      attemptedAddress: 'an unmapped *.raggiesoft.com trail',
      suggestedRealm: UNIVERSE_REALMS[1] // Ocean View Archives default preview
    };
  }

  const host = (window.location.hostname || '').toLowerCase();
  const pathname = window.location.pathname || '/';
  const isCanonicalHost =
    host === 'waystation.raggiesoft.com' || host === 'localhost' || host === '127.0.0.1';
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const isKnownWaystationRoute =
    normalizedPath === '/' || normalizedPath === '/guides' || normalizedPath === '/realms';

  const isRift404 = force404Mode || !isCanonicalHost || !isKnownWaystationRoute;
  const fullAttempt = `${host}${pathname === '/' ? '' : pathname}`;

  // Score each RaggieSoft realm against keywords found in the mistyped hostname/path
  const haystack = `${host} ${pathname}`.toLowerCase();
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

  // Sync browser Back/Forward buttons when navigating between `/`, `/guides`, `/realms`
  if (typeof window !== 'undefined') {
    const startNorm = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    if (startNorm === '/' || startNorm === '/guides' || startNorm === '/realms') {
      activePath = startNorm;
    }
    window.addEventListener('popstate', () => {
      const p = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
      if (p === '/' || p === '/guides' || p === '/realms') {
        activePath = p;
        is404Override = false;
        m.redraw();
      }
    });
  }

  function navigateLocal(e: MouseEvent, targetPath: string): void {
    // Only intercept plain left-clicks when already on canonical waystation.raggiesoft.com!
    // If the visitor is on a 404 typo subdomain (`book.raggiesoft.com`), let normal `<a href>`
    // navigate cleanly to `https://waystation.raggiesoft.com/...`!
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
    const matchedRoute = WAYSTATION_ROUTES.find((r) => r.path === targetPath);
    if (matchedRoute) {
      document.title = matchedRoute.seoTitle;
      // Keep client-side <head> meta & canonical tags synchronized during SPA navigation
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
        realm.hintKeywords.some((k) => k.includes(q))
      );
    });
  }

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
      // built directly per `modern-web-guidance` (`forms` & `natural-interactions`)!
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
                  placeholder: 'Try "Cedar Run", "Listening Room", "Katie", or "synth"...',
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
            m('h3.ws-card-title', 'Even Gwen’s Astrolabe Didn’t Spot That Spell!'),
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

  function renderGuidesStorySection(): m.Vnode {
    return m('div', [
      m('section.ws-section', { 'aria-labelledby': 'guides-story-heading' }, [
        m('div.ws-story-frame.ws-two-col', [
          m('figure.ws-figure', [
            m('img', {
              src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_sofa_blanket_bench.jpg`,
              alt: 'On a carved mossy stone bench in a twin-moon 1980s fantasy courtyard, barefoot twenty-four-year-old brother Nolan Lennox (5-foot-7, navy t-shirt and jeans) and his taller nineteen-year-old sister Gwen Lennox (6-foot-1, burgundy t-shirt and jeans) sit cuddled closely together in a warm hug under Grandpa Walter’s green-and-navy plaid wool blanket, with Nolan’s matte-silver Lofstrand forearm crutches and Gwen’s matte-charcoal Lofstrand forearm crutches leaning cleanly against the stone armrests beside them',
              width: 1200,
              height: 675,
              loading: 'lazy'
            }),
            m(
              'figcaption.ws-caption',
              'Earned at the end of a long, winding adventure across Vaeloria—cuddled under Grandpa Walter’s plaid blanket with their ergonomic forearm crutches beside the bench, Nolan (24, 5\'7") and Gwen Lennox (19, 6\'1") at home forever.'
            )
          ]),
          m('div', [
            m('span.ws-eyebrow', [
              m('span', { 'aria-hidden': 'true' }, '🏡'),
              m('span', 'From a Tiny One-Room Studio to Keepers of the Waystation')
            ]),
            m(
              'h2.ws-section-title',
              { id: 'guides-story-heading' },
              '“Nobody Handed Us This Sanctuary—We Walked Every Gentle Mile Together to Wake It.”'
            ),
            m(
              'p.ws-card-body',
              '“Two days before Gwen turned eighteen, fellow passengers at the Norfolk bus station helped push my abusive ex away after I broke down crying and refused a one-way cross-country ticket so I wouldn’t miss my kid sister’s birthday back in the Emerald Creek area of Chesapeake,” twenty-four-year-old Nolan shares, his arm wrapped warmly around his six-foot-one sister beside their four forearm crutches. “Our beloved Grandpa Walter held on for Gwen’s eighteenth birthday—where Gwen was over the moon when I invited her to come live with me—and passed away the very next day, leaving us to sell Grandpa’s house and move together into my tiny rectangular one-person studio box: one corner full bed, a swiveled rabbit-ear TV and VCR/DVD combo, an under-counter dorm fridge, and a microwave pantry cart.”'
            ),
            m(
              'p.ws-card-body',
              '“After a year of sharing that one full bed and begging on speakerphone for wheelchair parts, Vaeloria’s sleeping Astrolabe answered my wish—dropping us barefoot with Grandpa’s blanket and our forearm crutches out in the distant borderlands,” nineteen-year-old Gwen smiles, resting her cheek on Nolan’s head. “We weren’t just given this place: we had to journey across Vaeloria, curl up together at every camp, and heal the Great Drift together to earn our glowing-archway home!”'
            ),
            m('div.ws-btn-row', [
              m('a.ws-btn.ws-btn-primary', { href: 'https://books.raggiesoft.com/waystation' }, [
                m('span', { 'aria-hidden': 'true' }, '📖'),
                m('span', 'Read Our Story Crossroads Novel →')
              ]),
              m('a.ws-btn.ws-btn-secondary', { href: 'https://crossroads.raggiesoft.com' }, [
                m('span', { 'aria-hidden': 'true' }, '🧭'),
                m('span', 'About Story Crossroads')
              ])
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
                m('span', { 'aria-hidden': 'true' }, '✨'),
                m('span', 'Architectural Tour • Keepers’ Hall & The Glowing Hearth-Archway')
              ]),
              m(
                'h2.ws-section-title',
                { id: 'sanctuary-home-heading' },
                'Built Around the Glowing Archway: Inside Nolan & Gwen’s Forever Home'
              ),
              m(
                'p.ws-card-body',
                'Once Nolan and Gwen reach the high peaks at the end of their Crossroads journey and re-harmonize the Twin-Ring Bronze Astrolabe, they discover the Slow-Footed Order built the Waystation as a living, step-free home—where a glowing turquoise-and-amber crystal archway forms their front doorway and every room answers the hardships of their old studio box:'
              ),
              m('div.ws-realm-grid', { style: 'margin-top: 1rem;' }, [
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🚪 The Glowing Hearth-Archway'),
                  m(
                    'p.ws-card-body',
                    'Built directly into the living rock between the Astrolabe courtyard and Keepers’ Hall, a gentle curtain of warm starlight keeps out mountain wind and rain without a single heavy door or step—so neither sibling ever has to let go of a forearm-crutch grip to walk inside.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🛏️ The Twin-Moon Canopy Bed'),
                  m(
                    'p.ws-card-body',
                    'Even with an entire sanctuary keep, Gwen refuses to sleep down a distant hall from Nolan. Beneath a crystal twin-moon skylight sits a wide, transfer-height carved cedar bed piled with cloud-wool quilts and Grandpa Walter’s plaid blanket where they still curl up safe together.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🍲 Seated Hearth Kitchen & Spring Larder'),
                  m(
                    'p.ws-card-body',
                    'Replacing their old under-counter dorm fridge and wobbly microwave pantry cart is a step-free stone-and-copper kitchen with seated prep counters off their wrists, a natural snowmelt cold-spring larder, and a warm bread hearth.'
                  )
                ]),
                m('article.ws-arch-card', [
                  m('h3.ws-card-title', '🔭 Moon-Glass Ramps & Thermal Bath'),
                  m(
                    'p.ws-card-body',
                    'Sweeping, stair-free rose-quartz ramps connect a spacious ninety-eight-degree mineral soaking bath (replacing their cramped three-foot studio bathroom) to Gwen’s star-ring observatory and Nolan’s archway workbench.'
                  )
                ])
              ])
            ]),
            m('figure.ws-figure', [
              m('img', {
                src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/waystation_keepers_hearth_home.jpg`,
                alt: 'Inside Keepers’ Hall—a cozy, step-free 1980s fantasy sanctuary of honeyed cedar, warm stone hearth fire, seated copper kitchen, and a twin-moon canopy bed—barefoot brother Nolan Lennox (5-foot-7) and his taller sister Gwen Lennox (6-foot-1) cuddle warmly under Grandpa Walter’s plaid blanket beside their four ergonomic Lofstrand forearm crutches, looking out through the glowing turquoise-and-amber crystal Hearth-Archway built into their wall toward the outdoor Bronze Astrolabe and twin moons',
                width: 1200,
                height: 675,
                loading: 'lazy'
              }),
              m(
                'figcaption.ws-caption',
                'Inside Keepers’ Hall: the glowing crystal Hearth-Archway forms the step-free doorway between Nolan and Gwen’s cozy hearth home and the outdoor Astrolabe courtyard.'
              )
            ])
          ])
        ])
      ])
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
                  m('span.ws-brand-sub', 'Nolan & Gwen’s Portal Guide Across RaggieSoft')
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
                      '—so the dimensional current dropped you onto the warm flagstones right beside barefoot brother and sister ',
                      m('strong', 'Nolan & Gwen Lennox'),
                      '. Don’t worry: every real RaggieSoft world is one archway away!'
                    ])
                  ]),

                  rift.suggestedRealm
                    ? m('div.ws-suggested-box', [
                        m(
                          'span.ws-eyebrow',
                          `✨ Gwen’s Closest Match for "${rift.attemptedAddress}"`
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
              ? m('section.ws-hero', { 'aria-labelledby': rift.isRift404 ? 'courtyard-welcome' : 'hero-main-heading' }, [
                  m('div', [
                    m('span.ws-eyebrow', [
                      m('span', { 'aria-hidden': 'true' }, '🏰'),
                      m('span', '1980s Fantasy Outpost • Two Everyday Human Guides')
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
                          'Two Barefoot Siblings in a 1980s Fantasy World—Pointing You Home.'
                        ),
                    m(
                      'p.ws-lead',
                      'Pulled barefoot off their shared full-sized bed in a tiny one-room studio with Grandpa Walter’s plaid blanket and their four ergonomic forearm crutches—leaving both wheelchairs behind on Earth—twenty-four-year-old Nolan (5\'7") and his six-foot-one nineteen-year-old sister Gwen Lennox journeyed across Vaeloria, healed the Great Drift, and earned this glowing-archway sanctuary as their forever home.'
                    ),
                    m('div.ws-btn-row', [
                      m('a.ws-btn.ws-btn-primary', { href: 'https://books.raggiesoft.com/waystation' }, [
                        m('span', { 'aria-hidden': 'true' }, '📖'),
                        m('span', 'Read Our Crossroads Adventure')
                      ]),
                      m('a.ws-btn.ws-btn-secondary', { href: 'https://raggiesoft.com' }, [
                        m('span', { 'aria-hidden': 'true' }, '🌐'),
                        m('span', 'RaggieSoft Hub')
                      ]),
                      m('a.ws-btn.ws-btn-secondary', { href: 'https://books.raggiesoft.com' }, [
                        m('span', { 'aria-hidden': 'true' }, '📚'),
                        m('span', 'All Novels')
                      ]),
                      m('a.ws-btn.ws-btn-secondary', { href: 'https://music.raggiesoft.com' }, [
                        m('span', { 'aria-hidden': 'true' }, '🎧'),
                        m('span', 'Listen to Music')
                      ])
                    ])
                  ]),

                  m('figure.ws-figure', [
                    m('img', {
                      src: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_waystation_hero.jpg`,
                      alt: 'Barefoot 5-foot-7 stocky brother Nolan Lennox in a plain navy t-shirt and blue jeans and his taller 6-foot-1 curvy sister Gwen Lennox in a plain burgundy t-shirt and blue jeans embracing in a warm two-armed sibling hug on smooth ancient flagstones inside a glowing 1980s fantasy courtyard, with both pairs of their silver and charcoal ergonomic Lofstrand forearm crutches leaning neatly against the carved stone Astrolabe pedestal beside them and twin moons shining behind crystal spires',
                      width: 1200,
                      height: 675,
                      fetchpriority: 'high'
                    }),
                    m(
                      'figcaption.ws-caption',
                      'Barefoot in a warm sibling hug beside their forearm crutches and the bronze Astrolabe—Nolan (5\'7") and Gwen Lennox (6\'1") welcoming lost travelers.'
                    )
                  ])
                ])
              : null,

            // Page-specific heading for `/guides` or `/realms`
            !rift.isRift404 && activePath === '/guides'
              ? m('header.ws-page-intro', [
                  m('span.ws-eyebrow', '✨ Meet Your Wayfinders & Tour Keepers’ Hall'),
                  m('h1.ws-hero-title', 'Nolan & Gwen Lennox: From a One-Bed Studio Box to the Glowing Archway')
                ])
              : null,

            !rift.isRift404 && activePath === '/realms'
              ? m('header.ws-page-intro', [
                  m('span.ws-eyebrow', '🗺️ Complete Universe Directory'),
                  m('h1.ws-hero-title', 'Every Glowing Archway in the RaggieSoft Universe')
                ])
              : null,

            // Render Astrolabe Directory on `/`, `/realms`, and all `404` Rift arrivals
            activePath === '/' || activePath === '/realms' || rift.isRift404
              ? renderAstrolabeDirectory()
              : null,

            // Render Nolan & Gwen's Sofa-to-Waystation Story on `/` and `/guides` (and 404!)
            activePath === '/' || activePath === '/guides' || rift.isRift404
              ? renderGuidesStorySection()
              : null
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
                  'Official universe directory and friendly 404 wayfinder across RaggieSoft, Ocean View Archives, RaggieSoft Story Crossroads, and Engine Room Records.'
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
                'All RaggieSoft characters (including Nolan & Gwen Lennox, Rowan & Iris Hawthorne, the Bridger triplets, and the OVA Siblings), bands, biographies, universities (including CPI, VDU, The Forgers, and The Crucible), corporations (OmniCorp, Apex Records, Prairie Coachworks, Sainte-Claire), transit agencies (BRT, CVTA), in-universe legal filings, and events are works of fiction. Any resemblance to actual persons, living or dead, or real-world entities is purely coincidental.'
              ]
            )
          ])
        ])
      ]);
    }
  };
}
