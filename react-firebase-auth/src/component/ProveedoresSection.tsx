import { GoogleAuthProvider, linkWithPopup, unlink, User } from "firebase/auth";
import "../styles/ProveedoresSection.css";


interface Props {
  user: User | null;
  setSuccess: (msg: string | null) => void;
  setError: (msg: string | null) => void;
}

export default function ProveedoresSection({ user, setSuccess, setError }: Props) {
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
    <>
      <h2 className="section-title">Asociar proveedores</h2>
      <div className="button-group">
        <button onClick={handleLinkGoogle} className="link-button">Asociar cuenta Google</button>
        <button onClick={handleUnlinkGoogle} className="unlink-button">Desvincular Google</button>
      </div>
    </>
  );
}
