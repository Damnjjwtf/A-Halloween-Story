// Tone Library — 20 cards, seeded verbatim from the Structure Lab
// Tone Addendum §B. Registers (T1–T12) are palettes — what a scene feels
// like. Management systems (T13–T20) are engines — rules for how registers
// move, mix, and break. Both live in the same `stars` table; to avoid
// colliding with structure ids (1–34) tone cards use numeric ids 101–120
// (displayed as T1–T20). Card anatomy matches the structure library.

export type ToneType = "register" | "management";

export type ToneSystem = {
  id: number; // star id, 101–120
  code: string; // display code, "T1".."T20"
  name: string;
  type: ToneType;
  swatch: string; // one differentiator chip — a hex, not a mood board
  mechanism: string;
  engineers: string;
  example: string;
  failsWhen: string;
};

export const TONE_TYPE_LABEL: Record<ToneType, string> = {
  register: "Register",
  management: "Management",
};

export const TONE: ToneSystem[] = [
  {
    id: 101,
    code: "T1",
    name: "Amblin warmth",
    type: "register",
    swatch: "#e8b866",
    mechanism:
      "Kid-height camera, group banter, danger held inside a bubble of adult-world wonder.",
    engineers:
      "Safety-inside-adventure; nostalgia even for viewers with no such childhood.",
    example: "E.T., Stranger Things (revival mode).",
    failsWhen: "Warmth anesthetizes stakes — the bubble never actually pops.",
  },
  {
    id: 102,
    code: "T2",
    name: "Elegiac",
    type: "register",
    swatch: "#7c8aa5",
    mechanism:
      "The film mourns something while it's still on screen; retrospective voice, ending-loaded imagery.",
    engineers: "Pre-grief; every joy arrives already lost.",
    example: "Stand By Me, Moonlight (stretches).",
    failsWhen:
      "Mourning starts before the audience has anything to lose.",
  },
  {
    id: 103,
    code: "T3",
    name: "Deadpan",
    type: "register",
    swatch: "#b8b2a7",
    mechanism:
      "Flat affect against absurd or dire content; the gap is the voice.",
    engineers:
      "Complicity — the audience supplies the reaction the film withholds.",
    example: "Jarmusch, early Anderson (Bottle Rocket).",
    failsWhen: "Flatness reads as the film not caring either.",
  },
  {
    id: 104,
    code: "T4",
    name: "Dread-comedy",
    type: "register",
    swatch: "#9a6b4f",
    mechanism:
      "Laughs and threat run on the same rail; the joke never discharges the fear.",
    engineers: "Unstable laughter — am I allowed to find this funny?",
    example: "Get Out's first hour, Parasite.",
    failsWhen: "Comedy vents the pressure dread was building.",
  },
  {
    id: 105,
    code: "T5",
    name: "Social horror",
    type: "register",
    swatch: "#6b2f3a",
    mechanism:
      "The monster is policy, institution, or neighbor consensus; horror grammar applied to ordinary power.",
    engineers: "Recognition-dread — this is real somewhere.",
    example: "Get Out, The Purge's premise (rarely its execution).",
    failsWhen: "Allegory outruns character; the thesis eats the people.",
  },
  {
    id: 106,
    code: "T6",
    name: "Kitchen-sink naturalism",
    type: "register",
    swatch: "#8f8a7a",
    mechanism:
      "Unglamorized texture, ambient sound, behavior over plot beats.",
    engineers: "Trust; the world feels found, not built.",
    example: "The Florida Project, early Linklater.",
    failsWhen: "Naturalism becomes shapeless — texture with no pressure.",
  },
  {
    id: 107,
    code: "T7",
    name: "Fable / heightened",
    type: "register",
    swatch: "#c25a3a",
    mechanism:
      "Openly stylized world with its own stated rules; characters slightly larger than life.",
    engineers:
      "Permission — the audience accepts symbol and ritual without realism objections.",
    example:
      "City of God (stretches), Beasts of the Southern Wild, The Warriors.",
    failsWhen: "Heightened style licenses lazy logic.",
  },
  {
    id: 108,
    code: "T8",
    name: "Cringe-intimacy",
    type: "register",
    swatch: "#d98a9a",
    mechanism:
      "Camera refuses to cut away from social pain; embarrassment as suspense.",
    engineers: "Squirming empathy.",
    example: "Eighth Grade.",
    failsWhen: "The audience protects itself by detaching from the kid.",
  },
  {
    id: 109,
    code: "T9",
    name: "Hangout looseness",
    type: "register",
    swatch: "#c9a24b",
    mechanism:
      "Low plot pressure, high company pleasure; time spent is the point.",
    engineers: "Affection; the ensemble becomes people you know.",
    example: "Dazed and Confused.",
    failsWhen: "Looseness meets a ticking clock it refuses to feel.",
  },
  {
    id: 110,
    code: "T10",
    name: "Agitprop / satire",
    type: "register",
    swatch: "#c43f2f",
    mechanism: "The film openly argues; exaggeration as indictment.",
    engineers: "Righteous energy, quotability.",
    example:
      "Do the Right Thing (braided with naturalism), Sorry to Bother You.",
    failsWhen: "The argument is aimed at people not in the room.",
  },
  {
    id: 111,
    code: "T11",
    name: "Gothic Americana / urban folklore",
    type: "register",
    swatch: "#4a3f55",
    mechanism:
      "Local legend logic — the neighborhood has myths and the film half-believes them.",
    engineers: "Campfire attention; ambiguity between story and truth.",
    example: "Candyman (1992), The Fits.",
    failsWhen: "The film cashes the ambiguity by confirming or debunking.",
  },
  {
    id: 112,
    code: "T12",
    name: "Procedural cool",
    type: "register",
    swatch: "#5f7488",
    mechanism:
      "Systems observed with clinical patience; competence and process as spectacle.",
    engineers: "Analytical absorption; the machine is the character.",
    example: "The Wire's institutional register, Zodiac.",
    failsWhen: "Cool curdles into detachment from the kids.",
  },
  {
    id: 113,
    code: "T13",
    name: "Sustained single register",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "One register held for the full runtime; discipline is the effect.",
    engineers: "Immersion; tonal trust.",
    example: "The Florida Project.",
    failsWhen:
      "The premise contains multitudes the register can't admit — and yours does.",
  },
  {
    id: 114,
    code: "T14",
    name: "Tonal braiding (genre-shift architecture)",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "The film moves through registers in planned sequence — comedy → thriller → horror → tragedy — each shift structural, earned, irreversible.",
    engineers: "Escalating instability; the audience learns no register is safe.",
    example: "Parasite, Something Wild.",
    failsWhen:
      "Shifts read as reboots — the film “becomes a different movie” instead of revealing it always was.",
  },
  {
    id: 115,
    code: "T15",
    name: "Whiplash-as-rhythm",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "Rapid register alternation as a repeating beat, not a one-way journey; the cut between tones is the pulse.",
    engineers:
      "Alertness; laughter and dread interleaved until inseparable.",
    example: "Jojo Rabbit, Everything Everywhere.",
    failsWhen: "Whiplash becomes the content — exhausting, then numbing.",
  },
  {
    id: 116,
    code: "T16",
    name: "Irony gradient",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "A slow one-way slide along the sincerity axis — opens sincere and curdles, or opens ironic and earns sincerity.",
    engineers: "The ground shifts too slowly to notice, then all at once.",
    example:
      "The Truman Show (irony → sincerity), Nightcrawler (deadpan → horror).",
    failsWhen: "The gradient is so gentle nobody registers the arrival.",
  },
  {
    id: 117,
    code: "T17",
    name: "Register-per-space",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "Tone is mapped to geography — each zone carries its own rules; crossing a border is a tonal event before it's a plot event.",
    engineers: "The cut editorializes; space becomes emotionally legible.",
    example: "Parasite (house vs. semi-basement), Us, Wizard of Oz (the primal case).",
    failsWhen:
      "Zones calcify — suburb-always-X, city-always-Y flattens both into allegory wallpaper. The obvious loaded card for this premise — which is exactly why the Lab should complicate it, not just select it.",
  },
  {
    id: 118,
    code: "T18",
    name: "Tone-as-clock",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "Register is pegged to the ritual calendar — tone shifts at known stations (dusk, trick-or-treat window, curfew, midnight) regardless of plot position.",
    engineers: "Dread with a schedule; the audience feels time in their body.",
    example:
      "Midsommar (daylight logic as tonal law), The Purge (siren as tonal switch).",
    failsWhen:
      "The schedule overrides scene truth — tone changes on cue the drama hasn't earned.",
  },
  {
    id: 119,
    code: "T19",
    name: "Tonal POV (register follows the character)",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "Each ensemble member carries a register; the film's tone at any moment = whoever holds the POV. Tone becomes characterization and structure simultaneously.",
    engineers: "Empathy with texture — you feel the group as a chord, not a line.",
    example:
      "Moonlight's tripartite registers; The Bear (character-keyed episode tones).",
    failsWhen: "Registers are costumes — assigned, not grown from the kids.",
  },
  {
    id: 120,
    code: "T20",
    name: "Diegetic tone control",
    type: "management",
    swatch: "#2f3238",
    mechanism:
      "Tonal shifts are triggered by in-world objects and acts — masks on/off, a boombox, a costume, a candle lit in defiance; the world's own ritual instruments set the register.",
    engineers:
      "Participation; the audience learns the world's tonal controls and anticipates their use.",
    example: "Do the Right Thing (Radio Raheem's boombox), Candyman (say the name).",
    failsWhen: "The trigger becomes a button the film pushes too often.",
  },
];

export const TONE_MIN_ID = 101;
export const TONE_MAX_ID = 120;

export function isToneId(id: number): boolean {
  return id >= TONE_MIN_ID && id <= TONE_MAX_ID;
}

export function getTone(id: number): ToneSystem | undefined {
  return TONE.find((t) => t.id === id);
}
