import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { CadastroPage } from "./pages/CadastroPage";
import { ContaPage } from "./pages/ContaPage";
import { EnderecoPage } from "./pages/EnderecoPage";
import { EmpregadoresPage } from "./pages/EmpregadoresPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/clientes/:id" element={<ContaPage />} />
        <Route path="/clientes/:id/endereco" element={<EnderecoPage />} />
        <Route path="/clientes/:id/empregadores" element={<EmpregadoresPage />} />
      </Routes>
    </BrowserRouter>
  );
}