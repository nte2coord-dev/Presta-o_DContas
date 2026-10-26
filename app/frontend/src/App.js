import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Escolas from "@/pages/Escolas";
import Termos from "@/pages/Termos";
import Agendamentos from "@/pages/Agendamentos";
import Oficios from "@/pages/Oficios";
import Metas from "@/pages/Metas";
import Calculadora from "@/pages/Calculadora";
import Documentos from "@/pages/Documentos";
import Usuarios from "@/pages/Usuarios";

function Protected({ children }) {
  const { user } = useAuth();
  if (user === null) return <div className="min-h-screen flex items-center justify-center text-slate-500">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  // suppress stale banner warnings etc.
  useEffect(() => {}, []);
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<Protected><Layout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="escolas" element={<Escolas />} />
        <Route path="termos" element={<Termos tipo="compromisso" />} />
        <Route path="obras" element={<Termos tipo="obras" />} />
        <Route path="agendamentos" element={<Agendamentos />} />
        <Route path="oficios" element={<Oficios />} />
        <Route path="metas" element={<Metas />} />
        <Route path="calculadora" element={<Calculadora />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="usuarios" element={<Usuarios />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
