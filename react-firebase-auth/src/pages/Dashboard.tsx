import { useAuth } from "../context/AuthContext";
import { useState, useCallback, useEffect } from "react";
import { postService } from "../services/postService";
import { cloudinaryService } from "../services/cloudinaryService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { notificacionService } from "../services/notificacionService";
import { useNotificaciones } from "../hooks/useNotificaciones";

import ProveedoresSection from "../component/ProveedoresSection";
import CrearPostForm from "../component/CrearPostForm";
import PostsList from "../component/PostsList";
import { moderacionService } from "../services/moderacionService";
import "../styles/Dashboard.css"


export interface Post {
  id: string;
  titulo: string;
  contenido: string;
  picture: string;
  fechaCreacion: any;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [imagenesDisponibles, setImagenesDisponibles] = useState<string[]>([]);

  useNotificaciones(user?.uid || "");

  const fetchPosts = useCallback(async () => {
    if (user) {
      const data = await postService.obtenerPostsPorUsuario(user.uid);
      setPosts(data as Post[]);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const fetchImagenesDisponibles = async () => {
      const imagenes = await cloudinaryService.obtenerTodasLasImagenes();
      setImagenesDisponibles(imagenes);
    };
    fetchImagenesDisponibles();
  }, []);

  const handleCrearPost = async (titulo: string, contenido: string, picture: string) => {
    if (!titulo || !contenido || !picture || !user) return;

    try {
      setLoading(true);
      setError(null);

      const contenidoModerado = await moderacionService.moderarContenido(contenido);
      await postService.crearPost(user.uid, titulo, contenidoModerado, picture);

      const usersSnapshot = await getDocs(collection(db, "users"));
      const notificationPromises: Promise<void>[] = [];

      usersSnapshot.forEach((docUser) => {
        const uidDestino = docUser.id;
        if (uidDestino !== user.uid) {
          notificationPromises.push(
            notificacionService.enviarNotificacion(
              uidDestino,
              `Nuevo post de ${user.email}`,
              "post",
              titulo
            )
          );
        }
      });

      await Promise.all(notificationPromises);

      setSuccess("Post creado y notificaciones enviadas correctamente");
      fetchPosts();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido al crear post o notificaciones");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarPost = async (id: string) => {
    await postService.eliminarPost(id);
    fetchPosts();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <ProveedoresSection
          setSuccess={setSuccess}
          setError={setError}
          user={user}
        />

        <hr />

        <h2 className="section-title">Tus Publicaciones</h2>

        <CrearPostForm
          loading={loading}
          imagenesDisponibles={imagenesDisponibles}
          onCrearPost={handleCrearPost}
          setSuccess={setSuccess}
          setError={setError}
        />

        <PostsList posts={posts} onEliminar={handleEliminarPost} />

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
