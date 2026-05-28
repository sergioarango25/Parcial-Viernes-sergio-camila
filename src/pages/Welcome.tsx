import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import "../styles/Welcome.css";
import { FaUserCircle, FaHeart } from "react-icons/fa";

import menPromotion from "../assets/promotion/menPromotion.jpg";
import couplePromotion from "../assets/promotion/couplePromotion.jpg";
import hoodiePromotion from "../assets/promotion/hoodiePromotion.jpg";

import girl from "../assets/girl-welcome.png";
import men from "../assets/men-welcome.png";
import couple from "../assets/couple-welcome.png";

type Producto = {
  id: string | number;
  name: string;
  category: string;
  description?: string;
  price?: number | string;
  img?: string;
  route?: string;
};

type Promocion = {
  id: number;
  title: string;
  img: string;
  description: string;
  route: string;
  buttonText: string;
};

function Welcome() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [fav, setFav] = useState(false);
  const [promocionActiva, setPromocionActiva] = useState<Promocion | null>(
    null
  );

  const [favoritosGuardados, setFavoritosGuardados] = useState<Producto[]>([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<any>(null);
  const [productosDB, setProductosDB] = useState<Producto[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const favRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }

      if (fav && favRef.current && !favRef.current.contains(target)) {
        setFav(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fav]);

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

    try {
      const data = localStorage.getItem(`misFavoritos_${userId}`);
      setFavoritosGuardados(data ? JSON.parse(data) : []);
    } catch {
      setFavoritosGuardados([]);
    }
  }, [userId, fav]);

  useEffect(() => {
    const cargarProductos = async () => {
      const { data, error } = await supabase.from("productos").select("*");

      if (error) {
        console.log(error);
        return;
      }

      setProductosDB((data || []) as Producto[]);
    };

    cargarProductos();
  }, []);

  const promocionesWelcome: Promocion[] = [
    {
      id: 1,
      title: "Colección Hombre",
      img: menPromotion,
      description: "Looks urbanos para hombre con estilo Brand New.",
      route: "/sessions/men",
      buttonText: "Comprar",
    },
    {
      id: 2,
      title: "Colección Parejas",
      img: couplePromotion,
      description: "Prendas combinadas para parejas.",
      route: "/sessions/couple",
      buttonText: "Comprar",
    },
    {
      id: 3,
      title: "Colección Mujer",
      img: hoodiePromotion,
      description: "Hoodies y prendas exclusivas para mujer.",
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
      description: "Dos estilos, una conexión",
      route: "/sessions/couple",
    },
    {
      title: "Ropa de mujer",
      img: girl,
      className: "girl-welcome",
      cardClass: "card3",
      description: "Elegancia y actitud",
      route: "/sessions/girl",
    },
  ];

  const botonesMenu: [string, () => void | Promise<void>][] = [
    [
      "Cerrar sesión",
      async () => {
        await supabase.auth.signOut();
        navigate("/");
      },
    ],
    ["Crear producto", () => navigate("/create")],
    ["Mis compras", () => navigate("/my-purchases")],
    ["Nueva contraseña", () => navigate("/password")],
  ];

  const productosFiltrados = productosDB.filter((producto) => {
    const texto = busqueda.toLowerCase().trim();

    return (
      producto.name?.toLowerCase().includes(texto) ||
      producto.category?.toLowerCase().includes(texto) ||
      producto.description?.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <div className="menu">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {busqueda && (
            <>
              <span className="clear-search" onClick={() => setBusqueda("")}>
                ✕
              </span>

              <div className="search-results">
                {productosFiltrados.length > 0 ? (
                  productosFiltrados.map((producto) => (
                    <div
                      key={producto.id}
                      className="search-item"
                      onClick={() => {
                        navigate(`/sessions/${producto.category}`);
                        setBusqueda("");
                      }}
                    >
                      {producto.img && (
                        <img src={producto.img} alt={producto.name} />
                      )}

                      <div>
                        <h4>{producto.name}</h4>
                        <p>{producto.category}</p>
                        <span>${producto.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-results">No se encontraron productos</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="icon" ref={menuRef}>
          <FaUserCircle onClick={() => setMenuOpen(!menuOpen)} />

          {menuOpen && (
            <div className="dropdown">
              <h3>{user?.user_metadata?.name || user?.email?.split("@")[0]}</h3>

              {botonesMenu.map(([texto, accion]) => (
                <button key={texto} onClick={accion}>
                  {texto}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={favRef}>
          <FaHeart className="corazon" onClick={() => setFav(!fav)} />
        </div>

        {fav && (
          <div className="favorites-modal" ref={modalRef}>
            <h2>PRODUCTOS FAVORITOS</h2>

            {favoritosGuardados.length === 0 ? (
              <p>No tienes favoritos</p>
            ) : (
              favoritosGuardados.map((producto) => (
                <div
                  key={producto.id}
                  className="favorite-item"
                  onClick={() => producto.route && navigate(producto.route)}
                >
                  {producto.img && (
                    <img src={producto.img} alt={producto.name} />
                  )}

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
                (total, producto) => total + Number(producto.price || 0),
                0
              )}
            </h2>

            <button
              className="pago"
              onClick={(e) => {
                e.stopPropagation();

                navigate("/pago", {
                  state: {
                    productos: favoritosGuardados,
                    total: favoritosGuardados.reduce(
                      (total, producto) => total + Number(producto.price || 0),
                      0
                    ),
                  },
                });
              }}
            >
              Comprar
            </button>
          </div>
        )}
      </div>

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
            <button onClick={() => setPromocionActiva(null)}>✕</button>

            <img src={promocionActiva.img} alt={promocionActiva.title} />

            <h2>{promocionActiva.title}</h2>
            <p>{promocionActiva.description}</p>

            <button onClick={() => navigate(promocionActiva.route)}>
              {promocionActiva.buttonText}
            </button>
          </div>
        </div>
      )}

      <section className="cartas">
        {categoriasWelcome.map((categoria) => (
          <div key={categoria.title} className={categoria.cardClass}>
            <img
              src={categoria.img}
              alt={categoria.title}
              className={categoria.className}
              onClick={() => navigate(categoria.route)}
            />

            <div className="texto">
              <p>{categoria.description}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Welcome;