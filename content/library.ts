// Structure Library — 34 systems, seeded verbatim from the Structure Lab
// Knowledge Doc §1 (30) + Library Expansion v1 (31–34). Each card: mechanism
// (how it works) / engineers (the audience state it manufactures) / example
// / failsWhen.

export type Family =
  | "LINEAR"
  | "NONLINEAR"
  | "ITERATIVE"
  | "ENSEMBLE"
  | "SPATIAL"
  | "POV"
  | "MODULAR"
  | "META"
  | "RECURSIVE";

export const FAMILY_LABEL: Record<Family, string> = {
  LINEAR: "Linear",
  NONLINEAR: "Nonlinear / Temporal",
  ITERATIVE: "Iterative",
  ENSEMBLE: "Ensemble / Social",
  SPATIAL: "Spatial",
  POV: "POV / Epistemic",
  MODULAR: "Modular / Participatory",
  META: "Meta",
  RECURSIVE: "Recursive",
};

export type StructureSystem = {
  id: number; // catalog index 1–34, referenced by Star.systemId
  name: string;
  family: Family;
  mechanism: string;
  engineers: string;
  example: string;
  failsWhen: string;
  /** Optional premise-specific guidance for the Lab (how this system bears
      on THIS film's fixed constraints) — surfaced in the synthesis prompt
      when the card is starred. */
  labNote?: string;
};

export const SYSTEMS: StructureSystem[] = [
  {
    id: 1,
    name: "Three-Act (Syd Field paradigm)",
    family: "LINEAR",
    mechanism:
      "Setup → confrontation → resolution, hinged on two plot points.",
    engineers: "Escalation, momentum.",
    example: "Most studio features.",
    failsWhen:
      "Escalation is the only value; middle sags; consequence feels pre-scheduled.",
  },
  {
    id: 2,
    name: "Hero's Journey (Campbell → Vogler)",
    family: "LINEAR",
    mechanism: "Departure–initiation–return through mythic stations.",
    engineers: "Recognition, mythic resonance.",
    example: "Star Wars.",
    failsWhen:
      "Applied as checklist; single-protagonist bias fights ensemble stories.",
  },
  {
    id: 3,
    name: "Save the Cat beat sheet (Snyder)",
    family: "LINEAR",
    mechanism: "15 beats pegged to page numbers.",
    engineers: "Legibility, pace discipline.",
    example: "Much of 2000s–2010s studio comedy.",
    failsWhen:
      "It sterilizes unpredictability — the beats become audible.",
  },
  {
    id: 4,
    name: "Story Circle (Harmon)",
    family: "LINEAR",
    mechanism:
      "8-step need/search/find/take/return loop; Campbell compressed for serialized TV.",
    engineers:
      "Satisfying unit-completion at any scale (scene, episode, season).",
    example: "Community, Rick and Morty.",
    failsWhen:
      "Every unit resolves too cleanly; the loop flattens long-arc consequence.",
  },
  {
    id: 5,
    name: "Sequence Method (8-sequence / Frank Daniel tradition)",
    family: "LINEAR",
    mechanism:
      "Film as eight ~12-minute mini-movies, each with its own tension question.",
    engineers: "Continuous local suspense.",
    example: "Classic Hollywood; taught at USC.",
    failsWhen: "Seams show; sequences resolve without accumulating.",
  },
  {
    id: 6,
    name: "Freytag Pyramid (five-act)",
    family: "LINEAR",
    mechanism:
      "Rising action → climax → falling action; tragedy-shaped.",
    engineers: "Dread of the fall; aftermath weight.",
    example: "Classical tragedy, Breaking Bad's macro-shape.",
    failsWhen:
      "Modern audiences read post-climax material as “too long.”",
  },
  {
    id: 7,
    name: "Kishōtenketsu (ki-shō-ten-ketsu)",
    family: "LINEAR",
    mechanism:
      "Introduction → development → TWIST/turn (non-conflict recontextualization) → reconciliation. Conflict is not the engine; recontextualization is.",
    engineers: "Quiet surprise, meaning-shift.",
    example:
      "Much of Ozu; many Ghibli films; 4-panel manga. Perfect Days, Paterson (stronger slice-of-life cases).",
    failsWhen:
      "Western audiences trained on conflict read it as “nothing happens.”",
  },
  {
    id: 8,
    name: "Achronological rearrangement",
    family: "NONLINEAR",
    mechanism:
      "Scenes shuffled out of chronology so juxtaposition, not sequence, creates meaning.",
    engineers: "Pattern-hunting pleasure; retroactive shock.",
    example: "Pulp Fiction.",
    failsWhen:
      "Rearrangement is decorative — same story, shuffled for flavor.",
  },
  {
    id: 9,
    name: "Reverse chronology",
    family: "NONLINEAR",
    mechanism:
      "Effect before cause; the audience knows outcomes and hunts origins.",
    engineers:
      "Dread + tragic irony (we know how this ends because we started there).",
    example: "Memento, Betrayal (Pinter), Irréversible.",
    failsWhen:
      "The gimmick outlives the reason; reverse order must BE the theme.",
  },
  {
    id: 10,
    name: "Dual/braided timeline",
    family: "NONLINEAR",
    mechanism:
      "Two (or more) timelines intercut so each reframes the other; convergence is the climax.",
    engineers: "Rhyme, dramatic irony, revelation-by-collision.",
    example: "The Godfather Part II, Arrival.",
    failsWhen:
      "One strand is obviously weaker and the audience resents returning to it.",
  },
  {
    id: 11,
    name: "Real-time",
    family: "NONLINEAR",
    mechanism: "Story time = screen time; no ellipsis.",
    engineers: "Claustrophobic urgency; the clock is diegetic.",
    example:
      "24, Victoria, Rope (simulated). Cléo from 5 to 7 (cleaner feature case).",
    failsWhen: "Real time forces filler; downtime can't be cut.",
  },
  {
    id: 12,
    name: "In-medias-res frame / flashback spine",
    family: "NONLINEAR",
    mechanism:
      "Open at crisis, spend the story explaining how we got here; frame closes at the end.",
    engineers: "A promised destination; retrospective inevitability.",
    example:
      "Sunset Boulevard, Fight Club, most pilots since Breaking Bad.",
    failsWhen:
      "The frame is a trailer for the movie you're already watching.",
  },
  {
    id: 13,
    name: "Ticking clock / deadline structure",
    family: "NONLINEAR",
    mechanism:
      "A hard temporal limit governs all scene pressure; structure = countdown segments.",
    engineers: "Compounding urgency.",
    example: "High Noon, Uncut Gems (soft clock).",
    failsWhen:
      "The deadline is fake — extendable clocks teach the audience to stop believing.",
  },
  {
    id: 14,
    name: "Loop / iteration",
    family: "ITERATIVE",
    mechanism:
      "The same time-span repeats with variation; the delta between runs IS the story.",
    engineers:
      "Mastery pleasure; the audience learns the level like a game.",
    example:
      "Groundhog Day, Run Lola Run, Edge of Tomorrow, Russian Doll.",
    failsWhen:
      "Iterations don't escalate meaning — repetition without progressive revelation.",
  },
  {
    id: 15,
    name: "Cumulative structure (folk-tale stacking)",
    family: "ITERATIVE",
    mechanism:
      "Each unit repeats all prior units plus one; memory of the chain is the pleasure.",
    engineers: "Ritual participation, chant-like anticipation.",
    example:
      "Fairy/folk tale tradition (“The House That Jack Built”); The Bear's list-like anxiety stacking is adjacent.",
    failsWhen: "The stack outgrows working memory.",
  },
  {
    id: 16,
    name: "Theme-and-variation / fugue",
    family: "ITERATIVE",
    mechanism:
      "One motif restated across characters, eras, or genres; unity is thematic, not causal.",
    engineers:
      "Pattern recognition across distance; “everything is connected” without literal plot links.",
    example: "Cloud Atlas, The Hours.",
    failsWhen:
      "Variations are illustrations of a thesis rather than stories.",
  },
  {
    id: 17,
    name: "Hyperlink / network narrative",
    family: "ENSEMBLE",
    mechanism:
      "Many strands, incidental crossings; the city or system is the protagonist.",
    engineers: "Sociological awe; coincidence as fate.",
    example: "Short Cuts, Magnolia, Traffic.",
    failsWhen: "Crossings feel authored; the network preaches.",
  },
  {
    id: 18,
    name: "Ensemble rotation (POV chapters)",
    family: "ENSEMBLE",
    mechanism:
      "Strict rotation of perspective per episode/chapter through one shared event-world.",
    engineers: "Empathy redistribution; no one owns the truth.",
    example:
      "Game of Thrones (novels), The Wire's institutional rotation.",
    failsWhen:
      "Audiences rank the POVs and skim the “bad” ones.",
  },
  {
    id: 19,
    name: "Relay / baton-pass structure",
    family: "ENSEMBLE",
    mechanism:
      "The narrative follows an object, place, or handoff from character to character; no returning.",
    engineers:
      "The world feels bigger than any protagonist; radical democracy of attention.",
    example: "Slacker, La Ronde, Twenty Bucks.",
    failsWhen:
      "No accumulation — each handoff resets investment to zero.",
  },
  {
    id: 20,
    name: "Institutional / procedural serial hybrid",
    family: "ENSEMBLE",
    mechanism:
      "Case-of-the-week engine inside a serialized arc; two clocks running at different speeds.",
    engineers: "Episodic satisfaction + long-arc loyalty.",
    example: "The Wire, X-Files, Justified.",
    failsWhen:
      "The two clocks fight — mythology episodes vs. standalone episodes split the audience.",
  },
  {
    id: 21,
    name: "Odyssey / traversal (“night journey across hostile territory”)",
    family: "SPATIAL",
    mechanism:
      "Structure = a map; acts are territories; progress is geographic.",
    engineers:
      "Experiential movement; each zone has its own rules and tone.",
    example: "The Warriors, After Hours, O Brother. Homer, obviously.",
    failsWhen:
      "Episodic zones don't transform the travelers — a theme park ride.",
  },
  {
    id: 22,
    name: "Bottle / single location",
    family: "SPATIAL",
    mechanism:
      "Spatial confinement forces structure from social pressure, not movement.",
    engineers: "Claustrophobia; relationships as the only terrain.",
    example: "12 Angry Men, Rear Window.",
    failsWhen: "Contrivance shows — why don't they just leave?",
  },
  {
    id: 23,
    name: "Parallel-space convergence",
    family: "SPATIAL",
    mechanism:
      "Separated spaces (city/suburb, upstairs/downstairs, inside/outside the wall) developed in parallel until forced contact.",
    engineers:
      "Comparative meaning; the cut itself editorializes.",
    example: "Parasite, Us, Snowpiercer (linearized).",
    failsWhen: "The spaces are allegory-first, people-second.",
  },
  {
    id: 24,
    name: "Rashomon multi-account",
    family: "POV",
    mechanism:
      "The same event retold through incompatible testimonies; truth is the negative space.",
    engineers: "Epistemic vertigo; the audience becomes the judge.",
    example: "Rashomon, The Last Duel, Gone Girl (popular dueling-accounts case).",
    failsWhen:
      "One account is signaled as “the real one,” collapsing the machine.",
  },
  {
    id: 25,
    name: "Restricted-knowledge / mystery box",
    family: "POV",
    mechanism:
      "Information withheld is the engine; questions open faster than they close.",
    engineers:
      "Obsessive curiosity, theory-making, community speculation.",
    example: "Lost, Severance.",
    failsWhen:
      "Narrative debt exceeds narrative credit — payoff insolvency.",
  },
  {
    id: 26,
    name: "Unreliable narration / corrupted record",
    family: "POV",
    mechanism:
      "The telling itself is compromised (memory, ideology, damage); structure = the corruption pattern.",
    engineers: "Rereading impulse; paranoia toward the text.",
    example:
      "Memento (again — it double-dips), The Usual Suspects, House of Leaves.",
    failsWhen: "Unreliability is a twist rather than a texture.",
  },
  {
    id: 27,
    name: "Anthology / portmanteau with a binding device",
    family: "MODULAR",
    mechanism:
      "Discrete stories bound by frame, place, night, or object; the binder does the thematic work.",
    engineers: "Variety + ritual return to the frame.",
    example: "Trick 'r Treat (Halloween-native!), Dead of Night, V/H/S.",
    failsWhen:
      "Segments vary wildly in quality and the frame can't hold them.",
  },
  {
    id: 28,
    name: "Database / modular narrative",
    family: "MODULAR",
    mechanism:
      "Story exists as fragments; order of encounter is variable or user-driven; coherence emerges from indexing.",
    engineers:
      "Detective agency in the audience; the archive as story-space.",
    example:
      "Her Story (game), 253 (hypertext novel). Film analogue: any picture built to be decoded on rewatch.",
    failsWhen:
      "Fragments reward assembly but the assembled picture is banal.",
  },
  {
    id: 29,
    name: "Ritual-calendar structure",
    family: "MODULAR",
    mechanism:
      "A culturally shared schedule (holiday, festival, liturgy, season) supplies the beat-map; the audience arrives already knowing the clock.",
    engineers:
      "Anticipation of known stations; deviation from the ritual reads as violation.",
    example:
      "A Christmas Story, Groundhog Day (double-dips), Midsommar (festival stations as act breaks).",
    failsWhen:
      "The calendar is set dressing instead of load-bearing.",
  },
  {
    id: 30,
    name: "Frame-break / metafiction",
    family: "META",
    mechanism:
      "The telling apparatus enters the story; structure includes its own commentary layer.",
    engineers:
      "Complicity, self-awareness, cross-diegetic play.",
    example:
      "Adaptation, The Princess Bride's frame, Deadpool at its cheapest.",
    failsWhen: "Cleverness substitutes for stakes.",
  },
  {
    id: 31,
    name: "Diptych",
    family: "MODULAR",
    mechanism:
      "Two distinct halves that form one whole — a hard structural break splits the film into panels that rhyme, invert, or reframe each other. Not two timelines braided (dual/braided timeline) and not two spaces intercut (parallel-space convergence); the halves are sequential and self-contained, and the SEAM is the meaning.",
    engineers:
      "The click of recognition when panel two recontextualizes panel one; a break that makes the audience re-read what they've seen.",
    example:
      "Psycho (the shower as hinge), Full Metal Jacket (boot camp / Vietnam), Mulholland Dr. (dream panel / waking panel).",
    failsWhen:
      "The two halves don't need each other — a strong half married to a weak one reads as two films stapled together.",
    labNote:
      "The canceled-city / permitted-suburb divide is a native diptych. The load-bearing question: what is the SEAM — the single hinge event that splits the film into its two panels — and does panel two make us re-read panel one?",
  },
  {
    id: 32,
    name: "Mosaic",
    family: "ENSEMBLE",
    mechanism:
      "Multiple disconnected storylines bound by PLACE or THEME rather than by a shared causal event. Distinct from Hyperlink, where strangers are linked by one incident; here the tiles may never causally touch — coherence is the portrait of a place or idea they collectively assemble.",
    engineers:
      "Sociological/atmospheric wholeness; the city or theme as the real protagonist; cumulative rather than convergent meaning.",
    example: "Nashville, Do the Right Thing, Slacker.",
    failsWhen:
      "The tiles are too even — no figure emerges from the ground; a collage of equally-weighted nothing.",
    labNote:
      "Keep three ensemble engines distinct in synthesis: Hyperlink = one event links strangers (convergence). Relay = attention hands off and never returns (linear traversal). Mosaic = tiles bound by place/theme, connection optional (accretion). Do not merge them.",
  },
  {
    id: 33,
    name: "Nested / Russian Doll",
    family: "RECURSIVE",
    mechanism:
      "Stories contained inside stories, matryoshka-style — you enter one narrative, which opens into another, which opens into another; descent (and return) through frame layers is the structure. Distinct from Frame-break/metafiction, where the apparatus comments on itself; here the nesting is the architecture, not the joke.",
    engineers:
      "Vertigo of depth; the pleasure of descent and the question of whether we climb back out; each layer recolors the ones above it.",
    example:
      "The Saragossa Manuscript, Cloud Atlas (nesting + variation), The Grand Budapest Hotel (frames within frames within frames).",
    failsWhen:
      "The layers don't pay rent — depth for its own sake; the audience loses which doll they're in and stops caring about the outermost.",
  },
  {
    id: 34,
    name: "Möbius loop",
    family: "RECURSIVE",
    mechanism:
      "A circular narrative that closes back onto its own beginning with no clean start or end — but the return is not identical; the traveler (or the audience's understanding) is changed by the loop. Distinct from Loop/iteration, which repeats a span multiple times, and from Reverse chronology, which runs linearly backward: the Möbius runs forward into its own origin.",
    engineers:
      "The uncanny closed causal loop; inevitability and entrapment; the compulsion to rewatch to find the join.",
    example: "La Jetée, Timecrimes, Lost Highway.",
    failsWhen:
      "The loop is a shrug — closure without change; a circle the audience clocks as a gimmick rather than a trap that means something.",
    labNote:
      "The ritual clock invites a Möbius close — midnight folding back to dusk with the kids changed. Risk: a Möbius on the Halloween calendar can read as \"it was all a dream / it repeats forever\"; the departure must be earned, per this card's own failure mode.",
  },
];

export function getSystem(id: number): StructureSystem | undefined {
  return SYSTEMS.find((s) => s.id === id);
}
