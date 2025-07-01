import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { likeService } from "../services/likeService";
import { notificacionService } from "../services/notificacionService";
import { useAuth } from "../context/AuthContext";
import { moderacionService } from "../services/moderacionService";
import "../styles/PostsList.css";

interface Post {
  id: string;
  titulo: string;
  contenido: string;
  picture: string;
  fechaCreacion: any;
  userEmail?: string;
  userId?: string;
  miReaccion?: "like" | "dislike" | null;
}

export default function TodosLosPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAllPosts = async () => {
    if (!user) return;

    const q = query(collection(db, "posts"), orderBy("fechaCreacion", "desc"));
    const querySnapshot = await getDocs(q);

    const postList: Post[] = await Promise.all(
      querySnapshot.docs
        .map((doc) => {
          const { id, ...postData } = doc.data() as Post;
          return { id: doc.id, ...postData };
        })
        .filter((post) => post.userId !== user.uid)
        .map(async (post) => {
          const miReaccion = await likeService.obtenerReaccionUsuario(post.id, user.uid);
          return { ...post, miReaccion };
        })
    );

    setPosts(postList);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleReaccion = async (
    post: Post,
    tipo: "like" | "dislike"
  ) => {
    if (!user) return;

    if (post.miReaccion === tipo) {
      await likeService.quitarReaccion(post.id, user.uid);
    } else {
      await likeService.darReaccion(post.id, user.uid, tipo);

      if (post.userId && post.userId !== user.uid) {
        await notificacionService.enviarNotificacion(
          post.userId,
          `${user.email} reaccionó con ${tipo === "like" ? "👍" : "👎"} a tu publicación`,
          "reaccion",
          post.titulo
        );
      }
    }

    fetchAllPosts();
  };

  if (posts.length === 0) return <p>No hay publicaciones de otros usuarios aún.</p>;

  return (
    <div className="posts-list">
      <h2 style={{ marginBottom: "1rem" }}>Posts de Otros Usuarios</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h3>{post.titulo}</h3>
          <p>{post.contenido}</p>
          {post.userEmail && <small>Publicado por: {post.userEmail}</small>}
          <br />
          <small>
            {post.fechaCreacion?.seconds
              ? new Date(post.fechaCreacion.seconds * 1000).toLocaleString()
              : "Sin fecha"}
          </small>
          {post.picture && (
            <div style={{ marginTop: "10px" }}>
              <img src={post.picture} alt="Imagen del post" width={200} />
            </div>
          )}

          <div className="reacciones">
            {post.miReaccion === "like" ? (
              <button onClick={() => handleReaccion(post, "like")}>❌ Quitar like</button>
            ) : (
              <button onClick={() => handleReaccion(post, "like")}>👍 Me gusta</button>
            )}

            {post.miReaccion === "dislike" ? (
              <button onClick={() => handleReaccion(post, "dislike")}>❌ Quitar dislike</button>
            ) : (
              <button onClick={() => handleReaccion(post, "dislike")}>👎 No me gusta</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
