// las fs son promesas y path para manejar rutas de archivos 
// que es una promesa 
// ejemplo 
// fs.readFile() devuelve una Promesa
//Al usar await, JavaScript espera a que se resuelva
//Cuando termina, devuelve el contenido del archivo


import fs from "fs/promises";

import { fileURLToPath } from "url";

import path from "path";

// new URL("../data/users.json", import.meta.url) es como decir:
// “Sube un nivel y entra a la carpeta data y toma users.json”.
// .pathname convierte la URL en una ruta de archivo del sistema operativo ejemplo file://file:///C:/project/data/users.json -> C:\Users\HP\...
// path.join asegura que la ruta sea correcta en cualquier sistema operativo
// DATA_PATH es la ruta completa al archivo users.json Se construye la ruta completa del archivo users.json usando la ubicación actual del archivo, de forma segura para módulos ES

// esta manera no funciona bien en módels debido a que import.meta.url no es una ruta de archivo directa
// const DATA_PATH = path.join(
//   new URL("../data/users.json", import.meta.url).pathname
// );

// esta es la forma correcta de obtener la ruta del archivo en módulos ES
// debido a que import.meta.url no es una ruta directa
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "../data/users.json");


// Lee usuarios (retorna array)
//async/await para manejar operaciones asíncronas de lectura y escritura de archivos
// try catch para manejar errores 
// const raw para almacenar el contenido crudo del archivo
// return JSON.parse(raw || "[]"); para convertir el contenido JSON en un array de usuarios
// catch (err) { para manejar errores de lectura de archivo
// if (err.code === "ENOENT") { si el error es que el archivo no existe
// await fs.writeFile(DATA_PATH, "[]", "utf8"); crea el archivo con un array vacío
// return []; retorna un array vacío
// throw err; si es otro error, lo lanza para que se maneje afuera

async function readUsersFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.writeFile(DATA_PATH, "[]", "utf8");
      return [];
    }
    throw err;
  }
}

//JSON.stringify(users, null, 2) convierte el array a texto bonito con sangría de 2 espacios.
//fs.writeFile() sobrescribe el archivo con ese contenido.
//"utf8" → se escribe como texto.
// await → espera a que realmente termine de escribir.
async function writeUsersFile(users) {
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), "utf8");
}

// Devuelve todos los usuarios del archivo JSON.
export async function getAllUsers() {
  return await readUsersFile();
}

// Busca un usuario por email
export async function findUserByEmail(email) {
    // leer todos los usuarios
  const users = await readUsersFile();
  // buscar el usuario por email que coincida
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Crea un nuevo usuario y lo guarda en el archivo JSON
export async function createUser({ name, email, passwordHash }) {
  const users = await readUsersFile();
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, name, email: email.toLowerCase(), passwordHash, createdAt: new Date().toISOString() };
  users.push(newUser);
  await writeUsersFile(users);
  // No devolver passwordHash por seguridad en la respuesta real; aquí lo devolvemos para confirmar creación (puedes omitir)
  return { ...newUser };
}
