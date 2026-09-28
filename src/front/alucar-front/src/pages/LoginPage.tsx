import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "../components/ClienteForm.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const usuario = await login({ email, senha });
      entrar(usuario);
      navigate("/");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao fazer login");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h1>Entrar</h1>

      <section>
        <label>
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Entrando..." : "Entrar"}
      </button>

      <p className="texto-auxiliar">
        Ainda não tem cadastro? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </form>
  );
}
