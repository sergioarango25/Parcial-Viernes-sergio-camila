import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Girl.css";
import { FaShoppingBag } from "react-icons/fa";

function Girl() {
  const navigate = useNavigate();

  const [productoActivo, setProductoActivo] = useState<any>(null);
  const [carrito, setCarrito] = useState<any[]>([]);
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});
  const [userId, setUserId] = useState("");

  const productos = productosDB;

  useEffect(() => {
    const cargarDatos = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const carritoGuardado = JSON.parse(
        localStorage.getItem(`carrito_girl_${user.id}`) || "[]"
      );
      setCarrito(carritoGuardado);

      setCalificaciones(
        JSON.parse(localStorage.getItem("ratings_girl") || "{}")
      );

      const guardados = JSON.parse(
        localStorage.getItem(`misFavoritos_${user.id}`) || "[]"
      );

      const favs: any = {};
      guardados.forEach((item: any) => {
        favs[item.id] = true;
      });
      setFavoritos(favs);

      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "girl");

      if (!error && data) {
        setProductosDB(
          data.map((p: any) => ({
            ...p,
            sizes:
              p.type === "zapatos"
                ? ["37", "38", "39", "40"]
                : ["XS", "S", "M", "L"],
          }))
        );
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `carrito_girl_${userId}`,
        JSON.stringify(carrito)
      );
    }
  }, [carrito, userId]);

  useEffect(() => {
    localStorage.setItem(
      "ratings_girl",
      JSON.stringify(calificaciones)
    );
  }, [calificaciones]);

  const abrirProducto = (producto: any) => {
    setProductoActivo(producto);
    setTallaSeleccionada(null);
  };

  const cerrarProducto = () => {
    setProductoActivo(null);
    setTallaSeleccionada(null);
  };

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

  const toggleFavorito = async (producto: any) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const guardados = JSON.parse(
      localStorage.getItem(`misFavoritos_${user.id}`) || "[]"
    );

    const existe = guardados.find((item: any) => item.id === producto.id);

    const nuevos = existe
      ? guardados.filter((item: any) => item.id !== producto.id)
      : [...guardados, { ...producto, route: "/sessions/girl" }];

    localStorage.setItem(
      `misFavoritos_${user.id}`,
      JSON.stringify(nuevos)
    );

    setFavoritos({
      ...favoritos,
      [producto.id]: !favoritos[producto.id],
    });
  };

  return (
    <>
      <img
        src="https://i.pinimg.com/1200x/fc/7b/f6/fc7bf6b2cc9a44d7de759648f952c763.jpg"
        className="girl-fondo"
      />

      <h1 className="girl-title">Brand New for girl</h1>

      {/* BOTÓN CARRITO */}
      <button
        className="girl-mostrar"
        onClick={() => setMostrarCarrito(true)}
      >
        <FaShoppingBag />
      </button>

      {/* PRODUCTOS */}
      <div className="girl-scroll">
        <section className="girl-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="girl-card"
              onClick={() => abrirProducto(producto)}
            >
              <button
                className={`btn-favorito ${
                  favoritos[producto.id] ? "activo" : ""
                }`}
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

      {/* MODAL PRODUCTO */}
      {productoActivo && (
        <div className="girl-modal" onClick={cerrarProducto}>
          <div
            className="girl-modal-contenido horizontal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="girl-btn-cerrar"
              onClick={cerrarProducto}
            >
              ✕
            </button>

            <div className="modal-left">
              <img src={productoActivo.img} />
            </div>

            <div className="modal-right girl-info">
              <h2>{productoActivo.name}</h2>
              <p>{productoActivo.description}</p>


              <span className="girl-precio">
                ${productoActivo.price}
              </span>

              {/* TALLAS */}
              <div className="girl-tallas">
                {(productoActivo?.sizes || []).map((talla: string) => (
                  <button
                    key={talla}
                    className={`girl-talla-btn ${
                      tallaSeleccionada === talla ? "active" : ""
                    }`}
                    onClick={() => setTallaSeleccionada(talla)}
                  >
                    {talla}
                  </button>
                ))}
              </div>

              <button
                className="girl-btn-carrito"
                onClick={agregarAlCarrito}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🛒 CARRITO GIRL */}
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
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrito.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.img} className="cart-img" />

                      <div>
                        <h3>{item.name}</h3>
                        <p>Talla: {item.talla}</p>
                        <p>$ {item.price}</p>

                        <button
                          className="cart-delete"
                          onClick={() =>
                            setCarrito(
                              carrito.filter((_, i) => i !== index)
                            )
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
                      (acc, item) => acc + Number(item.price),
                      0
                    )}
                  </h3>

                  <button
                    className="cart-buy"
                    onClick={() => {
                      localStorage.setItem(
                        "checkoutProductos",
                        JSON.stringify(carrito)
                      );

                      navigate("/pago", {
                        state: {
                          productos: carrito,
                          total: carrito.reduce(
                            (acc, item) =>
                              acc + Number(item.price),
                            0
                          ),
                        },
                      });
                    }}
                  >
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

export default Girl;