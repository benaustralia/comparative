import { db } from './firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';

export const createMap = async (userId, title, sourceA, sourceB, sourceAForm = '', sourceBForm = '', sourceAYear = '', sourceAAuthor = '', sourceBYear = '', sourceBAuthor = '') => {
  try {
    const docRef = await addDoc(collection(db, "maps"), {
      userId,
      ownerId: userId,
      title: title || "Untitled Map",
      sourceA: sourceA || "",
      sourceB: sourceB || "",
      sourceAForm,
      sourceBForm,
      sourceAYear,
      sourceAAuthor,
      sourceBYear,
      sourceBAuthor,
      sharedWith: [],
      editors: [],
      viewers: [],
      bridges: [],
      content: { nodes: [], edges: [] },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const getUserMaps = async (userId, email) => {
  try {
    const promises = [];
    
    // 1. Get maps owned by user (Check new ownerId AND legacy userId)
    promises.push(getDocs(query(collection(db, "maps"), where("ownerId", "==", userId))));
    promises.push(getDocs(query(collection(db, "maps"), where("userId", "==", userId))));

    // 2. Get maps shared with user (if email provided) - Check all lists
    if (email) {
      promises.push(getDocs(query(collection(db, "maps"), where("sharedWith", "array-contains", email))));
      promises.push(getDocs(query(collection(db, "maps"), where("editors", "array-contains", email))));
      promises.push(getDocs(query(collection(db, "maps"), where("viewers", "array-contains", email))));
    }

    const snapshots = await Promise.all(promises);
    const allMaps = snapshots.flatMap(snap => snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure arrays exist to prevent crashes
        sharedWith: data.sharedWith || [],
        editors: data.editors || [],
        viewers: data.viewers || []
      };
    }));
    
    // 3. Deduplicate
    const uniqueMaps = Array.from(new Map(allMaps.map(item => [item.id, item])).values());
    
    return uniqueMaps;
  } catch (e) {
    console.error("Error getting maps: ", e);
    throw e;
  }
};

export const shareMap = async (mapId, email, role = 'editor') => {
  try {
    const docRef = doc(db, "maps", mapId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Clean user from all lists to allow role switching
      // Also clean from legacy sharedWith to avoid confusion
      const editors = (data.editors || []).filter(e => e !== email);
      const viewers = (data.viewers || []).filter(e => e !== email);
      const sharedWith = (data.sharedWith || []).filter(e => e !== email);
      
      const updates = {
        editors,
        viewers,
        sharedWith,
        updatedAt: serverTimestamp()
      };

      if (role === 'editor') {
        updates.editors = [...editors, email];
      } else {
        updates.viewers = [...viewers, email];
      }

      await updateDoc(docRef, updates);
    }
  } catch (e) {
    console.error("Error sharing map: ", e);
    throw e;
  }
};

export const getMap = async (mapId, currentUserId) => {
  try {
    const docRef = doc(db, "maps", mapId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Auto-Migration: Fix missing ownerId
      if (!data.ownerId) {
        // Use legacy userId if available, otherwise use current user ID if provided
        const newOwnerId = data.userId || currentUserId;
        
        if (newOwnerId) {
            try {
                await updateDoc(docRef, { 
                    ownerId: newOwnerId,
                    updatedAt: serverTimestamp() 
                });
                data.ownerId = newOwnerId;
            } catch (err) {
                console.error("Migration failed:", err);
            }
        }
      }

      return { 
        id: docSnap.id, 
        ...data,
        // Ensure arrays exist
        sharedWith: data.sharedWith || [],
        editors: data.editors || [],
        viewers: data.viewers || []
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting map: ", e);
    throw e;
  }
};

export const updateMapBridges = async (mapId, bridges) => {
  try {
    const docRef = doc(db, "maps", mapId);
    await updateDoc(docRef, {
      bridges,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error updating map bridges: ", e);
    throw e;
  }
};

/**
 * Removes a specific bridge from the map's bridges array.
 * This is triggered by the high-momentum 'Flick' on mobile.
 */
export const discardItem = async (mapId, bridgeId) => {
  try {
    const docRef = doc(db, "maps", mapId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const updatedBridges = (data.bridges || []).filter(b => b.id !== bridgeId);
      await updateDoc(docRef, {
        bridges: updatedBridges,
        updatedAt: serverTimestamp()
      });
    }
  } catch (e) {
    console.error("Error discarding bridge into void: ", e);
    throw e;
  }
};
