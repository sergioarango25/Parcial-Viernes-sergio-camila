import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Couple.css";

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
  const [calificaciones, setCalificaciones] = useState<{ [key: number]: number }>({});
  const [favoritos, setFavoritos] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const data = localStorage.getItem("carrito_couple");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito_couple", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    const data = localStorage.getItem("ratings_couple");
    if (data) setCalificaciones(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("ratings_couple", JSON.stringify(calificaciones));
  }, [calificaciones]);

  useEffect(() => {
    const data = localStorage.getItem("favoritos_couple");
    if (data) setFavoritos(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("favoritos_couple", JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "couple");

      if (!error && data) {
        const conTallas = data.map((p: any) => ({
          ...p,
          sizes:
            p.type === "zapatos"
              ? ["38", "39", "40", "41"]
              : ["S", "M", "L", "XL"],
        }));
        setProductosDB(conTallas);
      }
    };

    fetchProductos();
  }, []);

  const productosLocales = [
    { id: 1, name: "Couple Set", price: 250, img: couple, description: "Set de ropa para parejas", sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Black Match", price: 200, img: black, description: "Outfit negro a juego", sizes: ["S", "M", "L", "XL"] },
    { id: 3, name: "Blue Match", price: 200, img: blue, description: "Outfit azul a juego", sizes: ["S", "M", "L", "XL"] },
    { id: 4, name: "Vans Couple", price: 180, img: vans, description: "Vans para parejas", sizes: ["38", "39", "40", "41"] },
    { id: 5, name: "Llavero", price: 50, img: llavero, description: "Llavero para parejas", sizes: ["Único"] },
    { id: 6, name: "Alfombra", price: 120, img: alfombra, description: "Alfombra especial para parejas", sizes: ["Único"] },
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
      },
    ]);

    cerrarProducto();
  };

  const eliminarProducto = (index: number) => {
    const nuevo = [...carrito];
    nuevo.splice(index, 1);
    setCarrito(nuevo);
  };

  return (
    <>
      <img
        src="https://i.pinimg.com/1200x/f5/a6/1a/f5a61aed83c15b21ef46d9c95a1ee020.jpg"
        className="couple-fondo"
      />

      <h1 className="couple-title">Brand New for couples</h1>

      <button className="couple-salida" onClick={() => navigate("/welcome")}>
        ✕
      </button>

      <button className="couple-mostrar" onClick={() => setMostrarCarrito(true)}>
        Compras
      </button>

      <button className="btn-create" onClick={() => navigate("/create?category=couple")}>
        + Crear
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
                className={`btn-favorito ${favoritos[producto.id] ? "activo" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setFavoritos({
                    ...favoritos,
                    [producto.id]: !favoritos[producto.id],
                  });
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
        <div className="couple-modal" onClick={cerrarProducto}>
          <div
            className="couple-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={productoActivo.img} />
            <h2>{productoActivo.name}</h2>
            <p>{productoActivo.description}</p>
            <span className="couple-precio">$ {productoActivo.price}</span>

            {/*  ESTRELLAS EN EL MODAL */}
            <div className="rating-temu-modal">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  className="rating-star-modal"
                  onClick={() =>
                    setCalificaciones({
                      ...calificaciones,
                      [productoActivo.id]: estrella,
                    })
                  }
                >
                  {calificaciones[productoActivo.id] >= estrella ? "★" : "☆"}
                </button>
              ))}
            </div>

            <button onClick={agregarAlCarrito} className="couple-btn-carrito">
              Agregar al carrito
            </button>

            <button onClick={cerrarProducto} className="couple-btn-cerrar">
              ✕
            </button>

            <div className="couple-tallas">
              {(productoActivo?.sizes || []).map((talla: string) => (
                <button
                  key={talla}
                  className={`couple-talla-btn ${
                    tallaSeleccionada === talla ? "active" : ""
                  }`}
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
        <div className="couple-modal" onClick={() => setMostrarCarrito(false)}>
          <div
            className="couple-modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Tu carrito</h2>

            {carrito.length === 0 ? (
              <p>Vacío</p>
            ) : (
              carrito.map((item, index) => (
                <div key={index}>
                  {item.name} - {item.talla} - ${item.price}
                  <button onClick={() => eliminarProducto(index)}>X</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Couple;