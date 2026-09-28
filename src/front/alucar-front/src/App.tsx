import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { CadastroPage } from "./pages/CadastroPage";
import { ContaPage } from "./pages/ContaPage";
import { EnderecoPage } from "./pages/EnderecoPage";
import { EmpregadoresPage } from "./pages/EmpregadoresPage";
import { AgentePage } from "./pages/AgentePage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/clientes/:id" element={<ContaPage />} />
          <Route path="/clientes/:id/endereco" element={<EnderecoPage />} />
          <Route path="/clientes/:id/empregadores" element={<EmpregadoresPage />} />
          <Route path="/agente/:id" element={<AgentePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
