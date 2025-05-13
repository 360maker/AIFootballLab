import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthManager } from "./AuthManager";

export default function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AuthManager.handleCallback()
      .then(() => {
        navigate("/upload");
      })
      .catch((err) => {
        console.error("Errore nella callback:", err);
        setError(err.message || "Errore sconosciuto");
      });
  }, []);

  return (
    <div>
      <h2>Autenticazione completata</h2>
      {error ? (
        <p style={{ color: "red" }}>Errore: {error}</p>
      ) : (
        <p>Attendi, stiamo completando l'accesso…</p>
      )}
    </div>
  );
}




