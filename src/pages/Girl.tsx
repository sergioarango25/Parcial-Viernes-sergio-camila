import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Girl.css";
import { FaShoppingBag } from "react-icons/fa";

import blusa from "../assets/girl/blusa.png";
import converse from "../assets/girl/converse.png";
import jeans from "../assets/girl/jeans.png";
import shorts from "../assets/girl/shorts.png";
import bolsa from "../assets/girl/bolsa.png";
import chaqueta from "../assets/girl/chaqueta.png";

function Girl() {
  const navigate = useNavigate();

  const [productoActivo, setProductoActivo] = useState<any>(null);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});

  const productosLocales = [
    { id: 1, name: "Blusa", price: 90, img: blusa, description: "Blusa elegante para mujer", sizes: ["XS", "S", "M", "L"] },
    { id: 2, name: "Converse", price: 150, img: converse, description: "Converse clásicos", sizes: ["37", "38", "39", "40"] },
    { id: 3, name: "Jeans", price: 130, img: jeans, description: "Jeans modernos", sizes: ["XS", "S", "M", "L"] },
    { id: 4, name: "Shorts", price: 100, img: shorts, description: "Shorts casuales", sizes: ["XS", "S", "M", "L"] },
    { id: 5, name: "Bolsa", price: 110, img: bolsa, description: "Bolsa de moda", sizes: ["Única"] },
    { id: 6, name: "Chaqueta", price: 170, img: chaqueta, description: "Chaqueta estilosa", sizes: ["XS", "S", "M", "L"] },
  ];

  const productos = [...productosLocales, ...productosDB];

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito_girl") || "[]"));
    setCalificaciones(JSON.parse(localStorage.getItem("ratings_girl") || "{}"));

    const cargarDatos = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const guardados = JSON.parse(localStorage.getItem(`misFavoritos_${user.id}`) || "[]");
        const favs: { [key: number]: boolean } = {};
        guardados.forEach((item: any) => (favs[item.id] = true));
        setFavoritos(favs);
      }

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "girl");

      if (!error && data) {
        setProductosDB(
          data.map((p: any) => ({
            ...p,
            sizes: p.type === "zapatos" ? ["37", "38", "39", "40"] : ["XS", "S", "M", "L"],
          }))
        );
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito_girl", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem("ratings_girl", JSON.stringify(calificaciones));
  }, [calificaciones]);

  const abrirProducto = (producto: any) => {
    setProductoActivo(producto);
    setTallaSeleccionada(null);
  };

  const agregarAlCarrito = () => {
    if (!tallaSeleccionada) return alert("Selecciona una talla");

    setCarrito([
      ...carrito,
      {
        name: productoActivo.name,
        price: productoActivo.price,
        talla: tallaSeleccionada,
        img: productoActivo.img,
      },
    ]);

    setProductoActivo(null);
  };

  const eliminarProducto = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const toggleFavorito = async (producto: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const guardados = JSON.parse(localStorage.getItem(`misFavoritos_${user.id}`) || "[]");
    const existe = guardados.find((item: any) => item.id === producto.id);

    const nuevos = existe
      ? guardados.filter((item: any) => item.id !== producto.id)
      : [...guardados, { ...producto, route: "/sessions/girl" }];

    localStorage.setItem(`misFavoritos_${user.id}`, JSON.stringify(nuevos));
    setFavoritos({ ...favoritos, [producto.id]: !favoritos[producto.id] });
  };

  return (
    <>
      <img
        src="https://i.pinimg.com/1200x/fc/7b/f6/fc7bf6b2cc9a44d7de759648f952c763.jpg"
        className="girl-fondo"
      />

      <h1 className="girl-title">Brand New for girl</h1>

      <button className="girl-salida" onClick={() => navigate("/welcome")}>✕</button>

      <button className="girl-mostrar" onClick={() => setMostrarCarrito(true)}>
        <FaShoppingBag />
      </button>

      <div className="girl-scroll">
        <section className="girl-contenedor-ropa">
          {productos.map((producto, index) => (
            <div key={index} className="girl-card" onClick={() => abrirProducto(producto)}>
              <button
                className={`btn-favorito ${favoritos[producto.id] ? "activo" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorito(producto);
                }}
              >
                <svg viewBox="0 0 24 24" className="icono-corazon">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <img src={producto.img} />
            </div>
          ))}
        </section>
      </div>

      {productoActivo && (
        <div className="girl-modal" onClick={() => setProductoActivo(null)}>
          <div className="girl-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={productoActivo.img} />

            <h2>{productoActivo.name}</h2>
            <p>{productoActivo.description}</p>
            <span className="girl-precio">$ {productoActivo.price}</span>

            <div className="rating-temu-modal">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  className="rating-star-modal"
                  onClick={() =>
                    setCalificaciones({
                      ...calificaciones,
                      [productoActivo.id]:
                        calificaciones[productoActivo.id] === estrella ? estrella - 0.5 : estrella,
                    })
                  }
                >
                  {calificaciones[productoActivo.id] >= estrella
                    ? "★"
                    : calificaciones[productoActivo.id] >= estrella - 0.5
                    ? "⯨"
                    : "☆"}
                </button>
              ))}
            </div>

            <p className="rating-numero">{calificaciones[productoActivo.id] || 0} / 5</p>

            <button onClick={agregarAlCarrito} className="girl-btn-carrito">
              Agregar al carrito
            </button>

            <button onClick={() => setProductoActivo(null)} className="girl-btn-cerrar">
              ✕
            </button>

            <div className="girl-tallas">
              {(productoActivo?.sizes || []).map((talla: string) => (
                <button
                  key={talla}
                  className={`girl-talla-btn ${tallaSeleccionada === talla ? "active" : ""}`}
                  onClick={() => setTallaSeleccionada(talla)}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mostrarCarrito && (
        <div className="cart-overlay" onClick={() => setMostrarCarrito(false)}>
          <div className="cart-container" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Tu carrito</h2>
              <button className="cart-close" onClick={() => setMostrarCarrito(false)}>
                ×
              </button>
            </div>

            {carrito.length === 0 ? (
              <div className="cart-empty">
                <h3>Carrito vacío</h3>
                <p>Agrega prendas para continuar.</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrito.map((item, index) => (
                    <div key={index} className="cart-item">
                      <div className="cart-left">
                        <img src={item.img} className="cart-img" />

                        <div className="cart-info">
                          <h3>{item.name}</h3>
                          <p>
                            Talla: <span>{item.talla}</span>
                          </p>
                        </div>
                      </div>

                      <div className="cart-right">
                        <span className="cart-price">$ {item.price}</span>

                        <button className="cart-delete" onClick={() => eliminarProducto(index)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <h3>
                    Total: $
                    {carrito.reduce((total, item) => total + Number(item.price), 0)}
                  </h3>

                  <button className="cart-buy">Finalizar compra</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Girl;