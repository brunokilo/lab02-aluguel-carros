import { useEffect, useState } from "react";
import type { PageResponse, PedidoDTO } from "../types/pedido";
import type { AutomovelDTO } from "../types/automovel";
import { listarPedidos, cancelarPedido, avancarPedido, alterarPedido } from "../api/pedidoApi";
import { listarAutomoveisDisponiveis } from "../api/automovelApi";
import { NovoPedidoForm } from "./NovoPedidoForm";
import "./PedidosList.css";

interface Props {
  clienteId: number;
}

export function PedidosList({ clienteId }: Props) {
  const [pagina, setPagina] = useState<PageResponse<PedidoDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const [pedidoEmEdicaoId, setPedidoEmEdicaoId] = useState<number | null>(null);
  const [automoveisDisponiveis, setAutomoveisDisponiveis] = useState<AutomovelDTO[]>([]);

  function carregarPedidos() {
    setCarregando(true);
    setErro(null);

    listarPedidos(clienteId, numeroPagina)
      .then(setPagina)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar pedidos"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregarPedidos, [clienteId, numeroPagina]);

  // Carros disponíveis pro select de "alterar" — não precisa recarregar a cada ação
  useEffect(() => {
    listarAutomoveisDisponiveis()
      .then((p) => setAutomoveisDisponiveis(p.content))
      .catch(() => {
        // a listagem principal de pedidos segue funcionando mesmo sem isso
      });
  }, []);

  async function executarAcao(pedidoId: number, acao: () => Promise<PedidoDTO>) {
    setErro(null);
    setProcessandoId(pedidoId);

    try {
      await acao();
      setPedidoEmEdicaoId(null);
      carregarPedidos();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao processar o pedido");
    } finally {
      setProcessandoId(null);
    }
  }

  if (carregando && !pagina) return <p className="texto-auxiliar">Carregando pedidos...</p>;

  return (
    <div className="pedidos-list">
      <NovoPedidoForm clienteId={clienteId} onCriado={carregarPedidos} />

      {erro && <p className="mensagem-erro">{erro}</p>}

      {pagina && pagina.content.length === 0 ? (
        <p className="texto-auxiliar">Você ainda não fez nenhum pedido de aluguel.</p>
      ) : (
        pagina && (
          <table className="pedidos-tabela">
            <thead>
              <tr>
                <th>#</th>
                <th>Automóvel</th>
                <th>Data</th>
                <th>Status</th>
                <th>Parecer</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((pedido) => {
                const emEdicao = pedidoEmEdicaoId === pedido.id;
                const processando = processandoId === pedido.id;

                return (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>
                      {emEdicao ? (
                        <select
                          defaultValue={pedido.automovelDesejado.id}
                          disabled={processando}
                          onChange={(e) =>
                            executarAcao(pedido.id, () =>
                              alterarPedido(pedido.id, clienteId, Number(e.target.value))
                            )
                          }
                        >
                          {automoveisDisponiveis.map((automovel) => (
                            <option key={automovel.id} value={automovel.id}>
                              {automovel.marca} {automovel.modelo} ({automovel.ano})
                            </option>
                          ))}
                        </select>
                      ) : (
                        `${pedido.automovelDesejado.marca} ${pedido.automovelDesejado.modelo} — ${pedido.automovelDesejado.placa}`
                      )}
                    </td>
                    <td>{new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}</td>
                    <td>{pedido.status}</td>
                    <td>{pedido.parecer ?? "—"}</td>
                    <td className="pedido-acoes">
                      {pedido.status === "CRIADO" && (
                        <>
                          <button
                            type="button"
                            className="botao-secundario"
                            disabled={processando}
                            onClick={() => setPedidoEmEdicaoId(emEdicao ? null : pedido.id)}
                          >
                            {emEdicao ? "Cancelar edição" : "Alterar"}
                          </button>
                          <button
                            type="button"
                            className="botao-remover"
                            disabled={processando}
                            onClick={() => executarAcao(pedido.id, () => cancelarPedido(pedido.id, clienteId))}
                          >
                            Cancelar pedido
                          </button>
                        </>
                      )}

                      {pedido.status === "AVALIADO" && pedido.parecer === "POSITIVO" && (
                        <button
                          type="button"
                          className="botao-principal"
                          disabled={processando}
                          onClick={() => executarAcao(pedido.id, () => avancarPedido(pedido.id, clienteId))}
                        >
                          Confirmar aluguel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}

      {pagina && pagina.totalPages > 1 && (
        <div className="paginacao">
          <button
            type="button"
            className="botao-secundario"
            disabled={pagina.first || carregando}
            onClick={() => setNumeroPagina((p) => p - 1)}
          >
            Anterior
          </button>

          <span className="paginacao-info">
            Página {pagina.number + 1} de {pagina.totalPages} · {pagina.totalElements} pedido(s)
          </span>

          <button
            type="button"
            className="botao-secundario"
            disabled={pagina.last || carregando}
            onClick={() => setNumeroPagina((p) => p + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
