/**
 * @license MIT
 * ============================================================================
 * src/data/realms.ts — Typed RaggieSoft Universe Archway Registry, Cast & Lore
 * Property: https://waystation.raggiesoft.com (raggiesoft-waystation)
 * ============================================================================
 * PLAIN-ENGLISH OVERVIEW (100-LEVEL TYPESCRIPT GUIDE):
 *   What is this file?
 *     This TypeScript module holds the complete, strongly typed content model
 *     for **The Uncharted Waystation** (`https://waystation.raggiesoft.com`):
 *       1. `UNIVERSE_REALMS`: All 16 outward glowing portal archways across the
 *          RaggieSoft creative ecosystem, complete with whispers from **Nolan
 *          Lennox**, **Gwen Lennox**, and **Mallory Walsh** plus typo-matching
 *          `hintKeywords` for our friendly 404 safety net.
 *       2. `WAYSTATION_KEEPERS`: Full character dossiers for our three Keepers
 *          who tumbled barefoot off Studio 205's bed into twin-moon Vaeloria
 *          and harmonized the Three-Ring Bronze Astrolabe together.
 *       3. `SUPPORTING_CAST`: The people across Tidewater Virginia (including
 *          Grandpa Walter, Ray Halstead, cabbie Denise Carter, and Nolan's
 *          manipulative ex Tammy) and Vaeloria (Bramwell Kettle, Maren, Sister
 *          Caelia, Archivist Thorne, and Cloudbrook Hollow's artisans) who
 *          shape Books One and Two.
 *       4. `TWO_WORLD_CHRONICLES`: Six illustrated milestones tracing how Book
 *          One's Tidewater Story Crossroads flow into Book Two's adventures in
 *          Vaeloria—where nights and illustrations remember everything Nolan
 *          lived through along the way.
 *       5. `WAYSTATION_ROUTES`: Pre-rendered static routes (`/`, `/guides`,
 *          `/story`, `/realms`) validated for SEO length limits at build time.
 *
 *   100-Level TypeScript Tip (`interface` & Union Types):
 *     Notice `export type RealmCategory = 'all' | 'stories' | 'music' | 'lore' | 'hub'`.
 *     In TypeScript, a string union acts like a compile-time safety guardrail:
 *     if anyone ever mistypes `'story'` instead of `'stories'`, `tsc --noEmit`
 *     catches the mistake immediately before a single HTML file is built!
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

/**
 * All 16 outward portals radiating around the Three-Ring Bronze Astrolabe.
 * Nolan, Gwen, and Mallory each share practical first-hand tips on every card.
 */
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
    nolanOrGwenTip:
      'Nolan: “Not sure where to start? Step through the main gate—everything branches out cleanly from there.”',
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
    nolanOrGwenTip:
      'Mallory: “Everything opens from one uncluttered dock with zero accounts or surprise pop-ups getting in your way.”',
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
      'Desktop studio and developer toolkit for inspecting, reviewing, and fixing digital accessibility across websites, color contrast, and timed captions.',
    nolanOrGwenTip:
      'Nolan: “Having walked miles on forearm crutches myself, building doorways everyone can move through comfortably matters—this is Michael’s flagship studio!”',
    hintKeywords: ['a11y', 'accessibility', 'studio', 'audit', 'ide', 'contrast']
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
    nolanOrGwenTip:
      'Gwen: “Want to know WHY each book, band, and app exists? Big sister Jessica tells the heart behind every single room!”',
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
    nolanOrGwenTip:
      'Gwen: “Typed book instead of books? Right through this arch—Isabel keeps the reading lamps warm, and our own Waystation novel is featured right inside!”',
    hintKeywords: [
      'book',
      'read',
      'novel',
      'story',
      'library',
      'ova',
      'ocean',
      'katie',
      'rachel',
      'aubrie',
      'drew',
      'nolan',
      'gwen',
      'mallory',
      'vaeloria'
    ]
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
    nolanOrGwenTip:
      'Mallory: “Every signpost remembers what you chose earlier—even down to how peaceful or watchful our nights feel once all three of us reach Vaeloria.”',
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
    nolanOrGwenTip:
      'Gwen: “Rain on split cedar shakes and a river of stars overhead—it’s peaceful just peeking through!”',
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
    nolanOrGwenTip:
      'Nolan: “You can hear 1980s synth-rock and symphonic chords echoing right through the runestones!”',
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
      'Meet all official Engine Room Records bands and ensembles—from Crimson Node and Firelight to Fractured Prisms, Mana Canvas, and The Paper Wall.',
    nolanOrGwenTip:
      'Mallory: “Complete band rosters, album timelines, and liner notes organized in one clean archive.”',
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
    nolanOrGwenTip:
      'Nolan: “Pure 1980s analog synth energy—honestly fits the twin moons out here pretty well!”',
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
    nolanOrGwenTip:
      'Mallory: “I love a clear, literal map where every person, campus, and transit route connects—this archive tracks them all.”',
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
    nolanOrGwenTip:
      'Nolan: “Want to know how Studio 205’s VCR clock stayed at 9:15 PM while we walked across Vaeloria? Our Backstage dossier is right inside!”',
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
    nolanOrGwenTip:
      'Gwen: “Look through that arch from our Moon-Glass Observatory and you’re staring straight into a glowing nebula.”',
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
    nolanOrGwenTip:
      'Mallory: “Nolan and I bonded in the breakroom over classic late-nineties software manuals—this arch is pure beige-monitor nostalgia!”',
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
    nolanOrGwenTip:
      'Gwen: “Looking for Creative Commons or commercial licensing? The Guildhall desk has you covered.”',
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
    nolanOrGwenTip:
      'Nolan: “Meet the person who built every single world—and this Waystation courtyard—from scratch.”',
    hintKeywords: ['michael', 'ragsdale', 'portfolio', 'resume', 'creator', 'author', 'developer']
  }
];

/**
 * Typed profile for each of the three Waystation Keepers.
 */
export interface KeeperProfile {
  id: string;
  name: string;
  statsBadge: string;
  astrolabeRing: string;
  mobilityAndGear: string;
  summary: string;
  voiceQuote: string;
}

/**
 * The three human Keepers of the Uncharted Waystation (`Nolan`, `Gwen`, and `Mallory`).
 */
export const WAYSTATION_KEEPERS: KeeperProfile[] = [
  {
    id: 'nolan',
    name: 'Nolan Lennox',
    statsBadge: 'Age 24 • 5\'7" • Older Brother',
    astrolabeRing: 'Inner Horizon Ring (Steady Pacing & Harbor Bearings)',
    mobilityAndGear:
      'Matte-silver single-tube Lofstrand forearm crutches & manual wheelchair; navy tee, Grandpa Walter’s plaid blanket',
    summary:
      'Verbal autistic, literal-spoken, and deeply loyal, Nolan spent two exhausting years off Route 13 trying to appease a controlling partner before reclaiming his voice alongside his younger sister Gwen and falling in love with honest, plain-spoken Mallory Walsh. In Keepers’ Hall, Nolan always sleeps right in the middle of the eight-foot cedar canopy bed with Gwen on one side and Mallory on the other.',
    voiceQuote:
      '“Back in Studio 205, fifty-four inches of mattress barely held two of us and twenty-two stairs stood between us and the street. Out here, nobody rushes a single step—and nobody gets left behind.”'
  },
  {
    id: 'gwen',
    name: 'Gwen Lennox',
    statsBadge: 'Age 19 • 6\'1" • Younger Sister & Nolan’s Safe Person',
    astrolabeRing: 'Outer Star-Drift Ring (Twin-Moon Orbital Math)',
    mobilityAndGear:
      'Matte-charcoal single-tube Lofstrand forearm crutches & manual wheelchair; burgundy tee, brass star-vellum compass',
    summary:
      'Six inches taller than her older brother and fiercely protective since childhood, Gwen is Nolan’s lifelong safe person—sharing deep, unhurried greeting and goodbye hugs that steady his breathing whenever the world gets loud. She welcomed Mallory into their inner circle with wholehearted sisterly pride and charted the double-moon trigonometry that woke Keepers’ Hall.',
    voiceQuote:
      '“When Mallory told Nolan and me there was an actual phrase—‘safe person’—for how Nolan and I have hugged since we were kids, everything clicked. Now Nolan has his sister on one side and his girlfriend on the other!”'
  },
  {
    id: 'mallory',
    name: 'Mallory Walsh',
    statsBadge: 'Age 24 • 5\'5" • Nolan’s Girlfriend & Gwen’s Friend',
    astrolabeRing: 'Middle Runic Logic Ring (Counter-Rotational Ciphers)',
    mobilityAndGear:
      'Able-bodied (walks without crutches or a wheelchair at Nolan & Gwen’s exact unhurried pace); copper-auburn ponytail with blue pen behind her right ear, silver wire-rimmed glasses, forest-green cardigan',
    summary:
      'Verbal autistic and refreshingly direct, former Shift Supervisor Mallory Walsh first connected with Nolan over classic computer manuals in the Emerald Creek store breakroom, helped Gwen bring Nolan safely home, and climbed twenty-two wet stairs to Studio 205 to ask Nolan out in plain literal words. When the 9:15 PM amber rift opened beside Studio 205’s bed, Mallory held tight to Nolan’s hand and crossed barefoot into Vaeloria with both siblings.',
    voiceQuote:
      '“I say exactly what I mean, and Nolan never has to guess a hidden rule around me or Gwen. Solving the Slow-Footed Order’s bronze gear ciphers together felt like coming home.”'
  }
];

/**
 * Typed profile for supporting characters across Tidewater Earth and Vaeloria.
 */
export interface SupportingCharacter {
  id: string;
  world: 'earth' | 'vaeloria';
  name: string;
  roleBadge: string;
  icon: string;
  summary: string;
}

/**
 * Supporting cast across Book One (Tidewater Virginia) and Book Two (Vaeloria).
 */
export const SUPPORTING_CAST: SupportingCharacter[] = [
  {
    id: 'walter',
    world: 'earth',
    name: 'Grandpa Walter Lennox',
    roleBadge: 'Emerald Creek Sanctuary • Late Grandfather',
    icon: '🧣',
    summary:
      'Raised Nolan and Gwen in his calm brick ranch house off Tidewater Drive—teaching both kids never to rush forearm crutches on wet steps. His green-and-navy plaid wool blanket tumbled through the 9:15 PM rift with all three Keepers.'
  },
  {
    id: 'ray',
    world: 'earth',
    name: 'Ray Halstead',
    roleBadge: 'Emerald Creek Anchor Store • Store Manager',
    icon: '🏪',
    summary:
      'Fair, steady store manager who valued Nolan’s meticulous stockroom counts, protected Nolan’s schedule when outside drama spilled toward the store, and backed Shift Supervisor Mallory Walsh and Gwen without hesitation.'
  },
  {
    id: 'denise',
    world: 'earth',
    name: 'Denise Carter',
    roleBadge: 'Norfolk Station • Cab #412 Driver',
    icon: '🚕',
    summary:
      'Kindhearted veteran Norfolk cabbie waiting outside the bus terminal who loads Nolan’s wheelchair and crutches with unhurried respect and clicks her fare meter off to make sure Nolan and Gwen get safely home.'
  },
  {
    id: 'tammy',
    world: 'earth',
    name: 'Tammy',
    roleBadge: 'Route 13 & Norfolk Terminal • Book One Foil',
    icon: '⚡',
    summary:
      'Sweet-voiced in front of strangers and sharply controlling in private, Tammy rushed twenty-one-year-old Nolan into a cramped trailer with a wobbly scrap-wood ramp and later dragged him to the Norfolk bus station on a Tuesday whim without calling forty-eight hours ahead for a wheelchair lift—sparking Book One’s first Crossroads before Mallory and Gwen shut her later food-court ambush at The Admiral Center down cold.'
  },
  {
    id: 'bramwell',
    world: 'vaeloria',
    name: 'Bramwell Kettle',
    roleBadge: 'Three-Faced Sunken Milestone • Toll-Keeper',
    icon: '🫖',
    summary:
      'Warmhearted borderland lantern-keeper in a patched wool cloak who greets barefoot Nolan, Gwen, and Mallory beside a crackling brazier with spiced pear tea, thick felted foot-wraps, and the lore of the Slow-Footed Order’s three gentle roads.'
  },
  {
    id: 'maren',
    world: 'vaeloria',
    name: 'Barge-Master Maren',
    roleBadge: 'Route 1 • Glasswater Lantern-Barge Canal',
    icon: '🛶',
    summary:
      'Steady canal pilot of the Starlight Reed whose wide, cushioned cedar deck glides through glowing sapphire-lantern locks while Gwen charts double-moon reflections overhead.'
  },
  {
    id: 'caelia',
    world: 'vaeloria',
    name: 'Sister Caelia',
    roleBadge: 'Route 2 • Whisperwood Cushion-Moss Road',
    icon: '🌿',
    summary:
      'Gentle herbalist of the Slow-Footed Order tending the three-inch-deep velvet moss causeway and ninety-eight-degree crystal mineral foot-basins along the forest road.'
  },
  {
    id: 'thorne',
    world: 'vaeloria',
    name: 'Archivist Thorne',
    roleBadge: 'Route 3 • Brass Counterweight Gondola Way',
    icon: '⚙️',
    summary:
      'Soft-spoken cliffside engineer-scholar maintaining the water-balanced oak-and-brass sky gondolas and bronze wind-harps ascending the Amber Crags without a single stair.'
  },
  {
    id: 'doran-tamsin',
    world: 'vaeloria',
    name: 'Master Doran & Baker Tamsin',
    roleBadge: 'Cloudbrook Hollow • Valley Artisans',
    icon: '🥐',
    summary:
      'Precision woodworker Doran and honey-oat hearth baker Tamsin welcome Nolan and Gwen’s Earth wheelchairs down the cliff lift into Cloudbrook Hollow’s thirty-six-inch-low slate market counters and Waterwheel Tea-Terrace.'
  }
];

/**
 * Typed milestone entry for `/story` ("Two-World Story & Crossroads").
 */
export interface StoryMilestone {
  actLabel: string;
  eraBadge: string;
  title: string;
  body: string;
  crossroadsNote: string;
  imageUrl: string;
  imageAlt: string;
  imageCaption: string;
}

/**
 * Six-act illustrated story walkthrough spanning Book One (1999–2002) and Book Two (Vaeloria).
 */
export const TWO_WORLD_CHRONICLES: StoryMilestone[] = [
  {
    actLabel: 'Act I • 1999–2001',
    eraBadge: 'Emerald Creek & Tidewater Drive',
    title: 'An Unbreakable Sibling Anchor—Tested by Missed Red Flags',
    body:
      'Growing up under Grandpa Walter’s steady roof in Tidewater Virginia, Nolan and his six-foot-one younger sister Gwen relied on each other for everything—never rushing forearm crutches on wet steps and always greeting each other with deep, unhurried hugs. At twenty-one, taking a well-meaning food-court compliment completely literally, Nolan was swept into Tammy’s rundown trailer off Route 13 across two exhausting years of walking on eggshells.',
    crossroadsNote:
      'Even during months when Tammy tried to wedge brother and sister apart, Gwen never stopped watching out for Nolan—and Shift Supervisor Mallory Walsh quietly noticed Nolan’s kindness and integrity at the Emerald Creek store.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e001/e001_c001_p001_safe_home_emerald_creek_porch.jpg`,
    imageAlt:
      'On the covered wooden front porch of Grandpa Walter’s brick ranch home in autumn, twenty-three-year-old Nolan Lennox (5-foot-7, olive jacket and jeans) and his taller sister Gwen Lennox (6-foot-1, burgundy plaid flannel and jeans) share a deep, eyes-closed safe-person hug beside Nolan’s canvas duffel bag and both pairs of matte-silver and matte-charcoal single-tube Lofstrand forearm crutches',
    imageCaption:
      'Home on Grandpa Walter’s porch: Nolan (5\'7") and younger sister Gwen (6\'1") sharing the unhurried safe-person hug that anchors their lives.'
  },
  {
    actLabel: 'Act II • August 2001',
    eraBadge: 'Book One Crossroads • Norfolk Bus Terminal',
    title: 'Ninety-Nine Dollars at Gate Four—and Four Coequal Ways Home',
    body:
      'Two months before Gwen’s eighteenth birthday, Tammy surprises twenty-three-year-old Nolan with an impulsive cross-country bus trip to Seattle—dragging him to the Norfolk Pathfinder terminal without calling forty-eight hours ahead for a wheelchair-accessible coach and expecting him to haul himself up steep metal coach stairs while his chair rides underneath in baggage.',
    crossroadsNote:
      'Three Book One Signposts: Lock both wheelchair brakes right there in Norfolk (or snap the paper ticket at Gate Four) to ride safely home in Denise Carter’s cab, or endure the westbound highway until Gwen and Mallory Walsh race across the country to bring Nolan home.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e001/e001_c001_p009_norfolk_pathfinder_ticket_line.jpg`,
    imageAlt:
      'Inside the fluorescent-lit concrete Norfolk Pathfinder bus terminal, twenty-three-year-old Nolan Lennox sits upright in his manual wheelchair with his canvas duffel across his lap and his matte-silver single-tube Lofstrand forearm crutches secured behind his backrest, looking steadily toward five-foot-tall Tammy in a light-blue zip hoodie holding paper bus tickets at the counter',
    imageCaption:
      'Book One’s first Story Crossroads inside the Norfolk bus terminal—where your choice reshapes how Nolan breaks free.'
  },
  {
    actLabel: 'Act III • 2001–2002',
    eraBadge: 'Studio 205 & The Admiral Center',
    title: 'Mallory Climbs Twenty-Two Stairs—and Tammy’s Ambush Meets a Wall',
    body:
      'After Grandpa Walter’s passing leaves Nolan and Gwen sharing an eleven-by-eighteen-foot studio with a chronically broken lobby elevator and a single full-sized bed, copper-haired Mallory Walsh climbs twenty-two stairs on a rainy Saturday afternoon, tucks her blue pen behind her ear, and asks Nolan out in plain literal words. Weeks later, when Tammy spots the three of them having lunch at The Admiral Center food court and tries one last guilt-trip ambush, Mallory and Gwen shut her down cold side by side.',
    crossroadsNote:
      'In Studio 205, Mallory also gives Nolan and Gwen the exact words—“safe person”—for what Gwen’s steady hugs have always been to Nolan, celebrating their sibling bond with zero jealousy.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e001/e001_c001_p016_admiral_center_food_court_tammy.jpg`,
    imageAlt:
      'Under the sunlit glass atrium of The Admiral Center mall food court, Nolan Lennox (seated with his matte-silver single-tube forearm crutches resting beside his chair), Mallory Walsh (holding Nolan’s hand calmly across the table in wire-rimmed glasses), and six-foot-one Gwen Lennox (seated in her manual wheelchair with her matte-charcoal forearm crutches clipped behind) present a calm, united front as Tammy stands arms-crossed beside their table',
    imageCaption:
      'United at The Admiral Center food court: Mallory and Gwen stand calmly beside Nolan, ending Tammy’s hold on his life for good.'
  },
  {
    actLabel: 'Act IV • Oct 25, 2002 (9:15 PM)',
    eraBadge: 'Book Two Crossroads • Sunken Milestone',
    title: 'Barefoot Off Studio 205’s Bed Into Twin-Moon Vaeloria',
    body:
      'On a rainy Friday night in Studio 205—forty-seven minutes into speakerphone hold over Gwen’s bent wheelchair fork, all three of them resting shoeless on the plaid-blanketed corner bed—the rain-streaked window dissolves into warm amber stained glass. Refusing to let go of one another, Nolan, Gwen, and Mallory tumble barefoot into Star-Moss Hollow with Grandpa Walter’s blanket and their four forearm crutches, meeting toll-keeper Bramwell Kettle at the Three-Faced Sunken Milestone.',
    crossroadsNote:
      'Book Two’s 3-Way Signpost: Choose Barge-Master Maren’s Glasswater Lantern-Barge Canal, Sister Caelia’s Whisperwood Cushion-Moss Road, or Archivist Thorne’s Brass Counterweight Gondola Way—all built step-free by Vaeloria’s Slow-Footed Order.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e001/e001_c002_p001_three_roads_milestone.jpg`,
    imageAlt:
      'At a twilight crossroads beneath Vaeloria’s two glowing moons, friendly cloaked toll-keeper Bramwell Kettle gestures beside a carved three-faced stone milestone and warm brazier toward three gentle paths—a sapphire lantern barge canal, a cushion-moss forest road, and a cliffside gondola—while barefoot Nolan, taller sister Gwen on their Lofstrand forearm crutches, and Mallory Walsh in her green cardigan listen together',
    imageCaption:
      'Toll-keeper Bramwell Kettle welcomes barefoot Nolan, Gwen, and Mallory to the Slow-Footed Order’s Three-Faced Sunken Milestone.'
  },
  {
    actLabel: 'Act V • 9:15 PM Frozen on Earth',
    eraBadge: 'Keepers’ Hall & Studio 205',
    title: 'Waking the Three-Ring Astrolabe & Bringing Both Wheelchairs Home',
    body:
      'Ascending into Keepers’ Hall, it takes all three of them—Nolan’s steady inner horizon ring, Mallory’s middle runic gear cipher, and Gwen’s outer twin-moon star math—to wake the Three-Ring Bronze Astrolabe. Stepping through the re-lit amber archway back into Studio 205, they gasp as the VCR clock still reads 9:15 PM and the hold music hasn’t advanced a single bar! Together they roll both wheelchairs, Grandpa Walter’s framed photo, their laptops, and Mallory’s sneakers home into Keepers’ Hall.',
    crossroadsNote:
      'Path-Aware Nights in Keepers’ Hall: On the eight-foot cedar canopy bed—always Nolan in the middle with Gwen on one side and Mallory on the other—Book Two remembers your Book One trail, rendering either deep, peaceful rest or Gwen and Mallory gently grounding Nolan through a watchful flashback.',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e001/e001_c005_p002_nine_fifteen_studio_return.jpg`,
    imageAlt:
      'Stepping from a glowing amber stained-glass portal archway back into rainy Studio 205 in Norfolk, Nolan Lennox, taller sister Gwen Lennox on their single-tube Lofstrand forearm crutches, and Mallory Walsh look in amazement at the silver VCR beneath the television still glowing green at 9:15 beside their folded wheelchairs',
    imageCaption:
      'Stepping back into Studio 205 to discover the green VCR clock still glowing at 9:15 PM—zero Earth seconds lost.'
  },
  {
    actLabel: 'Act VI • Life in Vaeloria',
    eraBadge: 'Cloudbrook Hollow & The Sixteen Portals',
    title: 'Smooth Wheelchairs in Cloudbrook Hollow & Sixteen Open Worlds',
    body:
      'With Earth waiting patiently at 9:15 PM whenever they step back to visit, Nolan, Gwen, and Mallory explore the living valley below Keepers’ Hall. Riding the water-balanced cliff lift down to Cloudbrook Hollow, Nolan and Gwen roll effortlessly side by side in their wheelchairs past Master Doran’s thirty-six-inch-low slate market counters and Baker Tamsin’s hearth ovens while Mallory walks beside them—sharing spiced pear cider on the Waterwheel Tea-Terrace before charting the Western Star-Bridges and welcoming travelers across RaggieSoft.',
    crossroadsNote:
      'Keepers’ Hall is only the beginning of their Vaeloria adventures—read all published chapters free in RaggieSoft Book Reader as Nolan, Gwen, and Mallory’s journey under the twin moons expands!',
    imageUrl: `${CDN_BASE}/raggiesoft-books/images/scenes/waystation/e002/e002_c006_p001_cloudbrook_market_wheelchairs.jpg`,
    imageAlt:
      'In the sunlit step-free stone village of Cloudbrook Hollow beneath Vaeloria’s soaring peaks, twenty-four-year-old Nolan Lennox and his six-foot-one sister Gwen Lennox roll side by side in their manual wheelchairs with their single-tube forearm crutches clipped behind their backrests while Mallory Walsh walks happily beside them past wheelchair-height artisan market stalls and warm lanterns',
    imageCaption:
      'Rolling side by side through Cloudbrook Hollow’s wheelchair-height artisan stalls with Mallory walking right beside them.'
  }
];

export interface PageRouteSpec {
  path: string;
  navLabel: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  ogImageAlt: string;
}

/**
 * Canonical pre-rendered routes for `https://waystation.raggiesoft.com`.
 * Every route points to a dedicated `1200x630` (`1.91:1`) OpenGraph & Twitter Card
 * social preview banner hosted on `assets.raggiesoft.com`, strictly obeying
 * `seoTitle <= 60` chars and `seoDescription <= 155` chars.
 */
export const WAYSTATION_ROUTES: PageRouteSpec[] = [
  {
    path: '/',
    navLabel: 'Courtyard Astrolabe',
    seoTitle: 'The Uncharted Waystation | RaggieSoft Universe Map',
    seoDescription:
      'Barefoot Keepers Nolan and Gwen Lennox and Mallory Walsh welcome you to their 1980s fantasy Waystation home and guide you across RaggieSoft.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/og/waystation/waystation-home-og.jpg`,
    ogImageAlt:
      'The Uncharted Waystation social card showing Nolan Lennox (5\'7"), his taller sister Gwen Lennox (6\'1"), and girlfriend Mallory Walsh (5\'5") on the Star-Court parapet beside the Three-Ring Bronze Astrolabe, glowing archway, and their single-tube Lofstrand forearm crutches under twin moons.'
  },
  {
    path: '/guides',
    navLabel: 'Keepers & Cast',
    seoTitle: 'Nolan, Gwen, Mallory & Cast | The Uncharted Waystation',
    seoDescription:
      'Meet Keepers Nolan and Gwen Lennox and Mallory Walsh, plus Tammy and the Tidewater and Vaeloria cast from The Uncharted Waystation.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/og/waystation/waystation-guides-og.jpg`,
    ogImageAlt:
      'Nolan, Gwen, and Mallory social card showing the three barefoot Keepers cuddled closely under Grandpa Walter’s green-and-navy plaid wool blanket on a mossy cedar log under Vaeloria’s twin moons with Nolan in the middle beside their forearm crutches.'
  },
  {
    path: '/story',
    navLabel: 'Two-World Story',
    seoTitle: 'Two-World Story & Crossroads | The Uncharted Waystation',
    seoDescription:
      'Follow Nolan, Gwen, and Mallory from Norfolk’s bus station and Studio 205 across the 9:15 PM amber rift into twin-moon Vaeloria.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/og/waystation/waystation-home-og.jpg`,
    ogImageAlt:
      'Two-World Story social card showing Nolan Lennox, taller sister Gwen Lennox, and girlfriend Mallory Walsh beside the Three-Ring Bronze Astrolabe and glowing portal archway under twin moons.'
  },
  {
    path: '/realms',
    navLabel: `All ${UNIVERSE_REALMS.length} Archways`,
    seoTitle: 'Global RaggieSoft Directory | All 16 Waystation Portals',
    seoDescription:
      'The canonical global directory for RaggieSoft: search and filter all 16 outward portals across books, music, lore, desktop apps, and project stories.',
    ogImage: `${CDN_BASE}/raggiesoft-books/images/og/waystation/waystation-realms-og.jpg`,
    ogImageAlt:
      'Global RaggieSoft Directory social card depicting sixteen glowing carved runestone portal archways surrounding the golden-brass Waystation Astrolabe beneath Vaeloria’s twin moons.'
  }
];
