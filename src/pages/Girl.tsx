import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Girl.css";

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

  // 🔹 Carrito localStorage
  useEffect(() => {
    const data = localStorage.getItem("carrito_girl");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito_girl", JSON.stringify(carrito));
  }, [carrito]);

  // 🔥 Traer productos desde Supabase
  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "girl");

      if (!error && data) {
        const conTallas = data.map((p: any) => ({
          ...p,
          sizes:
            p.type === "zapatos"
              ? ["8", "10", "12", "14"]
              : ["XS", "S", "M", "L"],
        }));

        setProductosDB(conTallas);
      }
    };

    fetchProductos();
  }, []);

  // 🔹 Productos locales
  const productosLocales = [
    { id: 1, name: "Blusa", price: 90, img: blusa, description: "Blusa elegante para mujer", sizes: ["XS", "S", "M", "L"] },
    { id: 2, name: "Converse", price: 150, img: converse, description: "Converse clásicos", sizes: ["8", "10", "12", ""] },
    { id: 3, name: "Jeans", price: 130, img: jeans, description: "Jeans modernos", sizes: ["XS", "S", "M", "L"] },
    { id: 4, name: "Shorts", price: 100, img: shorts, description: "Shorts casuales", sizes: ["XS", "S", "M", "L"] },
    { id: 5, name: "Bolsa", price: 110, img: bolsa, description: "Bolsa de moda", sizes: ["Única"] },
    { id: 6, name: "Chaqueta", price: 170, img: chaqueta, description: "Chaqueta estilosa", sizes: ["XS", "S", "M", "L"] },
  ];

  const productos = [...productosLocales, ...productosDB];

  // 🔥 Abrir producto (reset talla)
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
        src="https://i.pinimg.com/1200x/fc/7b/f6/fc7bf6b2cc9a44d7de759648f952c763.jpg"
        className="girl-fondo"
      />

      <h1 className="girl-title">Brand New for girl</h1>

      <button className="girl-salida" onClick={() => navigate("/welcome")}>
        ✕
      </button>

      <button className="girl-mostrar" onClick={() => setMostrarCarrito(true)}>
        Compras
      </button>

      <button className="btn-create" onClick={() => navigate("/create?category=girl")}>
        + Crear
      </button>

      {/* 🔥 GRID */}
      <div className="girl-scroll">
        <section className="girl-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="girl-card"
              onClick={() => abrirProducto(producto)}
            >
              <img src={producto.img} />
            </div>
          ))}
        </section>
      </div>

      {/* MODAL PRODUCTO */}
      {productoActivo && (
        <div className="girl-modal" onClick={cerrarProducto}>
          <div
            className="girl-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={productoActivo.img} />
            <h2>{productoActivo.name}</h2>
            <p>{productoActivo.description}</p>
            <span className="girl-precio">$ {productoActivo.price}</span>

            <button onClick={agregarAlCarrito} className="girl-btn-carrito">
              Agregar al carrito
            </button>

            <button onClick={cerrarProducto} className="girl-btn-cerrar">
              ✕
            </button>

            {/* 🔥 TALLAS */}
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
          </div>
        </div>
      )}

      {/* CARRITO */}
      {mostrarCarrito && (
        <div className="girl-modal" onClick={() => setMostrarCarrito(false)}>
          <div
            className="girl-modal-content"
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

export default Girl;