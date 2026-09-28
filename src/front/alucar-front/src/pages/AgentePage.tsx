import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { PageResponse, PedidoDTO } from "../types/pedido";
import { ROTULOS_MODALIDADE } from "../types/pedido";
import type { AutomovelDTO } from "../types/automovel";
import { listarPedidosPendentes, avaliarPedido } from "../api/pedidoApi";
import { listarAutomoveisDoAgente } from "../api/automovelApi";
import { CadastroAutomovelForm } from "../components/CadastroAutomovelForm";
import { useAuth } from "../context/AuthContext";
import "../components/ClienteForm.css";
import "../components/PedidosList.css";
import "./ContaPage.css";

type Aba = "pedidos" | "automoveis";

export function AgentePage() {
  const { id } = useParams<{ id: string }>();
  const agenteId = Number(id);
  const { usuario } = useAuth();
  const ehBanco = usuario?.tipo === "BANCO";

  const [aba, setAba] = useState<Aba>("pedidos");

  const [pagina, setPagina] = useState<PageResponse<PedidoDTO> | null>(null);
  const [numeroPagina, setNumeroPagina] = useState(0);
  const [carregandoPedidos, setCarregandoPedidos] = useState(true);
  const [erroPedidos, setErroPedidos] = useState<string | null>(null);
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const [automoveis, setAutomoveis] = useState<AutomovelDTO[]>([]);
  const [carregandoAutomoveis, setCarregandoAutomoveis] = useState(true);
  const [erroAutomoveis, setErroAutomoveis] = useState<string | null>(null);

  function carregarPendentes() {
    setCarregandoPedidos(true);
    setErroPedidos(null);

    listarPedidosPendentes(numeroPagina)
      .then(setPagina)
      .catch((e) => setErroPedidos(e instanceof Error ? e.message : "Erro ao carregar pedidos"))
      .finally(() => setCarregandoPedidos(false));
  }

  function carregarAutomoveis() {
    setCarregandoAutomoveis(true);
    setErroAutomoveis(null);

    listarAutomoveisDoAgente(agenteId)
      .then(setAutomoveis)
      .catch((e) => setErroAutomoveis(e instanceof Error ? e.message : "Erro ao carregar automóveis"))
      .finally(() => setCarregandoAutomoveis(false));
  }

  useEffect(carregarPendentes, [numeroPagina]);
  useEffect(carregarAutomoveis, [agenteId]);

  async function handleAvaliar(pedidoId: number, parecer: "POSITIVO" | "NEGATIVO") {
    setErroPedidos(null);
    setProcessandoId(pedidoId);

    try {
      await avaliarPedido(pedidoId, agenteId, parecer);
      carregarPendentes();
    } catch (e) {
      setErroPedidos(e instanceof Error ? e.message : "Erro ao registrar parecer");
    } finally {
      setProcessandoId(null);
    }
  }

  return (
    <div className="cliente-form">
      <h1>Área do agente</h1>

      <nav className="abas">
        <button type="button" className={aba === "pedidos" ? "aba-ativa" : ""} onClick={() => setAba("pedidos")}>
          Pedidos pendentes
        </button>
        <button type="button" className={aba === "automoveis" ? "aba-ativa" : ""} onClick={() => setAba("automoveis")}>
          Meus automóveis
        </button>
      </nav>

      {aba === "pedidos" && (
        <section>
          <p className="texto-auxiliar">
            Pedidos aguardando avaliação financeira. Aprovar registra parecer positivo (o cliente
            decide se avança) e reprovar recusa o pedido diretamente.
          </p>

          {erroPedidos && <p className="mensagem-erro">{erroPedidos}</p>}
          {carregandoPedidos && !pagina && <p className="texto-auxiliar">Carregando...</p>}

          {pagina && (
            pagina.content.length === 0 ? (
              <p className="texto-auxiliar">Não há pedidos aguardando avaliação.</p>
            ) : (
              <table className="pedidos-tabela">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Renda declarada</th>
                    <th>Automóvel</th>
                    <th>Modalidade</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pagina.content.map((pedido) => {
                    const processando = processandoId === pedido.id;
                    const podeAvaliar = pedido.modalidade !== "LEASING" || ehBanco;

                    return (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.clienteNome}</td>
                        <td>
                          {pedido.empregadoresCliente.length === 0
                            ? "Nenhum empregador cadastrado"
                            : pedido.empregadoresCliente
                                .map((emp) => `${emp.nome}: R$ ${emp.rendimento.toFixed(2)}`)
                                .join(" · ")}
                        </td>
                        <td>
                          {pedido.automovelDesejado.marca} {pedido.automovelDesejado.modelo} —{" "}
                          {pedido.automovelDesejado.placa}
                        </td>
                        <td>{ROTULOS_MODALIDADE[pedido.modalidade]}</td>
                        <td>{new Date(pedido.dataCriacao).toLocaleDateString("pt-BR")}</td>
                        <td className="pedido-acoes">
                          {podeAvaliar ? (
                            <>
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
                            </>
                          ) : (
                            <span className="texto-auxiliar">Somente bancos avaliam leasing</span>
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
                disabled={pagina.first || carregandoPedidos}
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
                disabled={pagina.last || carregandoPedidos}
                onClick={() => setNumeroPagina((p) => p + 1)}
              >
                Próxima
              </button>
            </div>
          )}
        </section>
      )}

      {aba === "automoveis" && (
        <section>
          <CadastroAutomovelForm agenteId={agenteId} onCadastrado={carregarAutomoveis} />

          <h2>Frota cadastrada</h2>

          {erroAutomoveis && <p className="mensagem-erro">{erroAutomoveis}</p>}
          {carregandoAutomoveis && <p className="texto-auxiliar">Carregando...</p>}

          {!carregandoAutomoveis && automoveis.length === 0 && (
            <p className="texto-auxiliar">Nenhum automóvel cadastrado ainda.</p>
          )}

          {automoveis.length > 0 && (
            <table className="pedidos-tabela">
              <thead>
                <tr>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {automoveis.map((automovel) => (
                  <tr key={automovel.id}>
                    <td>{automovel.placa}</td>
                    <td>{automovel.marca}</td>
                    <td>{automovel.modelo}</td>
                    <td>{automovel.ano}</td>
                    <td>{automovel.emUso ? "Em uso" : "Disponível"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
}
