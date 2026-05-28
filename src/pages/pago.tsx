import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

import visa from "../assets/visa.jpg";
import nequi from "../assets/nequi.jpg";
import pse from "../assets/pse.jpg";
import efecty from "../assets/efecty.png";
import bancopopular from "../assets/bancopopular.jpg";

import "../styles/Responsive.css";
import "../styles/pago.css";

function Pago() {
  const navigate = useNavigate();
  const location = useLocation();

  // productos enviados desde carrito
  const productos = location.state?.productos || [];

  // total
  const total = productos.reduce(
    (acc: number, item: any) =>
      acc + Number(item.price),
    0
  );

  const [metodo, setMetodo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // tarjeta
  const [numero, setNumero] = useState("");
  const [cvv, setCvv] = useState("");

  const [errores, setErrores] = useState<{
    numero?: string;
    cvv?: string;
  }>({});

  const pagar = async () => {
    let nuevosErrores: any = {};

    // VALIDAR TARJETA
    if (
      (metodo === "credito" ||
        metodo === "debito") &&
      numero.length !== 16
    ) {
      nuevosErrores.numero =
        "La tarjeta debe tener 16 números";
    }

    // VALIDAR CVV
    if (
      (metodo === "credito" ||
        metodo === "debito") &&
      cvv.length !== 3
    ) {
      nuevosErrores.cvv =
        "El CVV debe tener 3 números";
    }

    setErrores(nuevosErrores);

    if (
      Object.keys(nuevosErrores).length > 0
    ) {
      setMensaje("❌ Corrige los errores");
      return;
    }

    // OBTENER USUARIO
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMensaje("❌ Usuario no autenticado");
      return;
    }

    // COMPRAS DEL USUARIO
    const keyCompras = `misCompras_${user.id}`;

    const comprasGuardadas = JSON.parse(
      localStorage.getItem(keyCompras) || "[]"
    );

    // NUEVA COMPRA
    const nuevaCompra = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      productos,
      total,
      metodo,
    };

    // GUARDAR
    localStorage.setItem(
      keyCompras,
      JSON.stringify([
        ...comprasGuardadas,
        nuevaCompra,
      ])
    );

    // LIMPIAR CARRITOS
    localStorage.removeItem("carrito");
    localStorage.removeItem("carrito_girl");
    localStorage.removeItem("carrito_couple");

    setMensaje(
      "✅ Pago realizado correctamente"
    );

    setTimeout(() => {
      navigate("/welcome");
    }, 2000);
  };

  return (
    <div className="pago-container">
      {/* IZQUIERDA */}
      <div className="pago-card">
        <h2>Elige cómo pagar</h2>

        {/* BANCO */}
        <div className="metodo-pago">
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("banco")}
          />

          <img
            src={bancopopular}
            alt="Banco"
            width="50"
          />

          <span>Banco Popular</span>
        </div>

        {/* NEQUI */}
        <div className="metodo-pago">
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("nequi")}
          />

          <img
            src={nequi}
            alt="Nequi"
            width="50"
          />

          <span>Nequi</span>
        </div>

        {/* VISA */}
        <div className="metodo-pago">
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("visa")}
          />

          <img
            src={visa}
            alt="Visa"
            width="50"
          />

          <span>Visa</span>
        </div>

        <h4 className="titulo-seccion">
          Tarjetas
        </h4>

        <div className="botones-tarjeta">
          <button
            onClick={() =>
              setMetodo("credito")
            }
          >
            Crédito
          </button>

          <button
            onClick={() =>
              setMetodo("debito")
            }
          >
            Débito
          </button>
        </div>

        <h4 className="titulo-seccion">
          Otros
        </h4>

        {/* PSE */}
        <div className="metodo-pago">
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("pse")}
          />

          <img
            src={pse}
            alt="PSE"
            width="50"
          />

          <span>PSE</span>
        </div>

        {/* EFECTY */}
        <div className="metodo-pago">
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("efecty")}
          />

          <img
            src={efecty}
            alt="Efecty"
            width="50"
          />

          <span>Efecty</span>
        </div>

        {/* DATOS TARJETA */}
        {(metodo === "credito" ||
          metodo === "debito") && (
          <div className="datos-tarjeta">
            <h4>Datos de la tarjeta</h4>

            {/* NUMERO */}
            <div className="input-container">
              <input
                type="text"
                placeholder="Número de tarjeta"
                maxLength={16}
                value={numero}
                onChange={(e) =>
                  setNumero(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                className="input-pago"
              />

              <span className="contador-input">
                {numero.length}/16
              </span>
            </div>

            {errores.numero && (
              <p className="error">
                {errores.numero}
              </p>
            )}

            {/* CVV */}
            <div className="input-container">
              <input
                type="text"
                placeholder="CVV"
                maxLength={3}
                value={cvv}
                onChange={(e) =>
                  setCvv(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
                className="input-pago"
              />

              <span className="contador-input">
                {cvv.length}/3
              </span>
            </div>

            {errores.cvv && (
              <p className="error">
                {errores.cvv}
              </p>
            )}
          </div>
        )}

        <button
          disabled={!metodo}
          onClick={pagar}
          className="btn-confirmar"
        >
          Confirmar pago
        </button>

        <p className="mensaje">{mensaje}</p>
      </div>

      {/* DERECHA */}
      <div className="resumen-card">
        <h3>Resumen de compra</h3>

        {productos.length === 0 ? (
          <p>
            No hay productos seleccionados
          </p>
        ) : (
          productos.map(
            (
              producto: any,
              index: number
            ) => (
              <div
                key={index}
                className="producto-resumen"
              >
                <p>{producto.name}</p>

                <p>$ {producto.price}</p>

                {producto.talla && (
                  <span>
                    Talla: {producto.talla}
                  </span>
                )}
              </div>
            )
          )
        )}

        <p>Envío: Gratis</p>

        <hr />

        <h2>Total: $ {total}</h2>
      </div>
    </div>
  );
}

export default Pago;