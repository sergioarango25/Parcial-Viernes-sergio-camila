import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Men from "./pages/Men";
import Couple from "./pages/Couple";
import Girl from "./pages/Girl";
import CreateProduct from "./pages/CreateProduct";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Privadas */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions/men"
          element={
            <ProtectedRoute>
              <Men />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions/couple"
          element={
            <ProtectedRoute>
              <Couple />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sessions/girl"
          element={
            <ProtectedRoute>
              <Girl />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;