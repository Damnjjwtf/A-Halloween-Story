// Workbook question bank — seeded verbatim from the Structure Lab
// Knowledge Doc §3. Both users answer everything independently before
// Compare. Answers become synthesis inputs verbatim.
//
// Section 7 is answered in the Library view (M2) and ships deferred.

export type Question = {
  id: string; // natural key, e.g. "4.1" — Answer.questionId references this
  prompt: string;
  helpText?: string;
};

export type Section = {
  id: string; // "1".."8" — used in the /workbook/[sectionId] route
  index: string; // display index, e.g. "01"
  title: string;
  deferred?: boolean; // true = locked until a later milestone
  deferredNote?: string;
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
    deferred: true,
    deferredNote:
      "Answered in the Library view — star 4–8 systems, one line each on what they contribute, then force-pair two from different families. Arrives with M2.",
    questions: [
      {
        id: "7.1",
        prompt: "Star 4–8 systems from the Library.",
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
];

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

/** Question ids that count toward progress (deferred sections excluded). */
export function activeQuestionIds(sectionId?: string): string[] {
  return SECTIONS.filter(
    (s) => !s.deferred && (sectionId === undefined || s.id === sectionId),
  ).flatMap((s) => s.questions.map((q) => q.id));
}
