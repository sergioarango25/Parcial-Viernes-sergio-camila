import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabase";
import "../styles/Welcome.css";

import { FaUserCircle, FaHeart } from "react-icons/fa";

import menPromotion from "../assets/promotion/menPromotion.jpg";
import couplePromotion from "../assets/promotion/couplePromotion.jpg";
import hoodiePromotion from "../assets/promotion/hoodiePromotion.jpg";
// secciones
import girl from "../assets/girl-welcome.png";
import men from "../assets/men-welcome.png";
import couple from "../assets/couple-welcome.png";

function Welcome() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fav, setFav] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <div className="menu">
        <div className="search-bar">
          <input type="text" placeholder="Buscar..." />
        </div>

        <div className="icon">
          <FaUserCircle
            className="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="dropdown">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>

        <FaHeart className="corazon" onClick={() => setFav(!fav)} />
      </div>

      <section>
        <div className="decorador1"></div>
      </section>
      <section>
        <div className="infoPromotion">
          <h2>CONOCE LA NUEVA COLECCION EXCLUSIVA DE BRAND NEW</h2>
        </div>
      </section>

      <section className="promociones">
        <div className="promotion">
          <img src={menPromotion} alt="" />
        </div>

        <div className="promotion">
          <img src={couplePromotion} alt="" />
        </div>

        <div className="promotion">
          <img src={hoodiePromotion} alt="" />
        </div>
      </section>

      {/* CARDS */}
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

      {/* TITULO */}
      <section>
        <div className="titulo">
          <h1>BRAND NEW</h1>
        </div>
      </section>

      <section>
        <footer className="informacion">
          <h3>SOLO ESCOGE LA CATEGORÍA, EL ESTILO LO PONES TÚ</h3>
        </footer>
      </section>

      {/* links de las paginas o de las categorias */}

      <section>
        <div className="contenido">
          <footer>
            <ul>
              <p className="lista">CATEGORIAS</p>
              <li>
                <a href="/sessions/men">Hombres</a>
              </li>
              <li>
                <a href="/sessions/girl">Mujeres</a>
              </li>
              <li>
                <a href="/sessions/couple">Parejas</a>
              </li>
            </ul>
            <ul>
              <p className="lista">SOBRE NOSOTROS</p>
              <li>
                <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                  Contacto
                </a>
              </li>
              <li>
                <a href="/tiendas">Tiendas brand new</a>
              </li>
            </ul>
            <ul>
              <p className="lista">INFORMACION DE LA EMPRESA</p>
              <li>
                <a href="https://policies.google.com/privacy?hl=es" target="_blank">Politica de privacidad</a>
              </li>
              <li>
                <a href="https://policies.google.com/terms?hl=es" target="_blank">Terminos y condiciones</a>
              </li>
            </ul>
          </footer> 
        </div>
      </section>
    </>
  );
}

export default Welcome;
