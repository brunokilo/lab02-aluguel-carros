import { useState } from "react";
import type { EnderecoDTO } from "../types/cliente";
import { atualizarEndereco } from "../api/clienteApi";
import "./ClienteForm.css";

const enderecoVazio: EnderecoDTO = {
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  cep: "",
};

interface Props {
  clienteId: number;
  enderecoAtual?: EnderecoDTO | null;
  onSalvo?: () => void;
}

export function EnderecoForm({ clienteId, enderecoAtual, onSalvo }: Props) {
  const [endereco, setEndereco] = useState<EnderecoDTO>(enderecoAtual ?? enderecoVazio);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  function atualizarCampo(campo: keyof EnderecoDTO, valor: string) {
    setEndereco((atual) => ({ ...atual, [campo]: valor }));
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSucesso(false);
    setEnviando(true);

    try {
      await atualizarEndereco(clienteId, endereco);
      setSucesso(true);
      onSalvo?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido ao salvar endereço");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h1>Endereço</h1>

      <section>
        <div className="linha">
          <label className="campo-grande">
            Rua
            <input
              required
              value={endereco.rua}
              onChange={(e) => atualizarCampo("rua", e.target.value)}
            />
          </label>

          <label>
            Número
            <input
              required
              value={endereco.numero}
              onChange={(e) => atualizarCampo("numero", e.target.value)}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            Bairro
            <input
              required
              value={endereco.bairro}
              onChange={(e) => atualizarCampo("bairro", e.target.value)}
            />
          </label>

          <label>
            Cidade
            <input
              required
              value={endereco.cidade}
              onChange={(e) => atualizarCampo("cidade", e.target.value)}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            Estado
            <input
              required
              maxLength={2}
              placeholder="MG"
              value={endereco.estado}
              onChange={(e) => atualizarCampo("estado", e.target.value.toUpperCase())}
            />
          </label>

          <label>
            CEP
            <input
              required
              value={endereco.cep}
              onChange={(e) => atualizarCampo("cep", e.target.value)}
            />
          </label>
        </div>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">Endereço salvo com sucesso.</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar endereço"}
      </button>
    </form>
  );
}
