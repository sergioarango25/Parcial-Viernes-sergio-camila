import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/welcome");
    }
  };

  return (
    <>
      <section>
        <img
          src="https://i.pinimg.com/1200x/c1/da/73/c1da734357b6d54987b01edfbca5ec49.jpg"
          className="fondoPrimario"
        />
        <div className="header-login">Brand New</div>
      </section>

      <form className="box" onSubmit={handleLogin}>
        <div className="title">
          <h1>LOGIN</h1>
        </div>

        <input
          className="email"
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login" type="submit">
          INGRESAR
        </button>

        <button
          className="registrarse"
          type="button"
          onClick={() => navigate("/register")}
        >
          REGISTRARSE
        </button>

        <button className="olvidar-contraseña" type="button">
          OLVIDÉ MI CONTRASEÑA
        </button>

        {errorMsg && <p className="error">{errorMsg}</p>}
      </form>
    </>
  );
}

export default Login;