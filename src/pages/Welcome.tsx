import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import allProducts from "../data/allProducts";
import "../styles/Welcome.css";
import { FaUserCircle, FaHeart } from "react-icons/fa";

import menPromotion from "../assets/promotion/menPromotion.jpg";
import couplePromotion from "../assets/promotion/couplePromotion.jpg";
import hoodiePromotion from "../assets/promotion/hoodiePromotion.jpg";

import girl from "../assets/girl-welcome.png";
import men from "../assets/men-welcome.png";
import couple from "../assets/couple-welcome.png";

function Welcome() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [fav, setFav] = useState(false);
  const [promocionActiva, setPromocionActiva] = useState<any>(null);

  const [favoritosGuardados, setFavoritosGuardados] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        setUserId(data.user.id);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const data = localStorage.getItem(`misFavoritos_${userId}`);
    setFavoritosGuardados(data ? JSON.parse(data) : []);
  }, [userId, fav]);

  const promocionesWelcome = [
    {
      id: 1,
      title: "Colección Hombre",
      img: menPromotion,
      description:
        "Looks urbanos para hombre: hoodies, camisetas, chaquetas y accesorios con el estilo Brand New.",
      route: "/sessions/men",
      buttonText: "Comprar",
    },
    {
      id: 2,
      title: "Colección Parejas",
      img: couplePromotion,
      description:
        "Prendas combinadas para parejas que quieren llevar el mismo estilo con actitud.",
      route: "/sessions/couple",
      buttonText: "Comprar",
    },
    {
      id: 3,
      title: "Colección Mujer",
      img: hoodiePromotion,
      description:
        "Hoodies, jeans y prendas llamativas para mujer con diseños exclusivos de Brand New.",
      route: "/sessions/girl",
      buttonText: "Comprar",
    },
  ];

  const categoriasWelcome = [
    {
      title: "Ropa de hombre",
      img: men,
      className: "men-welcome",
      cardClass: "card1",
      description: "Marca tu propio ritmo",
      route: "/sessions/men",
    },
    {
      title: "Ropa para parejas",
      img: couple,
      className: "couple-welcome",
      cardClass: "card2",
      description: "Dos estilos, una misma conexión",
      route: "/sessions/couple",
    },
    {
      title: "Ropa de mujer",
      img: girl,
      className: "girl-welcome",
      cardClass: "card3",
      description: "Elegancia y actitud pensadas para ella",
      route: "/sessions/girl",
    },
  ];

  const botonesMenu = [
    ["Cerrar sesión", async () => {
      await supabase.auth.signOut();
      navigate("/");
    }],
    ["Crear producto", () => navigate("/create")],
    ["Actualizar producto", () => navigate("/updateProduct")],
    ["Mis compras", () => navigate("/my-purchases")],
    ["Nueva contraseña", () => navigate("/password")]
  ];

  const productosFiltrados = allProducts.filter((producto) =>
    busqueda
      .toLowerCase()
      .split(" ")
      .every(
        (palabra) =>
          producto.name.toLowerCase().includes(palabra) ||
          producto.category.toLowerCase().includes(palabra)
      )
  );

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
            <>
              <span className="clear-search" onClick={() => setBusqueda("")}>
                ✕
              </span>

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
            </>
          )}
        </div>

        <div className="icon">
          <FaUserCircle
            className="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="dropdown">
              <h3>{user?.user_metadata?.name || user?.email?.split("@")[0]}</h3>

              {botonesMenu.map(([texto, accion]: any) => (
                <button key={texto} onClick={accion}>
                  {texto}
                </button>
              ))}
            </div>
          )}
        </div>

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

            <button className="pago">Comprar</button>
          </div>
        )}
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
        {promocionesWelcome.map((promo) => (
          <div
            key={promo.id}
            className="promotion"
            onClick={() => setPromocionActiva(promo)}
          >
            <img src={promo.img} alt={promo.title} />
          </div>
        ))}
      </section>

      {promocionActiva && (
        <div
          className="welcome-modal"
          onClick={() => setPromocionActiva(null)}
        >
          <div
            className="welcome-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="welcome-modal-close"
              onClick={() => setPromocionActiva(null)}
            >
              ✕
            </button>

            <img
              src={promocionActiva.img}
              alt={promocionActiva.title}
              className="welcome-modal-img"
            />

            <div className="welcome-modal-info">
              <h2>{promocionActiva.title}</h2>
              <p>{promocionActiva.description}</p>

              <button
                className="welcome-buy-button"
                onClick={() => navigate(promocionActiva.route)}
              >
                {promocionActiva.buttonText}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="cartas">
        {categoriasWelcome.map((categoria) => (
          <div key={categoria.title} className={categoria.cardClass}>
            <img
              src={categoria.img}
              className={categoria.className}
              alt={categoria.title}
              onClick={() => navigate(categoria.route)}
            />

            <div className="texto">
              <p>{categoria.description}</p>

              <button onClick={() => navigate(categoria.route)}>
                Haz click aquí
              </button>
            </div>
          </div>
        ))}
      </section>

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

      <section>
        <div className="contenido">
          <footer>
            <ul>
              <p className="lista">CATEGORIAS</p>
              <li><a href="/sessions/men">Hombres</a></li>
              <li><a href="/sessions/girl">Mujeres</a></li>
              <li><a href="/sessions/couple">Parejas</a></li>
            </ul>

            <ul>
              <p className="lista">SOBRE NOSOTROS</p>
              <li>
                <a href="https://web.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                  Contacto
                </a>
              </li>
              <li><a href="/tiendas">Tiendas brand new</a></li>
            </ul>

            <ul>
              <p className="lista">INFORMACION DE LA EMPRESA</p>
              <li>
                <a href="https://policies.google.com/privacy?hl=es" target="_blank">
                  Politica de privacidad
                </a>
              </li>
              <li>
                <a href="https://policies.google.com/terms?hl=es" target="_blank">
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