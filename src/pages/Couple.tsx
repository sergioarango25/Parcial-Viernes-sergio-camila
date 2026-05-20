import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Couple.css";
import { FaShoppingBag } from "react-icons/fa";

import couple from "../assets/couple/couple.png";
import black from "../assets/couple/black.png";
import blue from "../assets/couple/blue.png";
import vans from "../assets/couple/vans.png";
import llavero from "../assets/couple/llavero.png";
import alfombra from "../assets/couple/alfombra.png";

function Couple() {
  const navigate = useNavigate();

  const [productoActivo, setProductoActivo] = useState<any>(null);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito_couple") || "[]"));

    const cargarFavoritos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const guardados = JSON.parse(
        localStorage.getItem(`misFavoritos_${user.id}`) || "[]"
      );

      const objeto: { [key: number]: boolean } = {};

      guardados.forEach((item: any) => {
        objeto[item.id] = true;
      });

      setFavoritos(objeto);
    };

    const cargarProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "couple");

      if (!error && data) {
        setProductosDB(
          data.map((p: any) => ({
            ...p,
            sizes:
              p.type === "zapatos"
                ? ["38", "39", "40", "41"]
                : ["S", "M", "L", "XL"],
          }))
        );
      }
    };

    cargarFavoritos();
    cargarProductos();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "carrito_couple",
      JSON.stringify(carrito)
    );
  }, [carrito]);

  const productosLocales = [
    {
      id: 1,
      name: "Couple Set",
      price: 250,
      img: couple,
      description: "Set de ropa para parejas",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Black Match",
      price: 200,
      img: black,
      description: "Outfit negro a juego",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 3,
      name: "Blue Match",
      price: 200,
      img: blue,
      description: "Outfit azul a juego",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 4,
      name: "Vans Couple",
      price: 180,
      img: vans,
      description: "Vans para parejas",
      sizes: ["38", "39", "40", "41"],
    },
    {
      id: 5,
      name: "Llavero",
      price: 50,
      img: llavero,
      description: "Llavero para parejas",
      sizes: ["Único"],
    },
    {
      id: 6,
      name: "Alfombra",
      price: 120,
      img: alfombra,
      description: "Alfombra especial para parejas",
      sizes: ["Único"],
    },
  ];

  const productos = [...productosLocales, ...productosDB];

  const abrirProducto = (producto: any) => {
    setProductoActivo(producto);
    setTallaSeleccionada(null);
  };

  const cerrarProducto = () => setProductoActivo(null);

  const agregarAlCarrito = () => {
    if (!tallaSeleccionada) {
      alert("Selecciona una talla");
      return;
    }

    setCarrito([
      ...carrito,
      {
        name: productoActivo.name,
        price: productoActivo.price,
        talla: tallaSeleccionada,
        img: productoActivo.img,
      },
    ]);

    cerrarProducto();
  };

  const eliminarProducto = (index: number) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  return (
    <>
      <img
        src="https://i.pinimg.com/1200x/f5/a6/1a/f5a61aed83c15b21ef46d9c95a1ee020.jpg"
        className="couple-fondo"
      />

      <h1 className="couple-title">
        Brand New for couples
      </h1>

      <button
        className="couple-salida"
        onClick={() => navigate("/welcome")}
      >
        ✕
      </button>

      <button
        className="couple-mostrar"
        onClick={() => setMostrarCarrito(true)}
      >
        <FaShoppingBag />
      </button>

      <div className="couple-scroll">
        <section className="couple-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="couple-card"
              onClick={() => abrirProducto(producto)}
            >
              <button
                className={`btn-favorito ${
                  favoritos[producto.id] ? "activo" : ""
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="icono-corazon"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <img src={producto.img} />
            </div>
          ))}
        </section>
      </div>

      {productoActivo && (
        <div
          className="couple-modal"
          onClick={cerrarProducto}
        >
          <div
            className="couple-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={productoActivo.img} />

            <h2>{productoActivo.name}</h2>

            <p>{productoActivo.description}</p>

            <span className="couple-precio">
              $ {productoActivo.price}
            </span>

            <button
              onClick={agregarAlCarrito}
              className="couple-btn-carrito"
            >
              Agregar al carrito
            </button>

            <button
              onClick={cerrarProducto}
              className="couple-btn-cerrar"
            >
              ✕
            </button>

            <div className="couple-tallas">
              {(productoActivo?.sizes || []).map(
                (talla: string) => (
                  <button
                    key={talla}
                    className={`couple-talla-btn ${
                      tallaSeleccionada === talla
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setTallaSeleccionada(talla)
                    }
                  >
                    {talla}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarCarrito && (
        <div
          className="cart-overlay"
          onClick={() => setMostrarCarrito(false)}
        >
          <div
            className="cart-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2>Tu carrito</h2>

              <button
                className="cart-close"
                onClick={() => setMostrarCarrito(false)}
              >
                ✕
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
                    <div
                      key={index}
                      className="cart-item"
                    >
                      <div className="cart-left">
                        <img
                          src={item.img}
                          className="cart-img"
                        />

                        <div className="cart-info">
                          <h3>{item.name}</h3>

                          <p>
                            Talla:
                            <span> {item.talla}</span>
                          </p>
                        </div>
                      </div>

                      <div className="cart-right">
                        <span className="cart-price">
                          $ {item.price}
                        </span>

                        <button
                          className="cart-delete"
                          onClick={() =>
                            eliminarProducto(index)
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <h3>
                    Total: $
                    {carrito.reduce(
                      (total, item) =>
                        total + Number(item.price),
                      0
                    )}
                  </h3>

                  <button className="cart-buy">
                    Finalizar compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Couple;