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

  const pagar = () => {
    setMensaje("✅ Pago realizado correctamente");
  };

  return (
    <div className="container">

      {/* IZQUIERDA */}
      <div className="left">
        <h2>Elige cómo pagar</h2>

        <h4>Recomendados</h4>

        <div className={`card ${metodo === "banco" ? "active" : ""}`}>
          <input type="radio" name="pago" onChange={() => setMetodo("banco")} />
          <img src={bancopopular} />
          <span>Banco Popular **** 6410</span>
          <span className="badge">Hasta 9 cuotas sin interés</span>
        </div>

        <div className={`card ${metodo === "nequi" ? "active" : ""}`}>
          <input type="radio" name="pago" onChange={() => setMetodo("nequi")} />
          <img src={nequi} />
          <span>Nequi Débito **** 1074</span>
        </div>

        <div className={`card ${metodo === "visa" ? "active" : ""}`}>
          <input type="radio" name="pago" onChange={() => setMetodo("visa")} />
          <img src={visa} />
          <span>Visa Débito **** 3411</span>
        </div>

        <h4>Tarjetas</h4>

        <div className="card">
          <input type="radio" name="pago" onChange={() => setMetodo("credito")} />
          <span>💳 Nueva tarjeta de crédito</span>
        </div>

        <div className="card">
          <input type="radio" name="pago" onChange={() => setMetodo("debito")} />
          <span>💳 Nueva tarjeta de débito</span>
        </div>

        <h4>Otros medios de pago</h4>

        <div className={`card ${metodo === "pse" ? "active" : ""}`}>
          <input type="radio" name="pago" onChange={() => setMetodo("pse")} />
          <img src={pse} />
          <span>Transferencia con PSE</span>
        </div>

        <div className="card">
          <input type="radio" name="pago" onChange={() => setMetodo("efecty")} />
          <img src={efecty} />
          <span>Efecty</span>
        </div>

        {/* FORMULARIO */}
        {(metodo === "credito" || metodo === "debito") && (
          <div className="form">
            <h4>Datos de la tarjeta</h4>
            <input type="text" placeholder="Número de tarjeta" />
            <input type="text" placeholder="MM/AA" />
            <input type="text" placeholder="CVV" />
          </div>
        )}

        <button disabled={!metodo} onClick={pagar}>
          Confirmar pago
        </button>

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