import { useAuth } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  linkWithPopup,
  unlink
} from "firebase/auth";
import { useState } from "react";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

        {success && <p className="success-message">{success}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
