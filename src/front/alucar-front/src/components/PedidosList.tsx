import { useEffect, useState } from "react";
import type { PageResponse, PedidoDTO } from "../types/pedido";
import { listarPedidos } from "../api/pedidoApi";
import "./PedidosList.css";

interface Props {
  clienteId: number;
}

export function PedidosList({ clienteId }: Props) {
  const [pagina, setPagina] = useState<PageResponse<PedidoDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setCarregando(true);
    setErro(null);

    listarPedidos(clienteId, numeroPagina)
      .then(setPagina)
      .catch((e) => setErro(e instanceof Error ? e.message : "Erro ao carregar pedidos"))
      .finally(() => setCarregando(false));
  }, [clienteId, numeroPagina]);

  if (carregando && !pagina) return <p className="texto-auxiliar">Carregando pedidos...</p>;
  if (erro) return <p className="mensagem-erro">{erro}</p>;
  if (!pagina) return null;

  return (
    <div className="pedidos-list">
      {pagina.content.length === 0 ? (
        <p className="texto-auxiliar">Você ainda não fez nenhum pedido de aluguel.</p>
      ) : (
        <table className="pedidos-tabela">
          <thead>
            <tr>
              <th>#</th>
              <th>Data</th>
              <th>Status</th>
              <th>Parecer</th>
            </tr>
          </thead>
          <tbody>
            {pagina.content.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}</td>
                <td>{pedido.status}</td>
                <td>{pedido.parecer ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pagina.totalPages > 1 && (
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
