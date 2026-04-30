import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Men.css";

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

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    const data = localStorage.getItem("ratings_men");
    if (data) setCalificaciones(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("ratings_men", JSON.stringify(calificaciones));
  }, [calificaciones]);

  useEffect(() => {
    const fetchProductos = async () => {
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .eq("category", "men");

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
    { id: 1, name: "Chaqueta negra", price: 180, img: jacket, description: "Chaqueta negra de cuero perfecta", sizes: ["S","M","L","XL"] },
    { id: 2, name: "Polo hombre", price: 120, img: polo, description: "Polo casual elegante", sizes: ["S","M","L","XL"] },
    { id: 3, name: "Shorts", price: 130, img: shorts, description: "Shorts urbanos", sizes: ["38","39","40","41"] },
    { id: 4, name: "Gorra", price: 90, img: gorra, description: "Gorra Brand New", sizes: ["S","M","L","XL"] },
    { id: 5, name: "Angel", price: 125, img: angel, description: "Camiseta angel", sizes: ["S","M","L","XL"] },
    { id: 6, name: "Zapatos", price: 200, img: shoes, description: "Zapatos urbanos", sizes: ["38","39","40","41"] },
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
        src="https://i.pinimg.com/1200x/72/1b/35/721b35c2210b7b751b76d25ecfdc577e.jpg"
        className="men-fondo"
      />

      <h1 className="men-title">Brand New for men</h1>

      <button className="men-salida" onClick={() => navigate("/welcome")}>
        ✕
      </button>

      <button className="men-mostrar" onClick={() => setMostrarCarrito(true)}>
        Compras
      </button>

      <button className="btn-create" onClick={() => navigate("/create?category=men")}>
        + Crear
      </button>

      <div className="men-scroll">
        <section className="men-contenedor-ropa">
          {productos.map((producto, index) => (
            <div
              key={index}
              className="men-card"
              onClick={() => abrirProducto(producto)}
            >
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
            <span className="men-precio">$ {productoActivo.price}</span>

            {/* ESTRELLAS EN EL MODAL */}
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

            <button onClick={agregarAlCarrito} className="men-btn-carrito">
              Agregar al carrito
            </button>

            <button onClick={cerrarProducto} className="men-btn-cerrar">
              ✕
            </button>

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
          </div>
        </div>
      )}

      {mostrarCarrito && (
        <div className="men-modal" onClick={() => setMostrarCarrito(false)}>
          <div
            className="men-modal-contenido"
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

export default Men;