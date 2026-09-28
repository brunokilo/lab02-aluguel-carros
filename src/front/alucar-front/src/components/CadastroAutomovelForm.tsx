import { useState } from "react";
import type { NovoAutomovelDTO } from "../types/automovel";
import { criarAutomovel } from "../api/automovelApi";
import "./ClienteForm.css";

const automovelVazio: NovoAutomovelDTO = { placa: "", ano: new Date().getFullYear(), marca: "", modelo: "", emUso: false };

interface Props {
  agenteId: number;
  onCadastrado?: () => void;
}

export function CadastroAutomovelForm({ agenteId, onCadastrado }: Props) {
  const [automovel, setAutomovel] = useState<NovoAutomovelDTO>(automovelVazio);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await criarAutomovel(agenteId, automovel);
      setAutomovel(automovelVazio);
      onCadastrado?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido ao cadastrar automóvel");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <h1>Cadastrar automóvel</h1>
      <p className="texto-auxiliar">O carro entra no catálogo disponível para os clientes pedirem aluguel.</p>

      <section>
        <div className="linha">
          <label className="campo-grande">
            Marca
            <input
              required
              value={automovel.marca}
              onChange={(e) => setAutomovel({ ...automovel, marca: e.target.value })}
            />
          </label>

          <label className="campo-grande">
            Modelo
            <input
              required
              value={automovel.modelo}
              onChange={(e) => setAutomovel({ ...automovel, modelo: e.target.value })}
            />
          </label>
        </div>

        <div className="linha">
          <label>
            Placa
            <input
              required
              value={automovel.placa}
              onChange={(e) => setAutomovel({ ...automovel, placa: e.target.value.toUpperCase() })}
            />
          </label>

          <label>
            Ano
            <input
              type="number"
              required
              min={1950}
              max={2100}
              value={automovel.ano}
              onChange={(e) => setAutomovel({ ...automovel, ano: Number(e.target.value) })}
            />
          </label>
        </div>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Cadastrando..." : "Cadastrar automóvel"}
      </button>
    </form>
  );
}
