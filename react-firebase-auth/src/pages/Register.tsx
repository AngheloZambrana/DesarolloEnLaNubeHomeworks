import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseInit";
import { db } from "../firebase/firebaseInit";
import { doc, setDoc } from "firebase/firestore";
import "../styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [edad, setEdad] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        Email: email,
        NombreCompleto: nombreCompleto,
        Telefono: telefono,
        Ciudad: ciudad,
        Edad: edad,
      });

      alert("¡Usuario registrado con éxito!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Registro</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="auth-button">Registrarse</button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            ¿Ya tienes cuenta?{" "}
            <Link to="/" style={{ color: "#2563eb", textDecoration: "underline" }}>
              Inicia sesión
            </Link>
          </div>
          {error && <p className="auth-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}
