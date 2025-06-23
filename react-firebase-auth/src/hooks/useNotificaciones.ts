import { useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, limit } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { toast } from "react-toastify";

export function useNotificaciones(uidUsuario: string, setUnreadCount?: (count: number) => void) {
  useEffect(() => {
    if (!uidUsuario) return;

    const q = query(
      collection(db, "notificaciones"),
      where("idUsuarioDestino", "==", uidUsuario),
      where("leida", "==", false),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (setUnreadCount) {
        setUnreadCount(snapshot.size);
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !change.doc.metadata.hasPendingWrites) {
          const data = change.doc.data();

          const titulo = data.tituloPost ? data.tituloPost : "";
          const mensajeCompleto = titulo ? `${titulo} - ${data.mensaje}` : data.mensaje;

          toast.info(mensajeCompleto, {
            autoClose: 8000,
            position: "top-right",
            onClick: () => {
              updateDoc(doc(db, "notificaciones", change.doc.id), {
                leida: true,
              });
            },
          });
        }
      });
    });

    return () => unsubscribe();
  }, [uidUsuario, setUnreadCount]);
}
