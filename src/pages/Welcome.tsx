import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/Welcome.css";

import { FaUserCircle } from "react-icons/fa";

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
      {/*  ICONO USUARIO */}
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

        {/* CARD 1 */}
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

        {/* CARD 2 */}
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

        {/* CARD 3 */}
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

      <section>
        <div className="titulo">
          <h1>BRAND NEW</h1>
        </div>
      </section>

      <form className="menu">
        <button type="button">Sucursales</button>

        <button type="button" onClick={() => navigate("/")}>
          Log-in
        </button>

        <button type="button">Contacto</button>
      </form>
    </>
  );
}

export default Welcome;