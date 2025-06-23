import { Post } from "../pages/Dashboard";
import "../styles/PostsList.css"


interface Props {
  posts: Post[];
  onEliminar: (id: string) => void;
}

export default function PostsList({ posts, onEliminar }: Props) {
  if (posts.length === 0) return <p>No tienes publicaciones aún.</p>;

  return (
    <div className="posts-list">
      {posts.map((post) => (
        <div key={post.id} className="post-item">
          <h3>{post.titulo}</h3>
          <p>{post.contenido}</p>
          <small>{new Date(post.fechaCreacion.seconds * 1000).toLocaleString()}</small>
          {post.picture && <img src={post.picture} alt="Imagen del post" width={200} style={{ marginTop: "10px" }} />}
          <button onClick={() => onEliminar(post.id)} className="delete-button">Eliminar</button>
        </div>
      ))}
    </div>
  );
}
