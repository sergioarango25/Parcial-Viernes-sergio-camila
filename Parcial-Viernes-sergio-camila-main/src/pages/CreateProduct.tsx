
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/CreateProduct.css";

function CreateProduct() {
  const [searchParams] = useSearchParams();

  
  const category = searchParams.get("category") || "men";

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [tipo, setTipo] = useState("");

  const handleCreate = async () => {
    if (!name || !price || !description || !img || !tipo) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (price <= 0) {
      alert("El precio debe ser un número válido mayor a 0");
      return;
    }

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


      setName("");
      setPrice(0);
      setDescription("");
      setImg("");
      setTipo("");
    }
  };

  return (
    <div className="create-container">
      <h1 className="header">CREAR PRODUCTO</h1>

      <p className="category-badge">
        Categoría: {category?.toUpperCase()}
      </p>

      <div className="box-create">
        <select
          className="input-create"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecciona tipo</option>
          <option value="ropa">Camisa / Ropa</option>
          <option value="zapatos">Zapatos</option>
        </select>

        <input
          className="input-create"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input-create"
          placeholder="Precio"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <input
          className="input-create"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="input-create"
          placeholder="URL Imagen"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />

        <button className="crear" onClick={handleCreate}>
          CREAR
        </button>
      </div>
    </div>
  );
}

export default CreateProduct;