// Oblique Strategies — a curveball deck (Knowledge Doc §2B.8).
// One random directive can be dealt into a synthesis run as a HARD
// constraint, to push the engine somewhere it wouldn't have gone on its
// own. These are structural provocations, keyed to A Halloween Story's
// fixed premise (ritual clock, city/suburb border, ensemble) — not mood
// notes. Each must survive as a constraint the engine can actually obey.

export type ObliqueCard = {
  id: number;
  text: string;
};

export const OBLIQUE: ObliqueCard[] = [
  { id: 1, text: "Tell it out of order. The ritual clock runs, but the audience meets its stations shuffled." },
  { id: 2, text: "Give the border a point of view. Let the gradient between city and suburb narrate." },
  { id: 3, text: "Remove the most-starred system. Build the box without your favourite ingredient." },
  { id: 4, text: "Make the ensemble one body. Treat the group as a single organism, never named individually." },
  { id: 5, text: "The clock runs backwards. Halloween is the start, not the deadline." },
  { id: 6, text: "Withhold the map. The audience never learns the geography the kids already know." },
  { id: 7, text: "Repeat one unit until it breaks. Find the smallest repeatable beat and loop it past comfort." },
  { id: 8, text: "Let enforcement keep the calendar. Structure the story from the side that cancelled Halloween." },
  { id: 9, text: "No returns. Every border crossing is one-way; nobody goes home the way they came." },
  { id: 10, text: "Two clocks, out of phase. Run the suburb's Halloween and the city's countdown on different time." },
  { id: 11, text: "Make the smallest character load-bearing. The least-important kid carries the structure." },
  { id: 12, text: "Cut the connective tissue. Hard cuts only — no transitions, no establishing, no bridges." },
  { id: 13, text: "Honour thy error as a hidden intention. Take the weakest answer and make it the spine." },
  { id: 14, text: "The ritual is the antagonist. Let the observance itself apply the pressure, not the enforcers." },
  { id: 15, text: "One location, whole story. Collapse the city/suburb gradient into a single contested threshold." },
  { id: 16, text: "Knowledge flows only downhill. Information can cross the border in one direction and never back." },
  { id: 17, text: "End on the quietest possible beat. Structure toward the smallest station, not the largest." },
  { id: 18, text: "Change nothing and continue consistently. Pick one rule and refuse every exception to it." },
  { id: 19, text: "Give the dead the schedule. Let what's absent set the tempo the living move to." },
  { id: 20, text: "Trust the ensemble to fracture. Build so the group must split, and never fully reassemble." },
];

export function randomOblique(): ObliqueCard {
  return OBLIQUE[Math.floor(Math.random() * OBLIQUE.length)];
}
