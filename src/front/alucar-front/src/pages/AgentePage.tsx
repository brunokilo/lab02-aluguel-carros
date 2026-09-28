import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PageResponse, PedidoDTO } from "../types/pedido";
import { listarPedidosPendentes, avaliarPedido } from "../api/pedidoApi";
import "../components/ClienteForm.css";
import "../components/PedidosList.css";

export function AgentePage() {
  const { id } = useParams<{ id: string }>();
  const agenteId = Number(id);

  const [pagina, setPagina] = useState<PageResponse<PedidoDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  function carregarPendentes() {
    setCarregando(true);
    setErro(null);

    listarPedidosPendentes(numeroPagina)
      .then(setPagina)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar pedidos"))
      .finally(() => setCarregando(false));
  }

  useEffect(carregarPendentes, [numeroPagina]);

  async function handleAvaliar(pedidoId: number, parecer: "POSITIVO" | "NEGATIVO") {
    setErro(null);
    setProcessandoId(pedidoId);

    try {
      await avaliarPedido(pedidoId, agenteId, parecer);
      carregarPendentes();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao registrar parecer");
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div className="cliente-form">
      <h1>Área do agente</h1>
      <p className="texto-auxiliar">
        Pedidos aguardando avaliação financeira. Aprovar registra parecer positivo (o cliente
        decide se avança) e reprovar recusa o pedido diretamente.
      </p>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {carregando && !pagina && <p className="texto-auxiliar">Carregando...</p>}

      {pagina && (
        pagina.content.length === 0 ? (
          <p className="texto-auxiliar">Não há pedidos aguardando avaliação.</p>
        ) : (
          <table className="pedidos-tabela">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Automóvel</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((pedido) => {
                const processando = processandoId === pedido.id;

                return (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{pedido.clienteNome}</td>
                    <td>
                      {pedido.automovelDesejado.marca} {pedido.automovelDesejado.modelo} —{" "}
                      {pedido.automovelDesejado.placa}
                    </td>
                    <td>{new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}</td>
                    <td className="pedido-acoes">
                      <button
                        type="button"
                        className="botao-principal"
                        disabled={processando}
                        onClick={() => handleAvaliar(pedido.id, "POSITIVO")}
                      >
                        Aprovar
                      </button>
                      <button
                        type="button"
                        className="botao-remover"
                        disabled={processando}
                        onClick={() => handleAvaliar(pedido.id, "NEGATIVO")}
                      >
                        Reprovar
                      </button>
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
