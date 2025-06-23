import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Notificaciones from "./pages/Notificaciones";
import PostsTodos from "./pages/PostsTodos";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./component/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            <Route path="posts" element={<PostsTodos />} />
          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
    </AuthProvider>
  );
}
export default App;
