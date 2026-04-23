import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Usuario registrado 🚀");
      navigate("/");
    }
  };

  return (
    <>
      <section>
        <img
          src="https://i.pinimg.com/1200x/c1/da/73/c1da734357b6d54987b01edfbca5ec49.jpg"
          className="register-fondo"
        />
      </section>

      <form className="register-box" onSubmit={handleRegister}>
        <div className="register-title">
          <h1>REGISTRO</h1>
        </div>

        <input
          className="register-name"
          type="text"
          placeholder="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="register-email"
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="register-password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="register-btn" type="submit">
          CREAR CUENTA
        </button>

        <button
          className="register-volver"
          type="button"
          onClick={() => navigate("/")}
        >
          VOLVER AL LOGIN
        </button>

        {errorMsg && <p className="register-error">{errorMsg}</p>}
      </form>
    </>
  );
}

export default Register;