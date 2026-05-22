import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import visa from "../assets/visa.jpg";
import nequi from "../assets/nequi.jpg";
import pse from "../assets/pse.jpg";
import efecty from "../assets/efecty.png";
import bancopopular from "../assets/bancopopular.jpg";

function Pago() {
  const navigate = useNavigate();

  const [metodo, setMetodo] = useState("");
  const [mensaje, setMensaje] = useState("");

  // datos tarjeta
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [cvv, setCvv] = useState("");

  const [errores, setErrores] = useState<{
    numero?: string;
    fecha?: string;
    cvv?: string;
  }>({});

  const pagar = () => {
    let nuevosErrores: any = {};

    // validar tarjeta
    if (
      (metodo === "credito" || metodo === "debito") &&
      numero.length !== 16
    ) {
      nuevosErrores.numero = "La tarjeta debe tener 16 números";
    }

    // validar fecha
    if (
      (metodo === "credito" || metodo === "debito") &&
      !fecha.match(/^\d{2}\/\d{2}$/)
    ) {
      nuevosErrores.fecha = "La fecha debe tener formato MM/AA";
    }

    // validar cvv
    if (
      (metodo === "credito" || metodo === "debito") &&
      cvv.length !== 3
    ) {
      nuevosErrores.cvv = "El CVV debe tener 3 números";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("❌ Corrige los errores");
      return;
    }

    setMensaje("✅ Pago realizado correctamente");

    setTimeout(() => {
      navigate("/welcome");
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        padding: "40px",
        flexWrap: "wrap",
      }}
    >
      {/* IZQUIERDA */}
      <div
        style={{
          background: "#1c1c1c",
          padding: "30px",
          borderRadius: "20px",
          width: "400px",
        }}
      >
        <h2>Elige cómo pagar</h2>

        {/* bancos */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("banco")}
          />
          <img src={bancopopular} alt="Banco" width="50" />
          <span>Banco Popular</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("nequi")}
          />
          <img src={nequi} alt="Nequi" width="50" />
          <span>Nequi</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("visa")}
          />
          <img src={visa} alt="Visa" width="50" />
          <span>Visa</span>
        </div>

        <h4 style={{ marginTop: "20px" }}>Tarjetas</h4>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button onClick={() => setMetodo("credito")}>
            💳 Crédito
          </button>

          <button onClick={() => setMetodo("debito")}>
            💳 Débito
          </button>
        </div>

        <h4 style={{ marginTop: "20px" }}>Otros</h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("pse")}
          />
          <img src={pse} alt="PSE" width="50" />
          <span>PSE</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="radio"
            name="pago"
            onChange={() => setMetodo("efecty")}
          />
          <img src={efecty} alt="Efecty" width="50" />
          <span>Efecty</span>
        </div>

        {(metodo === "credito" || metodo === "debito") && (
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <h4>Datos de la tarjeta</h4>

            <input
              type="text"
              placeholder="Número de tarjeta"
              maxLength={16}
              value={numero}
              onChange={(e) =>
                setNumero(e.target.value.replace(/\D/g, ""))
              }
              style={{ padding: "10px" }}
            />

            {errores.numero && (
              <p style={{ color: "red" }}>{errores.numero}</p>
            )}

            <input
              type="text"
              placeholder="MM/AA"
              value={fecha}
              maxLength={5}
              onChange={(e) => setFecha(e.target.value)}
              style={{ padding: "10px" }}
            />

            {errores.fecha && (
              <p style={{ color: "red" }}>{errores.fecha}</p>
            )}

            <input
              type="text"
              placeholder="CVV"
              maxLength={3}
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, ""))
              }
              style={{ padding: "10px" }}
            />

            {errores.cvv && (
              <p style={{ color: "red" }}>{errores.cvv}</p>
            )}
          </div>
        )}

        <button
          disabled={!metodo}
          onClick={pagar}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "15px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Confirmar pago
        </button>

        <p style={{ marginTop: "15px" }}>{mensaje}</p>
      </div>

      {/* DERECHA */}
      <div
        style={{
          background: "#1c1c1c",
          padding: "30px",
          borderRadius: "20px",
          width: "300px",
        }}
      >
        <h3>Resumen de compra</h3>

        <p>Producto: $4.299.000</p>

        <p>Envío: Gratis</p>

        <hr />

        <h2>Total: $4.299.000</h2>
      </div>
    </div>
  );
}

export default Pago;