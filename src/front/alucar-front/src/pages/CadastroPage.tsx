import { useNavigate } from "react-router-dom";
import { CadastroClienteForm } from "../components/CadastroClienteForm";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export function CadastroPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();

  // Depois de cadastrar, já entra com as mesmas credenciais e vai pra home —
  // assim o menu mostra "Minha conta" e o cliente completa endereço/empregadores
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

  return <CadastroClienteForm onCadastrado={aoCadastrar} />;
}
