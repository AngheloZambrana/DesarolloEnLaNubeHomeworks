import { db } from "../firebase/firebaseInit";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const notificacionService = {
  async enviarNotificacion(
    uidDestino: string,
    mensaje: string,
    tipo: string = "post",
    tituloPost?: string 
  ) {
    await addDoc(collection(db, "notificaciones"), {
      idUsuarioDestino: uidDestino,
      mensaje,
      leida: false,
      tipo,
      tituloPost: tituloPost || null, 
      timestamp: serverTimestamp(),
    });
  }
};
