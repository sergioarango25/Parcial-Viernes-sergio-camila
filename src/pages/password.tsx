import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/password.css";

function Password() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChangePassword = async () => {

    if (!email || !newPassword || !confirmPassword) {
      setErrorMsg("Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden");
      return;
    }

    // Buscar usuario autenticado
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setErrorMsg("Debes iniciar sesión primero");
      return;
    }

    // Verificar email
    if (data.user.email !== email.trim()) {
      setErrorMsg("El correo no coincide con la sesión");
      return;
    }

    // Actualizar contraseña
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Contraseña actualizada correctamente 🚀");
      navigate("/welcome");
    }
  };

  return (
    <div className="password-container">

      <button
        className="retorno"
        onClick={() => navigate("/welcome")}
      >
        X
      </button>

      <h1 className="title-password">
        Nueva contraseña
      </h1>

      <input
        type="email"
        className="password1"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="password1"
        type="password"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <input
        className="password1"
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {errorMsg && (
        <p className="error-message">
          {errorMsg}
        </p>
      )}

      <button
        className="confirm"
        onClick={handleChangePassword}
      >
        Guardar contraseña
      </button>
    </div>
  );
}

export default Password;