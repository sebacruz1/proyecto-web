import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./pages/admin/Dashboard";
import PatrolDashboard from "./pages/patrol/Dashboard";
import Login from "./pages/public/Login";
import UserDashboard from "./pages/user/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/patrullero/dashboard" element={<PatrolDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/new" element={<UserDashboard />} />
        <Route path="/user/history" element={<UserDashboard />} />
        <Route path="/user/:id" element={<UserDashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<h2>404 - La página no existe</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
