import visa from "./images/visa.jpg";
import nequi from "./images/nequi.jpg";
import pse from "./images/pse.jpg";
import efecty from "./images/efecty.png";
import bancopopular from "./images/bancopopular.jpg";
import React, { useState } from "react";
import "./App.css";

function App() {

  const [metodo, setMetodo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // DATOS TARJETA
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");
  const [errores, setErrores] = useState({});

  // FUNCIÓN PAGAR
  const pagar = () => {

    let nuevosErrores = {};

    // VALIDAR TARJETA
    if (
      (metodo === "credito" || metodo === "debito") &&
      numero.length !== 16
    ) {
      nuevosErrores.numero =
        "La tarjeta debe tener 16 números";
    }

    // VALIDAR FECHA
    if (
      (metodo === "credito" || metodo === "debito") &&
      !fecha.match(/^\d{2}\/\d{2}$/)
    ) {
      nuevosErrores.fecha =
        "La fecha debe tener formato MM/AA";
    }

    // VALIDAR CVV
    if (
      (metodo === "credito" || metodo === "debito") &&
      cvv.length !== 3
    ) {
      nuevosErrores.cvv =
        "El CVV debe tener 3 números";
    }

    // GUARDAR ERRORES
    setErrores(nuevosErrores);

    // SI HAY ERRORES
    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("❌ Corrige los errores");
      return;
    }

    // SI TODO SALE BIEN
    setMensaje("✅ Pago realizado correctamente");
  };

  return (
    <div className="container">

      {/* IZQUIERDA */}
      <div className="left">

        <h2>Elige cómo pagar</h2>

        <h4>Recomendados</h4>

        <div className={`card ${metodo === "banco" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("banco")}
          />

          <img src={bancopopular} alt="Banco Popular" />

          <span>Banco Popular **** 6410</span>

          <span className="badge">
            Hasta 9 cuotas sin interés
          </span>
        </div>

        <div className={`card ${metodo === "nequi" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("nequi")}
          />

          <img src={nequi} alt="Nequi" />

          <span>Nequi Débito **** 1074</span>
        </div>

        <div className={`card ${metodo === "visa" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("visa")}
          />

          <img src={visa} alt="Visa" />

          <span>Visa Débito **** 3411</span>
        </div>

        <h4>Tarjetas</h4>

        <div className={`card ${metodo === "credito" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("credito")}
          />

          <span>💳 Nueva tarjeta de crédito</span>
        </div>

        <div className={`card ${metodo === "debito" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("debito")}
          />

          <span>💳 Nueva tarjeta de débito</span>
        </div>

        <h4>Otros medios de pago</h4>

        <div className={`card ${metodo === "pse" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("pse")}
          />

          <img src={pse} alt="PSE" />

          <span>Transferencia con PSE</span>
        </div>

        <div className={`card ${metodo === "efecty" ? "active" : ""}`}>
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("efecty")}
          />

          <img src={efecty} alt="Efecty" />

          <span>Efecty</span>
        </div>

        {/* FORMULARIO TARJETA */}
        {(metodo === "credito" || metodo === "debito") && (

          <div className="form">

            <h4>Datos de la tarjeta</h4>

            {/* NUMERO TARJETA */}
            <input
              type="text"
              placeholder="Número de tarjeta"
              value={numero}
              maxLength="16"
              onChange={(e) =>
                setNumero(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            {errores.numero && (
              <p className="error">
                {errores.numero}
              </p>
            )}

            {/* FECHA */}
            <input
              type="text"
              placeholder="MM/AA"
              value={fecha}
              maxLength="5"
              onChange={(e) =>
                setFecha(e.target.value)
              }
            />

            {errores.fecha && (
              <p className="error">
                {errores.fecha}
              </p>
            )}

            {/* CVV */}
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              maxLength="3"
              onChange={(e) =>
                setCvv(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            {errores.cvv && (
              <p className="error">
                {errores.cvv}
              </p>
            )}

          </div>
        )}

        {/* BOTON */}
        <button
          disabled={!metodo}
          onClick={pagar}
        >
          Confirmar pago
        </button>

        {/* MENSAJE */}
        <p>{mensaje}</p>

      </div>

      {/* DERECHA */}
      <div className="right">

        <h3>Resumen de compra</h3>

        <p>Producto: $4.299.000</p>

        <p>Envío: Gratis</p>

        <hr />

        <h2>Total: $4.299.000</h2>

      </div>

    </div>
  );
}

export default App;