import { db } from "../firebase/firebaseInit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

export const postService = {
  async crearPost(userId: string, titulo: string, contenido: string) {
    const newPost = {
      userId,
      titulo,
      contenido,
      fechaCreacion: Timestamp.now(),
    };
    const postRef = await addDoc(collection(db, "posts"), newPost);
    return postRef.id;
  },

  async eliminarPost(postId: string) {
    await deleteDoc(doc(db, "posts", postId));
  },

  async obtenerPostsPorUsuario(userId: string) {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
};
