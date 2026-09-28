import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CadastroClienteForm } from "../components/CadastroClienteForm";
import { CadastroAgenteForm } from "../components/CadastroAgenteForm";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../components/ClienteForm.css";

type TipoCadastro = "CLIENTE" | "AGENTE" | "BANCO";

export function CadastroPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [tipo, setTipo] = useState<TipoCadastro>("CLIENTE");

  // Depois de cadastrar, já entra com as mesmas credenciais e vai pra home —
  // assim o menu mostra a área correta (cliente ou agente)
  async function aoCadastrar(credenciais: { email: string; senha: string }) {
    try {
      const usuario = await login(credenciais);
      entrar(usuario);
      navigate("/");
    } catch {
      // O cadastro deu certo, só o login automático falhou — manda pro login manual
      navigate("/login");
    }
  }

  return (
    <div>
      <nav className="abas cadastro-tipo">
        <button
          type="button"
          className={tipo === "CLIENTE" ? "aba-ativa" : ""}
          onClick={() => setTipo("CLIENTE")}
        >
          Sou cliente
        </button>
        <button
          type="button"
          className={tipo === "AGENTE" ? "aba-ativa" : ""}
          onClick={() => setTipo("AGENTE")}
        >
          Sou empresa
        </button>
        <button
          type="button"
          className={tipo === "BANCO" ? "aba-ativa" : ""}
          onClick={() => setTipo("BANCO")}
        >
          Sou banco
        </button>
      </nav>

      {tipo === "CLIENTE" && <CadastroClienteForm onCadastrado={aoCadastrar} />}
      {(tipo === "AGENTE" || tipo === "BANCO") && (
        <CadastroAgenteForm tipo={tipo} onCadastrado={aoCadastrar} />
      )}
    </div>
  );
}
