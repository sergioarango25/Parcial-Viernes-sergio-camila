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

  // 🔹 Carrito desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("carrito_couple");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito_couple", JSON.stringify(carrito));
  }, [carrito]);

  // 🔥 Traer productos desde Supabase
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

  // 🔹 Productos locales
  const productosLocales = [
    { id: 1, name: "Couple Set", price: 250, img: couple, description: "Set de ropa para parejas", sizes: ["S", "M", "L", "XL"] },
    { id: 2, name: "Black Match", price: 200, img: black, description: "Outfit negro a juego", sizes: ["S", "M", "L", "XL"] },
    { id: 3, name: "Blue Match", price: 200, img: blue, description: "Outfit azul a juego", sizes: ["S", "M", "L", "XL"] },
    { id: 4, name: "Vans Couple", price: 180, img: vans, description: "Vans para parejas", sizes: ["38", "39", "40", "41"] },
    { id: 5, name: "Llavero", price: 50, img: llavero, description: "Llavero para parejas", sizes: ["Único"] },
    { id: 6, name: "Alfombra", price: 120, img: alfombra, description: "Alfombra especial para parejas", sizes: ["Único"] },
  ];

  const productos = [...productosLocales, ...productosDB];

  // 🔥 Abrir producto (resetea talla)
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

      {/* 🔥 GRID */}
      <div className="couple-scroll">
        <section className="couple-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="couple-card"
              onClick={() => abrirProducto(producto)}
            >
              <img src={producto.img} />
            </div>
          ))}
        </section>
      </div>

      {/* MODAL PRODUCTO */}
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

            <button onClick={agregarAlCarrito} className="couple-btn-carrito">
              Agregar al carrito
            </button>

            <button onClick={cerrarProducto} className="couple-btn-cerrar">
              ✕
            </button>

            {/* 🔥 TALLAS */}
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

      {/* CARRITO */}
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