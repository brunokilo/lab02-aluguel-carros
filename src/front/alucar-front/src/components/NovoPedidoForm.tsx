import { useEffect, useState } from "react";
import type { AutomovelDTO } from "../types/automovel";
import type { ModalidadeContrato } from "../types/pedido";
import { ROTULOS_MODALIDADE } from "../types/pedido";
import { listarAutomoveisDisponiveis } from "../api/automovelApi";
import { criarPedido } from "../api/pedidoApi";
import "./ClienteForm.css";
import "./PedidosList.css";

const MODALIDADES: ModalidadeContrato[] = ["LOCACAO", "ASSINATURA", "LEASING"];

interface Props {
  clienteId: number;
  onCriado?: () => void;
}

export function NovoPedidoForm({ clienteId, onCriado }: Props) {
  const [automoveis, setAutomoveis] = useState<AutomovelDTO[]>([]);
  const [automovelId, setAutomovelId] = useState<number | "">("");
  const [modalidade, setModalidade] = useState<ModalidadeContrato>("LOCACAO");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    listarAutomoveisDisponiveis()
      .then((pagina) => setAutomoveis(pagina.content))
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao buscar automóveis disponíveis"))
      .finally(() => setCarregando(false));
  }, []);

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    if (!automovelId) return;

    setErro(null);
    setEnviando(true);

    try {
      await criarPedido(clienteId, automovelId, modalidade);
      setAutomovelId("");
      onCriado?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao solicitar aluguel");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return <p className="texto-auxiliar">Carregando automóveis disponíveis...</p>;
  }

  return (
    <form className="novo-pedido" onSubmit={handleSubmit}>
      <label className="campo-grande">
        Automóvel
        <select
          required
          value={automovelId}
          onChange={(e) => setAutomovelId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">Selecione um automóvel disponível</option>
          {automoveis.map((automovel) => (
            <option key={automovel.id} value={automovel.id}>
              {automovel.marca} {automovel.modelo} ({automovel.ano}) — {automovel.placa}
            </option>
          ))}
        </select>
      </label>

      <label>
        Modalidade
        <select value={modalidade} onChange={(e) => setModalidade(e.target.value as ModalidadeContrato)}>
          {MODALIDADES.map((m) => (
            <option key={m} value={m}>
              {ROTULOS_MODALIDADE[m]}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="botao-principal" disabled={enviando || automoveis.length === 0}>
        {enviando ? "Solicitando..." : "Solicitar aluguel"}
      </button>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {automoveis.length === 0 && !erro && (
        <p className="texto-auxiliar">Não há automóveis disponíveis no momento.</p>
      )}
    </form>
  );
}
