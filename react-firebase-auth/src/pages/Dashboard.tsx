import { useAuth } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  linkWithPopup,
  unlink
} from "firebase/auth";
import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import { cloudinaryService } from "../services/cloudinaryService";
import "../styles/Dashboard.css";

interface Post {
  id: string;
  titulo: string;
  contenido: string;
  picture: string;
  fechaCreacion: any;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [titulo, setTitulo] = useState("");
  const [picture, setPicture] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenesDisponibles, setImagenesDisponibles] = useState<string[]>([]);

  const fetchPosts = async () => {
    if (user) {
      const data = await postService.obtenerPostsPorUsuario(user.uid);
      setPosts(data as Post[]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  useEffect(() => {
    const fetchImagenesDisponibles = async () => {
      const imagenes = await cloudinaryService.obtenerTodasLasImagenes();
      setImagenesDisponibles(imagenes);
    };

    fetchImagenesDisponibles();
  }, []);

  const handleCrearPost = async () => {
    if (!titulo || !contenido || !picture || !user) return;
    await postService.crearPost(user.uid, titulo, contenido, picture);
    setTitulo("");
    setContenido("");
    setPicture("");
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    if (file.size > 500 * 1024) {
      alert("La imagen no debe superar los 500 KB");
      return;
    }

    const imageUrl = await cloudinaryService.subirImagen(file);
    if (imageUrl) {
      setPicture(imageUrl);
      setLoading(false);
    } else {
      alert("Error al subir la imagen.");
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

          <div>
            {
              loading ? <p>Subiendo imagen...</p> : <p>Subir nueva imagen:</p>
            }
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <p>O seleccionar una ya subida:</p>
          <div className="image-grid">
            {imagenesDisponibles.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Imagen subida"
                width={100}
                className={`image-option ${picture === img ? "selected" : ""}`}
                onClick={() => setPicture(img)}
              />
            ))}
          </div>

          {picture && (
            <div style={{ marginTop: "10px" }}>
              <p>Imagen seleccionada:</p>
              <img src={picture} alt="Seleccionada" width={200} />
            </div>
          )}

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
              <small>
                {new Date(post.fechaCreacion.seconds * 1000).toLocaleString()}
              </small>
              {post.picture && (
                <img
                  src={post.picture}
                  alt="Imagen del post"
                  width={200}
                  style={{ marginTop: "10px" }}
                />
              )}
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
