// src/pages/TodosLosPosts.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import "../styles/PostsList.css";

interface Post {
  id: string;
  titulo: string;
  contenido: string;
  picture: string;
  fechaCreacion: any;
  userEmail?: string; 
}

export default function TodosLosPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchAllPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("fechaCreacion", "desc"));
    const querySnapshot = await getDocs(q);
    const postList: Post[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
    setPosts(postList);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  if (posts.length === 0) return <p>No hay publicaciones aún.</p>;

  return (
    <div className="posts-list">
      <h2 style={{ marginBottom: "1rem" }}>Todos los Posts</h2>
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
        </div>
      ))}
    </div>
  );
}
