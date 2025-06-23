// src/pages/NotificacionesPage.tsx
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { useAuth } from "../context/AuthContext";
import { useCallback } from "react";
import "../styles/NotificacionesPage.css";

interface Notificacion {
  id: string;
  mensaje: string;
  titulo?: string;
  leida: boolean;
  tipo: string;
  timestamp: any;
}

export default function NotificacionesPage() {
  const { user } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [tab, setTab] = useState<"leidas" | "no-leidas">("no-leidas");
  const [loading, setLoading] = useState(true);


  const fetchNotificaciones = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    const q = query(collection(db, "notificaciones"), where("idUsuarioDestino", "==", user.uid));
    const snapshot = await getDocs(q);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Notificacion[];
    setNotificaciones(lista);
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  const marcarComoLeida = async (id: string) => {
    await updateDoc(doc(db, "notificaciones", id), { leida: true });
    fetchNotificaciones();
  };

  const eliminarNotificacion = async (id: string) => {
    await deleteDoc(doc(db, "notificaciones", id));
    fetchNotificaciones();
  };

  const eliminarTodas = async (soloLeidas: boolean) => {
    const toDelete = notificaciones.filter((n) => (soloLeidas ? n.leida : !n.leida));
    await Promise.all(toDelete.map((n) => deleteDoc(doc(db, "notificaciones", n.id))));
    fetchNotificaciones();
  };

  const filtradas = notificaciones.filter((n) => n.leida === (tab === "leidas"));

  return (
    <div className="notificaciones-container">
      <h2>Mis Notificaciones</h2>
      <div className="tabs">
        <button className={tab === "no-leidas" ? "active" : ""} onClick={() => setTab("no-leidas")}>
          No leídas
        </button>
        <button className={tab === "leidas" ? "active" : ""} onClick={() => setTab("leidas")}>
          Leídas
        </button>
      </div>

      {loading ? (
        <p>Cargando notificaciones...</p>
      ) : filtradas.length === 0 ? (
        <p>No hay notificaciones {tab === "leidas" ? "leídas" : "no leídas"}.</p>
      ) : (
        <div className="notificaciones-lista">
          {filtradas.map((n) => (
            <div key={n.id} className="notificacion-item">
              <h4>{n.titulo || "Notificación"}</h4>
              <p>{n.mensaje}</p>
              <small>{new Date(n.timestamp?.seconds * 1000).toLocaleString()}</small>
              <div className="acciones">
                {!n.leida && (
                  <button onClick={() => marcarComoLeida(n.id)}>Marcar como leída</button>
                )}
                <button onClick={() => eliminarNotificacion(n.id)}>Eliminar</button>
              </div>
            </div>
          ))}
          <button
            className="eliminar-todo"
            onClick={() => eliminarTodas(tab === "leidas")}
          >
            Eliminar todas las {tab === "leidas" ? "leídas" : "no leídas"}
          </button>
        </div>
      )}
    </div>
  );
}
