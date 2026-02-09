import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';

const ref = (id) => doc(db, "maps", id);
const ts = () => serverTimestamp();
const ensureArrays = (d) => ({ sharedWith: d.sharedWith || [], editors: d.editors || [], viewers: d.viewers || [] });

const mkEmptySide = () => ({ type: '', convention: '', feature: '', effect: '', lens: '', ctx: '', ev: '', meaning: '' });
const mkTeelBlocks = () => [{ evidence: '', explanation: '' }, { evidence: '', explanation: '' }, { evidence: '', explanation: '' }];
const mkFoundation = () => ({ id: 'foundation', kind: 'foundation', status: 'draft', content: '' });
const mkCantilever = (id) => ({ id, kind: 'cantilever', status: 'draft', teel: { topic: '', blocks: mkTeelBlocks(), link: '', sideA: mkEmptySide(), sideB: mkEmptySide() }, synthesis: '' });
const mkKeystone = () => ({ id: 'keystone', kind: 'keystone', status: 'draft', content: '' });

export const createMap = async (userId, { title, sourceA, sourceB, formA = '', formB = '', yearA = '', authorA = '', yearB = '', authorB = '', essayQuestion = '' }) => {
  const docRef = await addDoc(collection(db, "maps"), {
    userId, ownerId: userId, title: title || "Untitled Map",
    sourceA: sourceA || "", sourceB: sourceB || "", sourceAForm: formA, sourceBForm: formB,
    sourceAYear: yearA, sourceAAuthor: authorA, sourceBYear: yearB, sourceBAuthor: authorB,
    essayQuestion,
    sharedWith: [], editors: [], viewers: [],
    segments: [mkFoundation(), mkCantilever('cantilever-1'), mkCantilever('cantilever-2'), mkCantilever('cantilever-3'), mkCantilever('cantilever-4'), mkKeystone()],
    bridges: [], content: { nodes: [], edges: [] },
    createdAt: ts(), updatedAt: ts()
  });
  return docRef.id;
};

export const getUserMaps = async (userId, email) => {
  const queries = [
    getDocs(query(collection(db, "maps"), where("ownerId", "==", userId))),
    getDocs(query(collection(db, "maps"), where("userId", "==", userId))),
    ...(email ? ["sharedWith", "editors", "viewers"].map(f =>
      getDocs(query(collection(db, "maps"), where(f, "array-contains", email)))
    ) : [])
  ];
  const snaps = await Promise.all(queries);
  const all = snaps.flatMap(s => s.docs.map(d => ({ id: d.id, ...d.data(), ...ensureArrays(d.data()) })));
  return [...new Map(all.map(m => [m.id, m])).values()];
};

export const shareMap = async (mapId, email, role = 'editor') => {
  const docSnap = await getDoc(ref(mapId));
  if (!docSnap.exists()) return;
  const d = docSnap.data();
  const clean = (arr) => (arr || []).filter(e => e !== email);
  const updates = { editors: clean(d.editors), viewers: clean(d.viewers), sharedWith: clean(d.sharedWith), updatedAt: ts() };
  updates[role === 'editor' ? 'editors' : 'viewers'].push(email);
  await updateDoc(ref(mapId), updates);
};

export const getMap = async (mapId, currentUserId) => {
  const docSnap = await getDoc(ref(mapId));
  if (!docSnap.exists()) return null;
  const data = docSnap.data();
  if (!data.ownerId && (data.userId || currentUserId)) {
    const oid = data.userId || currentUserId;
    await updateDoc(ref(mapId), { ownerId: oid, updatedAt: ts() }).catch(() => {});
    data.ownerId = oid;
  }
  // Lazy migration: tech -> feature on legacy bridges
  const bridges = data.bridges || [];
  let migrated = false;
  bridges.forEach(b => {
    ['sideA', 'sideB'].forEach(s => {
      if (b[s]?.tech !== undefined) { b[s].feature = b[s].feature || b[s].tech; delete b[s].tech; migrated = true; }
    });
  });
  // Lazy migration: bridges -> segments
  if (bridges.length && !data.segments) {
    const segments = [mkFoundation()];
    bridges.forEach((b, i) => {
      segments.push({
        id: `cantilever-${i + 1}`, kind: 'cantilever', status: b.status === 'bridge' ? 'draft' : 'draft',
        teel: {
          topic: '', link: '',
          blocks: [
            { evidence: b.sideA?.ev || '', explanation: b.sideA?.meaning || '' },
            { evidence: b.sideB?.ev || '', explanation: b.sideB?.meaning || '' },
            { evidence: '', explanation: '' },
          ],
          sideA: { type: b.sideA?.type || '', convention: '', feature: b.sideA?.feature || '', effect: '', lens: '', ctx: b.sideA?.ctx || '', ev: b.sideA?.ev || '', meaning: b.sideA?.meaning || '' },
          sideB: { type: b.sideB?.type || '', convention: '', feature: b.sideB?.feature || '', effect: '', lens: '', ctx: b.sideB?.ctx || '', ev: b.sideB?.ev || '', meaning: b.sideB?.meaning || '' },
        },
        synthesis: b.synthesis || '',
      });
    });
    segments.push(mkKeystone());
    data.segments = segments;
    migrated = true;
  }
  if (migrated) {
    const update = { updatedAt: ts() };
    if (data.bridges) update.bridges = bridges;
    if (data.segments) update.segments = data.segments;
    await updateDoc(ref(mapId), update).catch(() => {});
  }
  return { id: docSnap.id, ...data, ...ensureArrays(data) };
};

export const updateMapDetails = async (mapId, fields) =>
  updateDoc(ref(mapId), { ...fields, updatedAt: ts() });

export const updateMapSegments = async (mapId, segments) =>
  updateDoc(ref(mapId), { segments, updatedAt: ts() });

// Legacy compat alias
export const updateMapBridges = async (mapId, bridges) =>
  updateDoc(ref(mapId), { bridges, updatedAt: ts() });

export const discardItem = async (mapId, segmentId) => {
  const docSnap = await getDoc(ref(mapId));
  if (!docSnap.exists()) return;
  const data = docSnap.data();
  if (data.segments) {
    await updateDoc(ref(mapId), { segments: data.segments.filter(s => s.id !== segmentId), updatedAt: ts() });
  } else {
    await updateDoc(ref(mapId), { bridges: (data.bridges || []).filter(b => b.id !== segmentId), updatedAt: ts() });
  }
};

export const deleteMap = async (mapId) => deleteDoc(ref(mapId));

// Curriculum Library
export const getLibrary = async () => {
  const snapshot = await getDocs(collection(db, "curriculum_library"));
  return snapshot.docs.map(d => d.data());
};

// AI Integration (Gemini)
let _gemini = null;
const getGemini = async () => {
  if (_gemini) return _gemini;
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('VITE_GEMINI_API_KEY not set');
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  _gemini = new GoogleGenerativeAI(key).getGenerativeModel({ model: 'gemini-2.0-flash' });
  return _gemini;
};

export const mentorMe = async ({ form, convention, feature, effect, lens, context }) => {
  const model = await getGemini();
  const prompt = `You are a VCE Literature mentor. A Year 12 student is writing about a ${form} text using the convention "${convention}", specifically the feature "${feature}". The intended effect is "${effect || 'not specified'}" through a ${lens || 'general'} lens. Context: "${context || 'not provided'}". Give 3-4 sentences of coaching advice that guides without giving the answer. Ask a probing question to deepen their thinking.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateExample = async ({ form, convention, feature, effect, lens, essayQuestion }) => {
  const model = await getGemini();
  const prompt = `You are a VCE Literature essay writing model. Generate a single TEEL body paragraph (~150 words) at Year 12 standard. Form: ${form || 'prose'}. Convention: ${convention || 'general'}. Feature: ${feature || 'general technique'}. Effect: ${effect || 'audience engagement'}. Lens: ${lens || 'general'}. Essay question: "${essayQuestion || 'How do the texts explore this theme?'}". Structure it as: Topic sentence, Evidence (with a plausible quote), Explanation of the technique's effect, Link back to the question. Do not use headers or labels.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};
