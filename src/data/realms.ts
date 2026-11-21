/**
 * @license MIT
 * ============================================================================
 * src/data/realms.ts — Typed RaggieSoft Universe Archway Registry & Guides Lore
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL TYPESCRIPT GUIDE):
 *   What is this file?
 *     This TypeScript module holds the structured catalog of every live
 *     destination across the RaggieSoft Universe—organized as glowing stone
 *     archways inside **The Uncharted Waystation**—alongside the backstory of
 *     twenty-year-old **Nolan Lennox** and nineteen-year-old **Gwen Lennox**,
 *     our barefoot real-world brother and sister who tumbled off their living
 *     room sofa into this 1980s Fantasy-Adventure courtyard!
 *
 *   How Smart Typo / Rift Matching Works:
 *     Every `UniverseRealm` entry includes an array of `hintKeywords` (such as
 *     `['book', 'read', 'novel', 'library', 'archive']`). When a visitor lands
 *     here via a mistyped subdomain like `https://book.raggiesoft.com`, Gwen's
 *     Astrolabe checks the hostname and path against `hintKeywords` to highlight
 *     the exact RaggieSoft destination they were trying to reach!
 * ============================================================================
 */

export const CDN_BASE = 'https://assets.raggiesoft.com';
export const SITE_ORIGIN = 'https://waystation.raggiesoft.com';
export const INDEXNOW_KEY = '726167676965736f6674696e6465786e';

export type RealmCategory = 'all' | 'stories' | 'music' | 'lore' | 'hub';

export interface CategoryOption {
  id: RealmCategory;
  label: string;
  runeIcon: string;
}

/**
 * Five mutually exclusive radio filter options (per `modern-web-guidance` `forms`:
 * "Expose 2 to 5 mutually exclusive options as visible radio buttons when choices are fewer than six").
 */
export const REALM_CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'All 16 Archways', runeIcon: '✦' },
  { id: 'stories', label: 'Novels & Crossroads', runeIcon: '📖' },
  { id: 'music', label: 'Music & Bands', runeIcon: '🎧' },
  { id: 'lore', label: 'Lore, Space & Backstage', runeIcon: '🔮' },
  { id: 'hub', label: 'Hub, Apps & Stories Behind', runeIcon: '🏰' }
];

export interface UniverseRealm {
  id: string;
  name: string;
  archwayTitle: string;
  category: Exclude<RealmCategory, 'all'>;
  glyph: string;
  url: string;
  hostDisplay: string;
  description: string;
  nolanOrGwenTip: string;
  hintKeywords: string[];
}

export const UNIVERSE_REALMS: UniverseRealm[] = [
  {
    id: 'hub',
    name: 'RaggieSoft Hub (Front Door)',
    archwayTitle: 'The Grand Citadels Gate',
    category: 'hub',
    glyph: '🌐',
    url: 'https://raggiesoft.com',
    hostDisplay: 'raggiesoft.com',
    description:
      'The central front door to the entire RaggieSoft creative universe—spotlighting our four main pillars, seasonal tributes, and quick ways to dive in.',
    nolanOrGwenTip: 'Nolan: “Not sure where to start? Step through the main gate—everything branches out from there.”',
    hintKeywords: ['home', 'main', 'hub', 'start', 'welcome']
  },
  {
    id: 'launcher',
    name: 'RaggieSoft Launcher (Desktop App Hub)',
    archwayTitle: 'The Brass Clockwork Dock Arch',
    category: 'hub',
    glyph: '🚀',
    url: 'https://launcher.raggiesoft.com',
    hostDisplay: 'launcher.raggiesoft.com',
    description:
      'One calm, account-free desktop home to install, open, and update RaggieSoft Book Reader, The Listening Room, Backstage, and StoreTrainer for offline enjoyment.',
    nolanOrGwenTip: 'Gwen: “Looking to read novels or stream albums offline on your computer? Every desktop app docks right through here!”',
    hintKeywords: ['launcher', 'desktop', 'app', 'download', 'install', 'setup', 'update', 'offline', 'suite']
  },
  {
    id: 'a11y',
    name: 'RaggieSoft Accessibility Studio',
    archwayTitle: 'The Sapphire Lens & Compass Arch',
    category: 'hub',
    glyph: '♿',
    url: 'https://a11y.raggiesoft.com',
    hostDisplay: 'a11y.raggiesoft.com',
    description:
      'Enterprise Windows desktop studio and command-line toolkit for auditing, diff-reviewing, and fixing web accessibility across code, stylesheets, and captions.',
    nolanOrGwenTip: 'Nolan: “Having walked miles on forearm crutches myself, building doorways everyone can step through matters—this is Michael’s flagship accessibility studio!”',
    hintKeywords: ['a11y', 'accessibility', 'studio', 'wcag', '508', 'audit', 'ide', 'contrast']
  },
  {
    id: 'jessica',
    name: 'Jessica — Stories Behind Every Project',
    archwayTitle: 'The Warm Hearthstone Study Arch',
    category: 'hub',
    glyph: '🛡️',
    url: 'https://jessica.raggiesoft.com',
    hostDisplay: 'jessica.raggiesoft.com',
    description:
      'Step into Jessica Ragsdale’s Virginia Beach study for the personal story behind every RaggieSoft project, the November 2006 rescue & seed desk, and Rachel’s (“Bug’s”) quality-testing notes.',
    nolanOrGwenTip: 'Nolan: “Want to know WHY each book, band, and app exists? Big sister Jessica tells the story behind every single room!”',
    hintKeywords: ['jessica', 'origin', 'behind', 'bear', 'bug', 'sister', 'family', 'moosewood', 'seed']
  },
  {
    id: 'books',
    name: 'Ocean View Archives (Book Reader)',
    archwayTitle: 'The Sunlit Library Arch',
    category: 'stories',
    glyph: '📚',
    url: 'https://books.raggiesoft.com',
    hostDisplay: 'books.raggiesoft.com',
    description:
      'Read all full-length RaggieSoft novels online for free—tended by the OVA Siblings (Isabel, Eleanor, Sophia, and Oliver) with chapter soundtracks and saved bookmarks.',
    nolanOrGwenTip: 'Gwen: “Typed book instead of books? Right through this arch—Isabel keeps the reading lamps warm!”',
    hintKeywords: ['book', 'read', 'novel', 'story', 'library', 'ova', 'ocean', 'katie', 'rachel', 'aubrie', 'drew']
  },
  {
    id: 'crossroads',
    name: 'RaggieSoft Story Crossroads',
    archwayTitle: 'The Three-Signpost Compass Arch',
    category: 'stories',
    glyph: '🧭',
    url: 'https://crossroads.raggiesoft.com',
    hostDisplay: 'crossroads.raggiesoft.com',
    description:
      'Our interactive branching-fiction imprint hosted by brother and sister Rowan & Iris Hawthorne—where every Crossroads option opens a complete, coequal storyline.',
    nolanOrGwenTip: 'Nolan: “Rowan and Iris at least remembered to wear boots on their porch. Try their live signpost trail!”',
    hintKeywords: ['crossroad', 'branch', 'choice', 'choose', 'path', 'interactive', 'rowan', 'iris']
  },
  {
    id: 'cedarrun',
    name: 'Cedar Run Wilderness Guide',
    archwayTitle: 'The Old-Growth Cedar Arch',
    category: 'stories',
    glyph: '🌲',
    url: 'https://cedarrun.raggiesoft.com',
    hostDisplay: 'cedarrun.raggiesoft.com',
    description:
      'Step into Colville National Forest with eighteen-year-old triplets Luke, Tessa, and Sadie Bridger—explore their hand-built shelters, Milky Way skies, and 1975 folk songbook.',
    nolanOrGwenTip: 'Gwen: “Rain on split cedar shakes and a river of stars overhead—it’s peaceful just peeking through!”',
    hintKeywords: ['cedar', 'forest', 'woods', 'triplet', 'luke', 'tessa', 'sadie', 'shelter', 'camp']
  },
  {
    id: 'music',
    name: 'The Listening Room',
    archwayTitle: 'The Starlight Amphitheater Arch',
    category: 'music',
    glyph: '🎧',
    url: 'https://music.raggiesoft.com',
    hostDisplay: 'music.raggiesoft.com',
    description:
      'Stream the complete Engine Room Records catalog with synchronized sing-along lyrics, curated story playlists, and continuous radio.',
    nolanOrGwenTip: 'Nolan: “You can hear 1980s synth-rock and symphonic chords echoing right through the runestones!”',
    hintKeywords: ['music', 'song', 'listen', 'audio', 'album', 'track', 'radio', 'stream', 'lyric', 'soundtrack']
  },
  {
    id: 'engineroom',
    name: 'Engine Room Records',
    archwayTitle: 'The Brass Turntable Arch',
    category: 'music',
    glyph: '⚙️',
    url: 'https://engineroom.raggiesoft.com',
    hostDisplay: 'engineroom.raggiesoft.com',
    description:
      'Meet all seven official Engine Room Records bands and ensembles—from Crimson Node and Firelight to Fractured Prisms, Mana Canvas, and The Paper Wall.',
    nolanOrGwenTip: 'Gwen: “Band bios, discographies, and liner notes for every artist on the label.”',
    hintKeywords: ['engine', 'record', 'label', 'artist', 'band', 'firelight', 'prism', 'crimson', 'mana']
  },
  {
    id: 'stardust',
    name: 'The Stardust Engine',
    archwayTitle: 'The Blacksburg Synth-Rock Arch',
    category: 'music',
    glyph: '🚀',
    url: 'https://stardust.raggiesoft.com',
    hostDisplay: 'stardust.raggiesoft.com',
    description:
      'Official home of Ryan & Cassidy O’Connell, twin cousins Evan & Tyler Wright, and Holly O’Connell—celebrating four decades of iconic 1980s synth-rock.',
    nolanOrGwenTip: 'Nolan: “Pure 1980s analog synth energy—honestly fits the twin moons out here pretty well!”',
    hintKeywords: ['stardust', 'ryan', 'cassidy', 'holly', 'synth', 'tour', 'astra']
  },
  {
    id: 'lore',
    name: 'RaggieSoft Lore Archive',
    archwayTitle: 'The Constellation Cartography Arch',
    category: 'lore',
    glyph: '🗺️',
    url: 'https://lore.raggiesoft.com',
    hostDisplay: 'lore.raggiesoft.com',
    description:
      'Explore interactive character constellations, historical timelines, campus landmarks, and regional transit maps connecting the literary universe.',
    nolanOrGwenTip: 'Gwen: “Every person, place, university, and timeline mapped like stars in the night sky.”',
    hintKeywords: ['lore', 'wiki', 'timeline', 'character', 'place', 'world', 'encyclopedia', 'cpi', 'vdu']
  },
  {
    id: 'backstage',
    name: 'RaggieSoft Backstage',
    archwayTitle: 'The Velvet Curtain Arch',
    category: 'lore',
    glyph: '🎬',
    url: 'https://backstage.raggiesoft.com',
    hostDisplay: 'backstage.raggiesoft.com',
    description:
      'Behind-the-scenes story dossiers, character deep dives, curated multi-era Story Arcs, and standalone alternate-scenario explorations.',
    nolanOrGwenTip: 'Nolan: “Before Gwen and I moved in, unmapped trails used to land there by accident—now it’s got its own proper arch!”',
    hintKeywords: ['backstage', 'bonus', 'behind', 'arc', 'whatif', 'what-if', 'dossier', 'extra']
  },
  {
    id: 'nebulae',
    name: 'RaggieSoft Nebulae',
    archwayTitle: 'The Deep-Space Observatory Arch',
    category: 'lore',
    glyph: '🌌',
    url: 'https://nebulae.raggiesoft.com',
    hostDisplay: 'nebulae.raggiesoft.com',
    description:
      'Interactive cosmic visualizer charting the Caelum-IV planetary survey and deep-space starfields from Escape Velocity: Ad Astra.',
    nolanOrGwenTip: 'Gwen: “Look through that arch and you’re staring straight into a glowing nebula.”',
    hintKeywords: ['nebula', 'space', 'star', 'planet', 'caelum', 'cosmos', 'galaxy']
  },
  {
    id: 'storetrainer',
    name: 'RaggieSoft StoreTrainer',
    archwayTitle: 'The Classic Desktop Arch',
    category: 'hub',
    glyph: '💾',
    url: 'https://storetrainer.raggiesoft.com',
    hostDisplay: 'storetrainer.raggiesoft.com',
    description:
      'Step back to classic late-1990s PC nostalgia—preserving pre-AI classic games, utilities, and the vintage RaggieSoft StoreTrainer launcher.',
    nolanOrGwenTip: 'Nolan: “Beige monitors, pixel icons, and classic PC adventures from the early days!”',
    hintKeywords: ['trainer', 'game', 'retro', 'classic', 'pc', 'win98', 'quantum']
  },
  {
    id: 'corporate',
    name: 'RaggieSoft Media & Licensing',
    archwayTitle: 'The Guildhall Charter Arch',
    category: 'hub',
    glyph: '🏢',
    url: 'https://corporate.raggiesoft.com',
    hostDisplay: 'corporate.raggiesoft.com',
    description:
      'Creative Commons open-culture details, commercial music and literary licensing inquiries, and brand information for RaggieSoft Media.',
    nolanOrGwenTip: 'Gwen: “Looking for Creative Commons or commercial licensing? The Guildhall desk has you covered.”',
    hintKeywords: ['corporate', 'media', 'license', 'licensing', 'legal', 'press', 'contact', 'about']
  },
  {
    id: 'portfolio',
    name: 'Michael P. Ragsdale',
    archwayTitle: 'The Master Builder’s Workshop',
    category: 'hub',
    glyph: '👔',
    url: 'https://michaelpragsdale.com',
    hostDisplay: 'michaelpragsdale.com',
    description:
      'Creator dossier, software architecture portfolio, and build-team showcase by Michael P. Ragsdale.',
    nolanOrGwenTip: 'Nolan: “Meet the person who built every single world—and this Waystation courtyard—from scratch.”',
    hintKeywords: ['michael', 'ragsdale', 'portfolio', 'resume', 'creator', 'author', 'developer']
  }
];

export interface PageRouteSpec {
  path: string;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
}

export const WAYSTATION_ROUTES: PageRouteSpec[] = [
  {
    path: '/',
    navLabel: 'Courtyard Astrolabe',
    seoTitle: 'The Uncharted Waystation | RaggieSoft Universe Map',
    seoDescription:
      'At the end of a long fantasy adventure, barefoot siblings Nolan and Gwen Lennox welcome you to their Waystation home and guide you across RaggieSoft.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_waystation_hero.jpg`
  },
  {
    path: '/guides',
    navLabel: 'Nolan & Gwen’s Story',
    seoTitle: 'Nolan & Gwen Lennox | Keepers of the Waystation',
    seoDescription:
      'How barefoot siblings Nolan and Gwen Lennox journeyed on crutches across a 1980s fantasy world, claimed the Waystation as home, and never looked back.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_sofa_blanket_bench.jpg`
  },
  {
    path: '/realms',
    navLabel: `All ${UNIVERSE_REALMS.length} Archways`,
    seoTitle: 'Global RaggieSoft Directory | All 16 Waystation Portals',
    seoDescription:
      'The canonical global directory for RaggieSoft: search and filter all 16 outward portals across books, music, lore, desktop apps, and project stories.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/nolan_and_gwen_waystation_hero.jpg`
  }
];
