import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';

const ref = (id) => doc(db, "maps", id);
const ts = () => serverTimestamp();
const ensureArrays = (d) => ({ sharedWith: d.sharedWith || [], editors: d.editors || [], viewers: d.viewers || [] });

export const createMap = async (userId, { title, sourceA, sourceB, formA = '', formB = '', yearA = '', authorA = '', yearB = '', authorB = '' }) => {
  const docRef = await addDoc(collection(db, "maps"), {
    userId, ownerId: userId, title: title || "Untitled Map",
    sourceA: sourceA || "", sourceB: sourceB || "", sourceAForm: formA, sourceBForm: formB,
    sourceAYear: yearA, sourceAAuthor: authorA, sourceBYear: yearB, sourceBAuthor: authorB,
    sharedWith: [], editors: [], viewers: [], bridges: [], content: { nodes: [], edges: [] },
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
  return { id: docSnap.id, ...data, ...ensureArrays(data) };
};

export const updateMapBridges = async (mapId, bridges) =>
  updateDoc(ref(mapId), { bridges, updatedAt: ts() });

export const discardItem = async (mapId, bridgeId) => {
  const docSnap = await getDoc(ref(mapId));
  if (!docSnap.exists()) return;
  await updateDoc(ref(mapId), { bridges: (docSnap.data().bridges || []).filter(b => b.id !== bridgeId), updatedAt: ts() });
};

// Curriculum Library
import { VCE_LIBRARY_2026 } from './vce-data';

export const getLibrary = async () => {
  const snapshot = await getDocs(query(collection(db, "curriculum_library")));
  const library = snapshot.docs.map(d => d.data());
  if (library.length > 0) return library;
  await Promise.all(VCE_LIBRARY_2026.map(item => addDoc(collection(db, "curriculum_library"), item)));
  return VCE_LIBRARY_2026;
};
