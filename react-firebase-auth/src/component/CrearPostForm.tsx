import { useState } from "react";
import { cloudinaryService } from "../services/cloudinaryService";
import "../styles/CrearPostForm.css"

interface Props {
  loading: boolean;
  imagenesDisponibles: string[];
  onCrearPost: (titulo: string, contenido: string, picture: string) => void;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
}

export default function CrearPostForm({ loading, imagenesDisponibles, onCrearPost, setSuccess, setError }: Props) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [picture, setPicture] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("La imagen no debe superar los 500 KB");
      return;
    }

    try {
      const imageUrl = await cloudinaryService.subirImagen(file);
      if (imageUrl) {
        setPicture(imageUrl);
      } else {
        alert("Error al subir la imagen.");
      }
    } catch {
      alert("Error al subir la imagen.");
    }
  };

  const handleSubmit = () => {
    onCrearPost(titulo, contenido, picture);
    setTitulo("");
    setContenido("");
    setPicture("");
  };

  return (
    <div className="form-group">
      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <textarea placeholder="Contenido" value={contenido} onChange={(e) => setContenido(e.target.value)}></textarea>

      <div>{loading ? <p>Subiendo imagen...</p> : <p>Subir nueva imagen:</p>}</div>
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

      <button onClick={handleSubmit} className="create-button" disabled={loading}>
        Crear publicación
      </button>
    </div>
  );
}
