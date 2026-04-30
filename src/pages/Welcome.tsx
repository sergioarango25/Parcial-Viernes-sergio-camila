import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/Welcome.css";

import { FaUserCircle, FaHome, FaEnvelope, FaSignInAlt, FaSearch } from "react-icons/fa";

import girl from "../assets/girl-welcome.png";
import men from "../assets/men-welcome.png";
import couple from "../assets/couple-welcome.png";

function Welcome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      {/* 🔹 HEADER NUEVO */}
      <header className="header">
        <h1 className="logo">BRAND NEW</h1>

        <div className="search-bar">
          <FaSearch />
          <input type="text" placeholder="Buscar ropa..." />
        </div>

        <div className="menu-icons">
          <FaHome title="Sucursales" />
          <FaSignInAlt title="Login" onClick={() => navigate("/")} />
          <FaEnvelope title="Contacto" />
        </div>
      </header>

      {/* 🔹 ICONO USUARIO */}
      <div className="user-menu">
        <FaUserCircle
          className="user-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        />

        {menuOpen && (
          <div className="dropdown">
            <button onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      <section>
        <div className="decorador1"></div>
      </section>

      <section className="cartas">

        <div className="card1">
          <img
            src={men}
            className="men-welcome"
            onClick={() => navigate("/sessions/men")}
          />
          <div className="texto">
            <p>Marca tu propio ritmo</p>
            <button onClick={() => navigate("/sessions/men")}>
              Haz click aquí
            </button>
          </div>
        </div>

        <div className="card2">
          <img
            src={couple}
            className="couple-welcome"
            onClick={() => navigate("/sessions/couple")}
          />
          <div className="texto">
            <p>Dos estilos, una misma conexión</p>
            <button onClick={() => navigate("/sessions/couple")}>
              Haz click aquí
            </button>
          </div>
        </div>

        <div className="card3">
          <img
            src={girl}
            className="girl-welcome"
            onClick={() => navigate("/sessions/girl")}
          />
          <div className="texto">
            <p>Elegancia y actitud pensadas para ella</p>
            <button onClick={() => navigate("/sessions/girl")}>
              Haz click aquí
            </button>
          </div>
        </div>

      </section>
    </>
  );
}

export default Welcome;