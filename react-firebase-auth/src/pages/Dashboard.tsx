import { useAuth } from "../context/AuthContext";
import {
  GoogleAuthProvider,
  linkWithPopup,
  unlink
} from "firebase/auth";
import { useState } from "react";

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
    <div className="min-h-screen bg-gray-100 px-6 py-8 flex flex-col items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded shadow text-center">
        <h1 className="text-3xl font-semibold mb-4">Bienvenido, {user?.email}</h1>
        <button
          onClick={logout}
          className="mb-6 bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded transition"
        >
          Cerrar Sesión
        </button>

        <h2 className="text-xl font-bold mb-4">Asociar proveedores</h2>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleLinkGoogle}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
          >
            Asociar cuenta Google
          </button>
          <button
            onClick={handleUnlinkGoogle}
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded transition"
          >
            Desvincular Google
          </button>
        </div>

        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}
