import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Men.css";
import { FaShoppingBag } from "react-icons/fa";

import jacket from "../assets/men/jacket.png";
import polo from "../assets/men/polo.png";
import shorts from "../assets/men/shorts.png";
import gorra from "../assets/men/gorra.png";
import angel from "../assets/men/angel.png";
import shoes from "../assets/men/shoes.png";

function Men() {
  const navigate = useNavigate();

  const [productoActivo, setProductoActivo] = useState<any>(null);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito") || "[]"));
    setCalificaciones(JSON.parse(localStorage.getItem("ratings_men") || "{}"));

    const cargarFavoritos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const guardados = JSON.parse(
        localStorage.getItem(`misFavoritos_${user?.id}`) || "[]"
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
        .eq("category", "men");

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
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem(
      "ratings_men",
      JSON.stringify(calificaciones)
    );
  }, [calificaciones]);

  const productosLocales = [
    {
      id: 1,
      name: "Chaqueta negra",
      price: 180,
      img: jacket,
      description: "Chaqueta negra de cuero perfecta",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 2,
      name: "Polo hombre",
      price: 120,
      img: polo,
      description: "Polo casual elegante",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 3,
      name: "Shorts",
      price: 130,
      img: shorts,
      description: "Shorts urbanos",
      sizes: ["38", "39", "40", "41"],
    },
    {
      id: 4,
      name: "Gorra",
      price: 90,
      img: gorra,
      description: "Gorra Brand New",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 5,
      name: "Angel",
      price: 125,
      img: angel,
      description: "Camiseta angel",
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 6,
      name: "Zapatos",
      price: 200,
      img: shoes,
      description: "Zapatos urbanos",
      sizes: ["38", "39", "40", "41"],
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
        src="https://i.pinimg.com/1200x/72/1b/35/721b35c2210b7b751b76d25ecfdc577e.jpg"
        className="men-fondo"
      />

      <h1 className="men-title">Brand New for men</h1>

      <button
        className="men-salida"
        onClick={() => navigate("/welcome")}
      >
        ✕
      </button>

      <button
        className="men-mostrar"
        onClick={() => setMostrarCarrito(true)}
      >
        <FaShoppingBag />
      </button>

      <div className="men-scroll">
        <section className="men-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="men-card"
              onClick={() => abrirProducto(producto)}
            >
              <button
                className={`btn-favorito ${
                  favoritos[producto.id] ? "activo" : ""
                }`}
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
        <div className="men-modal" onClick={cerrarProducto}>
          <div
            className="men-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={productoActivo.img} />

            <h2>{productoActivo.name}</h2>

            <p>{productoActivo.description}</p>

            <span className="men-precio">
              $ {productoActivo.price}
            </span>

            <button
              onClick={agregarAlCarrito}
              className="men-btn-carrito"
            >
              Agregar al carrito
            </button>

            <button
              onClick={cerrarProducto}
              className="men-btn-cerrar"
            >
              ✕
            </button>

            <div className="men-tallas">
              {(productoActivo?.sizes || []).map(
                (talla: string) => (
                  <button
                    key={talla}
                    className={`men-talla-btn ${
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
                <h3>Tu carrito está vacío</h3>

                <p>Agrega productos increíbles</p>
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
                      (acc, item) => acc + item.price,
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

export default Men;