import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Men.css";
import { FaShoppingBag } from "react-icons/fa";

function Men() {
  const navigate = useNavigate();

  const [productoActivo, setProductoActivo] = useState<any>(null);

  // ✅ carrito persistente seguro
  const [carrito, setCarrito] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("carrito_men");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productosDB, setProductosDB] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});

  // 💾 persistencia carrito
  useEffect(() => {
    localStorage.setItem("carrito_men", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // ratings (evita crash si JSON vacío)
        const ratings = localStorage.getItem("ratings_men");
        if (ratings) JSON.parse(ratings);

        // usuario supabase
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const guardados = JSON.parse(
            localStorage.getItem(`misFavoritos_${user.id}`) || "[]"
          );

          const obj: { [key: number]: boolean } = {};
          guardados.forEach((item: any) => {
            obj[item.id] = true;
          });

          setFavoritos(obj);
        }

        // productos
        const { data, error } = await supabase
          .from("productos")
          .select("*")
          .eq("category", "men");

        if (error) {
          console.error("Error productos:", error.message);
          return;
        }

        if (data) {
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
      } catch (err) {
        console.error("Error general:", err);
      }
    };

    cargarDatos();
  }, []);

  const abrirProducto = (producto: any) => {
    setProductoActivo(producto);
    setTallaSeleccionada(null);
  };

  const cerrarProducto = () => {
    setProductoActivo(null);
    setTallaSeleccionada(null);
  };

  const agregarAlCarrito = () => {
    if (!productoActivo) return;

    if (!tallaSeleccionada) {
      alert("Selecciona una talla");
      return;
    }

    setCarrito((prev) => [
      ...prev,
      {
        name: productoActivo.name,
        price: Number(productoActivo.price),
        talla: tallaSeleccionada,
        img: productoActivo.img,
      },
    ]);

    cerrarProducto();
  };

  const eliminarProducto = (index: number) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const total = carrito.reduce((acc, item) => acc + Number(item.price || 0), 0);

  const productos = productosDB;

  return (
    <>
      <img
        src="https://i.pinimg.com/1200x/72/1b/35/721b35c2210b7b751b76d25ecfdc577e.jpg"
        className="men-fondo"
        alt="fondo"
      />

      <h1 className="men-title">Brand New for men</h1>

      <button className="men-mostrar" onClick={() => setMostrarCarrito(true)}>
        <FaShoppingBag />
      </button>

      {/* PRODUCTOS */}
      <div className="men-scroll">
        <section className="men-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={producto.id || index}
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

              <img src={producto.img} alt={producto.name} />
            </div>
          ))}
        </section>
      </div>

      {/* MODAL */}
      {productoActivo && (
        <div className="men-modal" onClick={cerrarProducto}>
          <div
            className="men-modal-contenido horizontal"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={cerrarProducto} className="men-btn-cerrar">
              ✕
            </button>

            <div className="modal-left">
              <img src={productoActivo.img} alt={productoActivo.name} />
            </div>

            <div className="modal-right">
              <h2>{productoActivo.name}</h2>
              <p>{productoActivo.description}</p>

              <span className="men-precio">
                ${productoActivo.price}
              </span>

              <div className="men-tallas">
                {(productoActivo?.sizes || []).map((talla: string) => (
                  <button
                    key={talla}
                    className={`men-talla-btn ${
                      tallaSeleccionada === talla ? "active" : ""
                    }`}
                    onClick={() => setTallaSeleccionada(talla)}
                  >
                    {talla}
                  </button>
                ))}
              </div>

              <button onClick={agregarAlCarrito} className="men-btn-carrito">
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARRITO */}
      {mostrarCarrito && (
        <div className="cart-overlay" onClick={() => setMostrarCarrito(false)}>
          <div className="cart-container" onClick={(e) => e.stopPropagation()}>
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
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {carrito.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.img} className="cart-img" alt="" />

                      <div>
                        <h3>{item.name}</h3>
                        <p>Talla: {item.talla}</p>
                        <p>$ {item.price}</p>

                        <button
                          className="cart-delete"
                          onClick={() => eliminarProducto(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <h3>${total}</h3>
                  </div>

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
                          total,
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

export default Men;