import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

import "../styles/MyPurchases.css";
import "../styles/Responsive.css";

function MyPurchases() {
  const navigate = useNavigate();

  const [compras, setCompras] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const obtenerUsuario = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      setUserId(user.id);

      // compras SOLO del usuario logueado
      const comprasGuardadas = JSON.parse(
        localStorage.getItem(
          `misCompras_${user.id}`
        ) || "[]"
      );

      setCompras(comprasGuardadas.reverse());
    };

    obtenerUsuario();
  }, [navigate]);

  return (
    <div className="my-purchases-container">
      <div className="my-purchases-header">
        <h1>Mis compras</h1>

    
      </div>

      {compras.length === 0 ? (
        <div className="empty-purchases">
          <h2>No has realizado compras</h2>

          <p>
            Cuando compres productos
            aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="purchases-grid">
          {compras.map((compra) => (
            <div
              key={compra.id}
              className="purchase-card"
            >
              <div className="purchase-top">
                <h2>
                  Compra #{compra.id}
                </h2>

                <span className="purchase-date">
                  {compra.fecha}
                </span>
              </div>

              <div className="purchase-products">
                {compra.productos.map(
                  (
                    producto: any,
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="purchase-product"
                    >
                      <img
                        src={producto.img}
                        alt={producto.name}
                      />

                      <div className="purchase-info">
                        <h3>
                          {producto.name}
                        </h3>

                        <p>
                          Precio:
                          <span>
                            {" "}
                            $
                            {
                              producto.price
                            }
                          </span>
                        </p>

                        {producto.talla && (
                          <p>
                            Talla:
                            <span>
                              {" "}
                              {
                                producto.talla
                              }
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="purchase-footer">
                <p>
                  Método de pago:
                  <span>
                    {" "}
                    {compra.metodo}
                  </span>
                </p>

                <h2>
                  Total: $
                  {compra.total}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPurchases;