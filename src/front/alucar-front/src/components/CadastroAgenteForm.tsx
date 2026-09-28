import { useState } from "react";
import type { AgenteCadastroDTO } from "../types/agente";
import { criarAgente, criarBanco } from "../api/agenteApi";
import "./ClienteForm.css";

const agenteVazio: AgenteCadastroDTO = { nome: "", email: "", senha: "" };

interface Props {
  tipo: "AGENTE" | "BANCO";
  // chamado após o cadastro dar certo, com as credenciais usadas —
  // a página que usa o form pode, por exemplo, fazer login automático
  onCadastrado?: (credenciais: { email: string; senha: string }) => void;
}

export function CadastroAgenteForm({ tipo, onCadastrado }: Props) {
  const [agente, setAgente] = useState<AgenteCadastroDTO>(agenteVazio);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const rotulo = tipo === "BANCO" ? "banco" : "empresa";

  function atualizarCampo(campo: keyof AgenteCadastroDTO, valor: string) {
    setAgente((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const credenciais = { email: agente.email, senha: agente.senha };
      const criar = tipo === "BANCO" ? criarBanco : criarAgente;
      await criar(agente);
      setAgente(agenteVazio);
      onCadastrado?.(credenciais);
    } catch (e) {
      setErro(e instanceof Error ? e.message : `Erro desconhecido ao cadastrar ${rotulo}`);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h1>Cadastro de {rotulo}</h1>
      <p className="texto-auxiliar">
        {tipo === "BANCO"
          ? "Bancos avaliam pedidos e podem conceder contratos de crédito para leasing."
          : "Empresas avaliam pedidos de aluguel do ponto de vista financeiro."}
      </p>

      <section>
        <label>
          Nome
          <input
            required
            value={agente.nome}
            onChange={(e) => atualizarCampo("nome", e.target.value)}
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            required
            value={agente.email}
            onChange={(e) => atualizarCampo("email", e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            value={agente.senha}
            onChange={(e) => atualizarCampo("senha", e.target.value)}
          />
        </label>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Cadastrando..." : `Cadastrar ${rotulo}`}
      </button>
    </form>
  );
}
