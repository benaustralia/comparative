export const FORMS = {
  prose: {
    label: "Prose Fiction",
    options: [
      { id: 'novel', label: 'Novel', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      { id: 'novella', label: 'Novella', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { id: 'anthology', label: 'Short Story Collection', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
    ]
  },
  screen: {
    label: "Film & Screen",
    options: [
      { id: 'film', label: 'Feature Film', color: 'bg-orange-50 text-orange-700 border-orange-200' },
      { id: 'docu', label: 'Documentary', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { id: 'short_film', label: 'Short Film', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
      { id: 'series', label: 'Miniseries / TV', color: 'bg-red-50 text-red-700 border-red-200' }
    ]
  },
  stage: {
    label: "Theatre",
    options: [
      { id: 'play', label: 'Play Script', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { id: 'musical', label: 'Musical', color: 'bg-teal-50 text-teal-700 border-teal-200' }
    ]
  },
  visual: {
    label: "Visual Text",
    options: [
      { id: 'gn', label: 'Graphic Novel', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      { id: 'pic_book', label: 'Picture Book', color: 'bg-pink-50 text-pink-700 border-pink-200' }
    ]
  },
  reality: {
    label: "Non-Fiction",
    options: [
      { id: 'memoir', label: 'Memoir', color: 'bg-slate-50 text-slate-700 border-slate-200' },
      { id: 'bio', label: 'Biography', color: 'bg-stone-50 text-stone-700 border-stone-200' },
      { id: 'essay', label: 'Essay Collection', color: 'bg-zinc-50 text-zinc-700 border-zinc-200' }
    ]
  }
};

export const FORM_LOOKUP = Object.values(FORMS).flatMap(g => g.options).reduce((acc, opt) => ({...acc, [opt.id]: opt}), {});

export const TECHS = {
  novel: ['First Person', 'Third Person', 'Metaphor', 'Simile', 'Symbolism', 'Motif', 'Imagery', 'Tone'],
  novella: ['First Person', 'Third Person', 'Metaphor', 'Symbolism', 'Compressed Timeline'],
  anthology: ['Thematic Echo', 'Motif Repetition', 'Linear', 'Non-linear', 'Circular Narrative', 'Frame Story'],
  film: ['Close-up', 'Long Shot', 'Dutch Angle', 'Tracking Shot', 'Diegetic Sound', 'Non-diegetic Score', 'Lighting', 'Montage'],
  docu: ['Talking Head', 'Archival Footage', 'Voice-over', 'Statistics', 'Expert Interview', 'Reconstruction'],
  short_film: ['Minimalism', 'Close-up', 'Ambient Sound', 'Single Location', 'Twist Ending'],
  series: ['Episode Arc', 'Season Arc', 'Cliffhanger', 'Cold Open', 'Flashback', 'Parallel Plot'],
  play: ['Soliloquy', 'Monologue', 'Aside', 'Stage Directions', 'Lighting Cues', 'Prop Usage', 'Silence'],
  musical: ['Leitmotif', 'Diegetic Song', 'Ensemble Number', 'Reprise', 'Underscoring'],
  gn: ['Gutter', 'Splash Page', 'Bleed', 'Emanata', 'Graphic Weight', 'Salience', 'Vectors', 'Speech Balloon'],
  pic_book: ['Visual-Textual Gap', 'Gutter Space', 'Peritext', 'Page Turn', 'Wordless Spread'],
  memoir: ['Anecdote', 'Reflective Voice', 'Emotive Language', 'Selective Memory', 'Fragmentation'],
  bio: ['Chronological Structure', 'Expert Opinion', 'Primary Source', 'Objectivity', 'Historical Context'],
  essay: ['Rhetorical Question', 'Thesis Statement', 'Anecdote', 'Expert Opinion', 'Statistics', 'Emotive Language']
};
