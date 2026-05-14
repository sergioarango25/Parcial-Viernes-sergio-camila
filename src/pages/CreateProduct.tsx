import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/CreateProduct.css";

function CreateProduct() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Categoria inicial desde la URL
  const initialCategory = searchParams.get("category") || "";

  // Estados
  const [category, setCategory] = useState(initialCategory);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [tipo, setTipo] = useState("");

  const handleCreate = async () => {
    // Validaciones
    if (!name || !price || !description || !img || !tipo || !category) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (price <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    // Insertar en Supabase
    const { error } = await supabase.from("productos").insert([
      {
        name,
        price,
        description,
        img,
        category,
        type: tipo,
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`Producto creado en ${category} 🚀`);

      // Limpiar campos
      setName("");
      setPrice(0);
      setDescription("");
      setImg("");
      setTipo("");
    }
  };

  return (
    <div className="create-container">
      <button
        className="salida"
        onClick={() => navigate("/welcome")}
      >
        X
      </button>

      <h1 className="header">CREAR PRODUCTO</h1>

      <div className="box-create">

        {/* Tipo */}
        <select
          className="input-create"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecciona tipo</option>
          <option value="ropa">Camisa / Ropa</option>
          <option value="zapatos">Zapatos</option>
        </select>

        {/* Categoria */}
        <select
          className="input-create"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Selecciona la categoria</option>
          <option value="men">Men</option>
          <option value="girl">Girl</option>
          <option value="couple">Couple</option>
        </select>

        {/* Nombre */}
        <input
          className="input-create"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Precio */}
        <input
          className="input-create"
          placeholder="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        {/* Descripción */}
        <input
          className="input-create"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* URL Imagen */}
        <input
          className="input-create"
          placeholder="URL Imagen"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />

        {/* Botón */}
        <button
          className="crear"
          onClick={handleCreate}
        >
          CREAR
        </button>
      </div>
    </div>
  );
}

export default CreateProduct;