import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import allProducts from "../data/allProducts";
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
  const [busqueda, setBusqueda] = useState("");
  const [fav, setFav] = useState(false);

  const [favoritosGuardados, setFavoritosGuardados] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>(null);

  // OBTENER USUARIO
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        setUserId(user.id);
      }
    };

    getUser();
  }, []);

  // CARGAR FAVORITOS DEL USUARIO
  useEffect(() => {
    if (!userId) return;

    const data = localStorage.getItem(`misFavoritos_${userId}`);

    if (data) {
      setFavoritosGuardados(JSON.parse(data));
    } else {
      setFavoritosGuardados([]);
    }
  }, [userId, fav]);

  const productosFiltrados = allProducts.filter((producto) => {
    const palabras = busqueda.toLowerCase().split(" ");

    return palabras.every(
      (palabra) =>
        producto.name.toLowerCase().includes(palabra) ||
        producto.category.toLowerCase().includes(palabra)
    );
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <div className="menu">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {busqueda && (
            <span className="clear-search" onClick={() => setBusqueda("")}>
              ✕
            </span>
          )}

          {busqueda && (
            <div className="search-results">
              {productosFiltrados.map((producto) => (
                <div
                  key={producto.id}
                  className="search-item"
                  onClick={() => navigate(producto.route)}
                >
                  <img src={producto.img} alt={producto.name} />

                  <div>
                    <h4>{producto.name}</h4>
                    <p>{producto.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USUARIO */}
        <div className="icon">
          <FaUserCircle
            className="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="dropdown">
              <h3>
                {user?.user_metadata?.name ||
                  user?.email?.split("@")[0]}
              </h3>

              <button onClick={handleLogout}>
                Cerrar sesión
              </button>
              <button onClick={() => navigate("/create")}>
                Crear producto
              </button>
              <button onClick={() => navigate("/updateProduct")}>
                Actualizar producto
              </button>
              <button onClick={() => navigate("/my-purchases")}>
                Mis compras
              </button>
              <button onClick={() => navigate("/password")}>
                Nueva contraseña
              </button>
              <button onClick={() => navigate("/")}>
                Login
              </button>

            </div>
          )}
        </div>

        {/* FAVORITOS */}
        <FaHeart className="corazon" onClick={() => setFav(!fav)} />

        {fav && (
          <div className="favorites-modal">
            <h2>PRODUCTOS FAVORITOS</h2>

            {favoritosGuardados.length === 0 ? (
              <p>No tienes favoritos</p>
            ) : (
              favoritosGuardados.map((producto) => (
                <div
                  key={producto.id}
                  className="favorite-item"
                  onClick={() => navigate(producto.route)}
                >
                  <img src={producto.img} alt={producto.name} />

                  <div>
                    <h4>{producto.name}</h4>
                    <p>${producto.price}</p>
                  </div>
                </div>
              ))
            )}

            <h2 className="total-favoritos">
              Total: $
              {favoritosGuardados.reduce(
                (total, producto) => total + producto.price,
                0
              )}
            </h2>

            <button className="pago">
              Comprar
            </button>
          </div>
        )}
      </div>

      <section>
        <div className="decorador1"></div>
      </section>

      <section>
        <div className="infoPromotion">
          <h2>
            CONOCE LA NUEVA COLECCION EXCLUSIVA DE BRAND NEW
          </h2>
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
          <h3>
            SOLO ESCOGE LA CATEGORÍA, EL ESTILO LO PONES TÚ
          </h3>
        </footer>
      </section>

      {/* LINKS */}
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
                <a
                  href="https://web.whatsapp.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contacto
                </a>
              </li>

              <li>
                <a href="/tiendas">
                  Tiendas brand new
                </a>
              </li>
            </ul>

            <ul>
              <p className="lista">
                INFORMACION DE LA EMPRESA
              </p>

              <li>
                <a
                  href="https://policies.google.com/privacy?hl=es"
                  target="_blank"
                >
                  Politica de privacidad
                </a>
              </li>

              <li>
                <a
                  href="https://policies.google.com/terms?hl=es"
                  target="_blank"
                >
                  Terminos y condiciones
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </section>
    </>
  );
}

export default Welcome;