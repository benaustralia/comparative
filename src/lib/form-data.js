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

export const KNOWLEDGE_LIBRARY = {
  novel: {
    conventions: {
      'Narrative Voice': { features: ['First Person', 'Third Person', 'Unreliable Narrator', 'Stream of Consciousness'] },
      'Language': { features: ['Metaphor', 'Simile', 'Symbolism', 'Motif', 'Imagery', 'Tone', 'Irony', 'Allusion'] },
      'Structure': { features: ['Flashback', 'Non-linear Timeline', 'Epistolary', 'Frame Narrative', 'Compressed Timeline'] },
    },
    genericConventions: {
      'Gothic': { features: ['Dark Setting', 'Supernatural Elements', 'Psychological Terror', 'Decay'] },
      'Bildungsroman': { features: ['Coming of Age', 'Loss of Innocence', 'Moral Growth', 'Self-Discovery'] },
    },
  },
  novella: {
    conventions: {
      'Narrative Voice': { features: ['First Person', 'Third Person', 'Unreliable Narrator'] },
      'Language': { features: ['Metaphor', 'Symbolism', 'Compressed Timeline', 'Motif'] },
      'Structure': { features: ['Single Plotline', 'Tight Focus', 'Frame Narrative'] },
    },
    genericConventions: {
      'Gothic': { features: ['Dark Setting', 'Psychological Terror', 'Isolation'] },
      'Allegory': { features: ['Extended Metaphor', 'Symbolic Characters', 'Moral Lesson'] },
    },
  },
  anthology: {
    conventions: {
      'Thematic Design': { features: ['Thematic Echo', 'Motif Repetition', 'Recurring Character'] },
      'Structure': { features: ['Linear', 'Non-linear', 'Circular Narrative', 'Frame Story'] },
      'Narrative Voice': { features: ['Shifting Perspective', 'Collective Voice', 'First Person'] },
    },
    genericConventions: {
      'Linked Collection': { features: ['Shared Setting', 'Recurring Characters', 'Thematic Unity'] },
    },
  },
  film: {
    conventions: {
      'Camera Language': { features: ['Close-up', 'Long Shot', 'Dutch Angle', 'Tracking Shot', 'Aerial Shot', 'POV Shot'] },
      'Sound Design': { features: ['Diegetic Sound', 'Non-diegetic Score', 'Ambient Sound', 'Silence', 'Leitmotif'] },
      'Mise en Scene': { features: ['Lighting', 'Costume', 'Colour Palette', 'Set Design', 'Blocking'] },
      'Editing': { features: ['Montage', 'Cross-cutting', 'Jump Cut', 'Match Cut', 'Slow Motion'] },
    },
    genericConventions: {
      'Hollywood Ending': { features: ['Resolution', 'Moral Closure', 'Happy Ending'] },
      'Auteur Style': { features: ['Signature Framing', 'Recurring Themes', 'Distinctive Palette'] },
    },
  },
  docu: {
    conventions: {
      'Interview': { features: ['Talking Head', 'Expert Interview', 'Vox Pop'] },
      'Footage': { features: ['Archival Footage', 'Reconstruction', 'Observational'] },
      'Narration': { features: ['Voice-over', 'Statistics', 'On-screen Text'] },
    },
    genericConventions: {
      'Expository': { features: ['Authoritative Voice', 'Evidence-Based', 'Logical Structure'] },
      'Participatory': { features: ['Director On-camera', 'Provocation', 'Subjective Lens'] },
    },
  },
  short_film: {
    conventions: {
      'Camera Language': { features: ['Close-up', 'Single Location', 'Handheld'] },
      'Sound Design': { features: ['Ambient Sound', 'Minimalist Score', 'Silence'] },
      'Structure': { features: ['Minimalism', 'Twist Ending', 'Open Ending'] },
    },
    genericConventions: {
      'Experimental': { features: ['Non-narrative', 'Abstract Imagery', 'Found Footage'] },
    },
  },
  series: {
    conventions: {
      'Narrative Arc': { features: ['Episode Arc', 'Season Arc', 'Series Arc'] },
      'Structure': { features: ['Cold Open', 'Cliffhanger', 'Flashback', 'Parallel Plot'] },
      'Character': { features: ['Ensemble Cast', 'Character Development', 'Recurring Antagonist'] },
    },
    genericConventions: {
      'Prestige TV': { features: ['Complex Narrative', 'Moral Ambiguity', 'Cinematic Quality'] },
    },
  },
  play: {
    conventions: {
      'Stage Directions': { features: ['Blocking', 'Gesture', 'Pause', 'Silence'] },
      'Staging': { features: ['Lighting Cues', 'Set Design', 'Prop Usage', 'Costume'] },
      'Performance': { features: ['Soliloquy', 'Monologue', 'Aside', 'Dialogue'] },
    },
    genericConventions: {
      'Tragedy': { features: ['Hamartia', 'Catharsis', 'Reversal of Fortune', 'Fatal Flaw'] },
      'Comedy': { features: ['Mistaken Identity', 'Wordplay', 'Social Satire', 'Happy Resolution'] },
    },
  },
  musical: {
    conventions: {
      'Musical Elements': { features: ['Leitmotif', 'Diegetic Song', 'Ensemble Number', 'Reprise', 'Underscoring'] },
      'Staging': { features: ['Choreography', 'Spectacle', 'Lighting', 'Costume'] },
    },
    genericConventions: {
      'Book Musical': { features: ['Integrated Songs', 'Character Driven', 'Narrative Throughline'] },
      'Jukebox Musical': { features: ['Pre-existing Songs', 'Nostalgic Appeal', 'Cultural Commentary'] },
    },
  },
  gn: {
    conventions: {
      'Panel Design': { features: ['Gutter', 'Splash Page', 'Bleed', 'Panel Layout'] },
      'Visual Language': { features: ['Emanata', 'Graphic Weight', 'Salience', 'Vectors', 'Colour Symbolism'] },
      'Text': { features: ['Speech Balloon', 'Thought Bubble', 'Caption Box', 'Sound Effect'] },
    },
    genericConventions: {
      'Memoir GN': { features: ['Personal Testimony', 'Simplified Art', 'Timeline Shifts'] },
    },
  },
  pic_book: {
    conventions: {
      'Visual Design': { features: ['Visual-Textual Gap', 'Gutter Space', 'Page Turn', 'Wordless Spread'] },
      'Peritext': { features: ['Endpapers', 'Cover Art', 'Dedication Page', 'Typography'] },
    },
    genericConventions: {
      'Postmodern': { features: ['Metafiction', 'Ironic Juxtaposition', 'Reader Participation'] },
    },
  },
  memoir: {
    conventions: {
      'Voice': { features: ['Reflective Voice', 'Emotive Language', 'Anecdote', 'Confessional Tone'] },
      'Memory': { features: ['Selective Memory', 'Fragmentation', 'Sensory Detail'] },
      'Structure': { features: ['Chronological', 'Thematic', 'Episodic'] },
    },
    genericConventions: {
      'Trauma Memoir': { features: ['Non-linear Time', 'Dissociation', 'Recovery Arc'] },
    },
  },
  bio: {
    conventions: {
      'Research': { features: ['Primary Source', 'Expert Opinion', 'Historical Context'] },
      'Structure': { features: ['Chronological Structure', 'Thematic Structure'] },
      'Voice': { features: ['Objectivity', 'Authoritative Tone', 'Critical Distance'] },
    },
    genericConventions: {
      'Authorised Bio': { features: ['Subject Collaboration', 'Insider Access', 'Sympathetic Lens'] },
    },
  },
  essay: {
    conventions: {
      'Rhetoric': { features: ['Rhetorical Question', 'Thesis Statement', 'Anecdote', 'Expert Opinion'] },
      'Evidence': { features: ['Statistics', 'Case Study', 'Quotation'] },
      'Language': { features: ['Emotive Language', 'Irony', 'Formal Register'] },
    },
    genericConventions: {
      'Personal Essay': { features: ['Subjective Voice', 'Narrative Arc', 'Reflection'] },
      'Argumentative': { features: ['Counter-argument', 'Logical Structure', 'Persuasive Appeals'] },
    },
  },
};

export const EFFECTS = [
  'Audience identification', 'Audience detachment', 'Changing message through medium shift',
  'Foregrounding relationships', 'Infantilising', 'Marginalising', 'Empathy building',
  'Creating suspense', 'Subverting expectations', 'Social commentary',
];

export const LENSES = [
  'Feminist', 'Marxist', 'Postcolonial', 'Psychoanalytic',
  'Ecocritical', 'New Historicist', 'Structuralist', 'Reader-Response',
];

// Helpers
export const getConventions = (formId) => Object.keys(KNOWLEDGE_LIBRARY[formId]?.conventions || {});
export const getGenericConventions = (formId) => Object.keys(KNOWLEDGE_LIBRARY[formId]?.genericConventions || {});
export const getFeatures = (formId, convention) => {
  const lib = KNOWLEDGE_LIBRARY[formId];
  return lib?.conventions[convention]?.features || lib?.genericConventions[convention]?.features || [];
};

// Backward compat: flat features per form derived from library
export const FEATURES = Object.fromEntries(
  Object.entries(KNOWLEDGE_LIBRARY).map(([id, lib]) => [
    id,
    [...new Set([
      ...Object.values(lib.conventions).flatMap(c => c.features),
      ...Object.values(lib.genericConventions).flatMap(c => c.features),
    ])],
  ])
);
