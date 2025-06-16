import { useAuth } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  linkWithPopup,
  unlink
} from "firebase/auth";
import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import "../styles/Dashboard.css";

interface Post {
  id: string;
  titulo: string;
  contenido: string;
  fechaCreacion: any;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  const fetchPosts = async () => {
    if (user) {
      const data = await postService.obtenerPostsPorUsuario(user.uid);
      setPosts(data as Post[]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleCrearPost = async () => {
    if (!titulo || !contenido || !user) return;
    await postService.crearPost(user.uid, titulo, contenido);
    setTitulo("");
    setContenido("");
    fetchPosts();
  };

  const handleEliminarPost = async (id: string) => {
    await postService.eliminarPost(id);
    fetchPosts();
  };

  const handleLinkGoogle = async () => {
    if (!user) return;
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(user, provider);
      setSuccess("Cuenta de Google vinculada correctamente.");
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };

  const handleUnlinkGoogle = async () => {
    if (!user) return;
    try {
      await unlink(user, "google.com");
      setSuccess("Cuenta de Google desvinculada.");
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1 className="dashboard-title">Bienvenido, {user?.email}</h1>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>

        <h2 className="section-title">Asociar proveedores</h2>
        <div className="button-group">
          <button onClick={handleLinkGoogle} className="link-button">
            Asociar cuenta Google
          </button>
          <button onClick={handleUnlinkGoogle} className="unlink-button">
            Desvincular Google
          </button>
        </div>

        <hr />
        <h2 className="section-title">Tus Publicaciones</h2>

        <div className="form-group">
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <textarea
            placeholder="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          ></textarea>
          <button onClick={handleCrearPost} className="create-button">
            Crear publicación
          </button>
        </div>

        <div className="posts-list">
          {posts.length === 0 && <p>No tienes publicaciones aún.</p>}
          {posts.map((post) => (
            <div key={post.id} className="post-item">
              <h3>{post.titulo}</h3>
              <p>{post.contenido}</p>
              <small>{new Date(post.fechaCreacion.seconds * 1000).toLocaleString()}</small>
              <button
                onClick={() => handleEliminarPost(post.id)}
                className="delete-button"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
