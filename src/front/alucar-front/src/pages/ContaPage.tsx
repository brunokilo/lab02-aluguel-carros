import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ClienteDTO } from "../types/cliente";
import { buscarClientePorId } from "../api/clienteApi";
import { EnderecoForm } from "../components/EnderecoForm";
import { EmpregadoresForm } from "../components/EmpregadoresForm";
import "../components/ClienteForm.css";
import "./ContaPage.css";

type Aba = "dados" | "endereco" | "empregadores";

export function ContaPage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);

  const [cliente, setCliente] = useState<ClienteDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [aba, setAba] = useState<Aba>("dados");

  function carregarCliente() {
    if (!clienteId) return;
    setCarregando(true);
    buscarClientePorId(clienteId)
      .then(setCliente)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar cliente"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregarCliente, [clienteId]);

  if (carregando) return <p className="texto-auxiliar">Carregando...</p>;
  if (erro) return <p className="mensagem-erro">{erro}</p>;
  if (!cliente) return <p className="mensagem-erro">Cliente não encontrado.</p>;

  return (
    <div className="cliente-form">
      <h1>Minha conta</h1>

      <nav className="abas">
        <button
          type="button"
          className={aba === "dados" ? "aba-ativa" : ""}
          onClick={() => setAba("dados")}
        >
          Dados pessoais
        </button>
        <button
          type="button"
          className={aba === "endereco" ? "aba-ativa" : ""}
          onClick={() => setAba("endereco")}
        >
          Endereço {cliente.endereco ? "" : "· pendente"}
        </button>
        <button
          type="button"
          className={aba === "empregadores" ? "aba-ativa" : ""}
          onClick={() => setAba("empregadores")}
        >
          Empregadores ({cliente.empregadores.length}/3)
        </button>
      </nav>

      {aba === "dados" && (
        <section>
          <p><strong>Nome:</strong> {cliente.usuario.nome}</p>
          <p><strong>E-mail:</strong> {cliente.usuario.email}</p>
          <p><strong>CPF:</strong> {cliente.cpf}</p>
          {cliente.rg && <p><strong>RG:</strong> {cliente.rg}</p>}
          <p><strong>Profissão:</strong> {cliente.profissao}</p>
        </section>
      )}

      {aba === "endereco" && (
        <EnderecoForm
          clienteId={clienteId}
          enderecoAtual={cliente.endereco}
          onSalvo={carregarCliente}
        />
      )}

      {aba === "empregadores" && (
        <EmpregadoresForm
          clienteId={clienteId}
          empregadoresAtuais={cliente.empregadores}
          onSalvo={carregarCliente}
        />
      )}
    </div>
  );
}
