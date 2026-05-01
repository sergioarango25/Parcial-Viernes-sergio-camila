import "../styles/Tiendas.css";
import { useNavigate } from "react-router-dom";
function Tiendas() {
    const navigate = useNavigate();

    return (

        <>
        <button className="salida" onClick={() => navigate("/welcome")}>X</button>
            <h1 className="Mensaje">TIENDAS BRAND NEW</h1>
            <p>Encuentra nuestras tiendas físicas en las siguientes ubicaciones:</p>
            <ul>
                <li className="cali">Cali: Cra. 52 #13-20, Col. San Francisco</li>
                <li className="medellin">Medellín: Carrera 5 #45-67, Col. El Poblado</li>
                <li className="bogota">Bogotá: Calle 93 #15-20, Col. Chapinero</li>
                <li className="barranquilla">Barranquilla: Av. 10 de agosto 1000, Col. Centro</li>
            </ul>
            <p>¡Visítanos y descubre la moda más exclusiva en nuestras tiendas Brand New!</p>
        </>

    );

}

export default Tiendas;