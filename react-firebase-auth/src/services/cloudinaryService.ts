export const cloudinaryService = {
  async subirImagen(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "react_posts");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dei3nadsq/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("Error al subir imagen:", err);
      return null;
    }
  },

  async obtenerTodasLasImagenes(): Promise<string[]> {
    try {
      const response = await fetch("http://localhost:8000/imagenes");
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error al obtener imágenes desde FastAPI:", err);
      return [];
    }
  },
};
