export const moderacionService = {
  async moderarContenido(contenido: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:8000/moderar-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contenido }),
      });

      const data = await response.json();
      return data.contenido_moderado;
    } catch (error) {
      console.error("Error al moderar contenido:", error);
      return contenido; 
    }
  },
};
