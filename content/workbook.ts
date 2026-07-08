// Workbook question bank — seeded verbatim from the Structure Lab
// Knowledge Doc §3. Both users answer everything independently before
// Compare. Answers become synthesis inputs verbatim.
//
// Section 7 is answered in the Library view (M2) and ships deferred.

export type Question = {
  id: string; // natural key, e.g. "4.1" — Answer.questionId references this
  prompt: string;
  helpText?: string;
  /** When set, this question is answered by starring in the Library
      (no textarea) — "structure" reads structure stars, "tone" reads
      tone stars. e.g. 7.1 (structure), 10.3 (tone). */
  starPrompt?: "structure" | "tone";
};

export type Section = {
  id: string; // "1".."10" — used in the /workbook/[sectionId] route
  index: string; // display index, e.g. "01"
  title: string;
  questions: Question[];
};

export const SECTIONS: Section[] = [
  {
    id: "1",
    index: "01",
    title: "Novelty target",
    questions: [
      {
        id: "1.1",
        prompt:
          "What kind of “new” do you actually want: new emotional rhythm, new sequence logic, new POV mechanics, new audience experience, new structural engine? Pick a primary and a secondary.",
        helpText: "Name a primary, then a secondary.",
      },
      {
        id: "1.2",
        prompt:
          "Name three works whose structural moves you envy, and state the move in one sentence each (not the plot — the move).",
      },
      {
        id: "1.3",
        prompt:
          "Name one acclaimed structural experiment you think FAILED, and why.",
      },
    ],
  },
  {
    id: "2",
    index: "02",
    title: "Reaction against",
    questions: [
      {
        id: "2.1",
        prompt:
          "What do current coming-of-age ensemble films do structurally that you refuse to do?",
      },
      {
        id: "2.2",
        prompt:
          "What audience reflex do you most want to deny or delay (comfort, resolution, ranking a favorite kid, knowing the rules)?",
      },
      {
        id: "2.3",
        prompt: "What’s the most tired beat in Halloween-set movies?",
      },
    ],
  },
  {
    id: "3",
    index: "03",
    title: "Emotional engineering",
    questions: [
      {
        id: "3.1",
        prompt:
          "List, in order, the three audience states the film should manufacture across its runtime (e.g., ritual anticipation → dread → grief-tinged release).",
      },
      {
        id: "3.2",
        prompt:
          "What should the audience be doing mentally in the middle of the film — hunting patterns, dreading a clock, choosing sides, mapping a city?",
      },
      {
        id: "3.3",
        prompt:
          "What feeling should they leave with that the premise uniquely earns?",
      },
    ],
  },
  {
    id: "4",
    index: "04",
    title: "The clock and the border",
    questions: [
      {
        id: "4.1",
        prompt:
          "The Halloween ritual calendar (dusk → trick-or-treat window → curfew → midnight): which stations does the film keep, which does the martial-law regime cancel, and which do the kids observe in secret?",
        helpText: "Your answer is a beat-map draft.",
      },
      {
        id: "4.2",
        prompt:
          "Is the border crossed once (odyssey), repeatedly (relay/iteration), or held in parallel until forced contact (convergence)? Gut answer, then argue against yourself in one sentence.",
      },
      {
        id: "4.3",
        prompt:
          "Who owns time in this world — the state (curfew), the ritual (midnight), or the kids (stolen time)? Can ownership change hands as a structural event?",
      },
    ],
  },
  {
    id: "5",
    index: "05",
    title: "Ensemble mechanics",
    questions: [
      {
        id: "5.1",
        prompt:
          "How many kids, and does the audience track them as one organism, rotating POVs, or a relay?",
      },
      {
        id: "5.2",
        prompt:
          "Is there a forbidden POV — someone we’re never inside (a parent, a soldier, the city itself)? Why?",
      },
      {
        id: "5.3",
        prompt:
          "What splits the group, structurally — geography, belief, a rule one of them breaks?",
      },
    ],
  },
  {
    id: "6",
    index: "06",
    title: "Legibility budget",
    questions: [
      {
        id: "6.1",
        prompt:
          "On first viewing, what must a tired audience member NEVER lose track of?",
      },
      {
        id: "6.2",
        prompt:
          "What are you willing to let them be confused about, and for how long?",
      },
      {
        id: "6.3",
        prompt:
          "Commercial-fresh ↔ totally alien: mark the dial, then state the one legibility rule you will never break.",
        helpText:
          "State where you sit on the dial in your own words, then the rule.",
      },
    ],
  },
  {
    id: "7",
    index: "07",
    title: "Ingredients",
    questions: [
      {
        id: "7.1",
        prompt: "Star 4–8 systems from the Library.",
        helpText: "Answered by starring in the Library view, not here.",
        starPrompt: "structure",
      },
      {
        id: "7.2",
        prompt:
          "For each star, one line: what it contributes to THIS premise.",
      },
      {
        id: "7.3",
        prompt:
          "Force-pair: pick two starred systems from different families and guess what their hybrid would demand of the premise. (Bisociation warm-up — wrong answers welcome.)",
      },
    ],
  },
  {
    id: "8",
    index: "08",
    title: "Ontology",
    questions: [
      {
        id: "8.1",
        prompt:
          "Rank these as what story fundamentally is, for this project: causal / thematic / emotional / mythic / spatial / social / informational / experiential. Top three only.",
        helpText: "Answers weight the pairing engine.",
      },
      {
        id: "8.2",
        prompt:
          "If your #1 is spatial, the film trends toward ritual urban odyssey; if informational, toward mystery architecture; if mythic, toward ritual-calendar. Do you accept where your ranking points, or does it surprise you?",
      },
    ],
  },
  {
    id: "9",
    index: "09",
    title: "Tonal targets",
    questions: [
      {
        id: "9.1",
        prompt:
          "Name three films whose TONE you envy for this project, and state the tonal move in one sentence each (the move, not the vibe).",
      },
      {
        id: "9.2",
        prompt:
          "What tone would be the obvious choice for this premise — and are you refusing it or embracing it? (Answer honestly; refusing the obvious is not automatically the move.)",
      },
      {
        id: "9.3",
        prompt:
          "What is this film never allowed to feel like, even for one scene? (Your tonal kill-rule. The synthesis engine treats this as hard constraint.)",
        helpText: "Injected into the Lab as a hard constraint.",
      },
      {
        id: "9.4",
        prompt:
          "The martial-law material and the kid material want different registers. Name the register each wants, then decide: braid, whiplash, gradient, or collision?",
      },
    ],
  },
  {
    id: "10",
    index: "10",
    title: "Tone × structure interaction",
    questions: [
      {
        id: "10.1",
        prompt:
          "Does tone follow space (city feels different from suburb), time (dusk feels different from midnight), or people (each kid carries a register)? Rank all three — your ranking weights the tone-logic parameter.",
      },
      {
        id: "10.2",
        prompt:
          "Pick one moment-type where tone should CONTRADICT structure (e.g., the structural climax played in the quietest register). Why there?",
      },
      {
        id: "10.3",
        prompt: "Star 3–5 tone cards in the Library.",
        helpText:
          "Answered by starring TONE cards in the Library view, not here.",
        starPrompt: "tone",
      },
      {
        id: "10.4",
        prompt:
          "Force-pair one tone management system (T13–T20) with one structure system from a different family. What would the hybrid demand?",
      },
    ],
  },
];

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

/** Question ids answerable by free text (star-prompt questions excluded). */
export function activeQuestionIds(sectionId?: string): string[] {
  return SECTIONS.filter(
    (s) => sectionId === undefined || s.id === sectionId,
  ).flatMap((s) =>
    s.questions.filter((q) => !q.starPrompt).map((q) => q.id),
  );
}
