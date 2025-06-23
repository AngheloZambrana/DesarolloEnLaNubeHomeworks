import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/DashboardHeader.css";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-left">
        <h1>Bienvenido, {user?.email}</h1>
      </div>
      <nav className="dashboard-header-nav">
        <Link to="" className="nav-link">Inicio</Link>
        <Link to="notificaciones" className="nav-link">Notificaciones</Link>
        <Link to="posts" className="nav-link">Todos los Posts</Link>
    </nav>
      <div className="dashboard-header-right">
        <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      </div>
    </header>
  );
}
