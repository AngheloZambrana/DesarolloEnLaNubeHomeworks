import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export const likeService = {
  async darReaccion(idPost: string, idUsuario: string, tipo: "like" | "dislike") {
    const q = query(
      collection(db, "likes"),
      where("idPost", "==", idPost),
      where("userId", "==", idUsuario)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "likes", docSnap.id));
    }

    await addDoc(collection(db, "likes"), {
      idPost,
      userId: idUsuario,
      tipo,
      timestamp: new Date(),
    });
  },

  async quitarReaccion(idPost: string, idUsuario: string) {
    const q = query(
      collection(db, "likes"),
      where("idPost", "==", idPost),
      where("userId", "==", idUsuario)
    );

    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "likes", docSnap.id));
    }
  },

  async obtenerReaccionUsuario(idPost: string, idUsuario: string) {
    const q = query(
      collection(db, "likes"),
      where("idPost", "==", idPost),
      where("userId", "==", idUsuario)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[0]?.data()?.tipo ?? null;
  },
};
