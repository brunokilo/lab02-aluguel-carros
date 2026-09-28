import { useState } from "react";
import type { ClienteDTO } from "../types/cliente";
import { criarCliente } from "../api/clienteApi";
import "./ClienteForm.css";

const clienteVazio: ClienteDTO = {
  usuario: { nome: "", email: "", senha: "" },
  rg: "",
  cpf: "",
  profissao: "",
  endereco: null,
  empregadores: [],
};

interface Props {
  // chamado após o cadastro dar certo, com as credenciais usadas —
  // a página que usa o form pode, por exemplo, fazer login automático
  onCadastrado?: (credenciais: { email: string; senha: string }) => void;
}

export function CadastroClienteForm({ onCadastrado }: Props) {
  const [cliente, setCliente] = useState<ClienteDTO>(clienteVazio);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function atualizarUsuario(campo: keyof ClienteDTO["usuario"], valor: string) {
    setCliente((atual) => ({
      ...atual,
      usuario: { ...atual.usuario, [campo]: valor },
    }));
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const credenciais = { email: cliente.usuario.email, senha: cliente.usuario.senha };
      await criarCliente(cliente);
      setCliente(clienteVazio);
      onCadastrado?.(credenciais);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido ao cadastrar cliente");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h1>Cadastro de cliente</h1>
      <p className="texto-auxiliar">
        Endereço e empregadores podem ser preenchidos depois, a qualquer momento.
      </p>

      <section>
        <label>
          Nome
          <input
            required
            value={cliente.usuario.nome}
            onChange={(e) => atualizarUsuario("nome", e.target.value)}
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            required
            value={cliente.usuario.email}
            onChange={(e) => atualizarUsuario("email", e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            value={cliente.usuario.senha}
            onChange={(e) => atualizarUsuario("senha", e.target.value)}
          />
        </label>

        <div className="linha">
          <label>
            CPF
            <input
              required
              placeholder="00000000000"
              value={cliente.cpf}
              onChange={(e) => setCliente({ ...cliente, cpf: e.target.value })}
            />
          </label>

          <label>
            RG
            <input
              value={cliente.rg}
              onChange={(e) => setCliente({ ...cliente, rg: e.target.value })}
            />
          </label>
        </div>

        <label>
          Profissão
          <input
            required
            value={cliente.profissao}
            onChange={(e) => setCliente({ ...cliente, profissao: e.target.value })}
          />
        </label>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Cadastrando..." : "Cadastrar cliente"}
      </button>
    </form>
  );
}
