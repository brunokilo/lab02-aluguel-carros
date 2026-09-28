import type { ModalidadeContrato, PageResponse, PedidoDTO } from "../types/pedido";

const API_ROOT = "http://localhost:8080";
const CLIENTES_URL = `${API_ROOT}/clientes`;
const PEDIDOS_URL = `${API_ROOT}/pedidos`;

async function tratarResposta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let mensagem = `Erro ${response.status} ao comunicar com o servidor`;
    try {
      const corpo = await response.json();
      mensagem = corpo.message ?? JSON.stringify(corpo);
    } catch {
      // corpo sem JSON — mantém mensagem padrão
    }
    throw new Error(mensagem);
  }

  return response.json() as Promise<T>;
}

export async function listarPedidos(
  clienteId: number,
  page: number,
  size = 10
): Promise<PageResponse<PedidoDTO>> {
  const response = await fetch(
    `${CLIENTES_URL}/${clienteId}/pedidos?page=${page}&size=${size}&sort=dataCriacao,desc`
  );
  return tratarResposta<PageResponse<PedidoDTO>>(response);
}

// HU02 — efetuar pedido
export async function criarPedido(
  clienteId: number,
  automovelId: number,
  modalidade: ModalidadeContrato
): Promise<PedidoDTO> {
  const response = await fetch(`${CLIENTES_URL}/${clienteId}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ automovelId, modalidade }),
  });
  return tratarResposta<PedidoDTO>(response);
}

// HU03 — modificar pedido (só permitido enquanto não avaliado)
export async function alterarPedido(
  pedidoId: number,
  clienteId: number,
  automovelId: number,
  modalidade: ModalidadeContrato
): Promise<PedidoDTO> {
  const response = await fetch(`${PEDIDOS_URL}/${pedidoId}?clienteId=${clienteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ automovelId, modalidade }),
  });
  return tratarResposta<PedidoDTO>(response);
}

// HU05 — excluir/cancelar pedido
export async function cancelarPedido(pedidoId: number, clienteId: number): Promise<PedidoDTO> {
  const response = await fetch(`${PEDIDOS_URL}/${pedidoId}/cancelar?clienteId=${clienteId}`, {
    method: "PUT",
  });
  return tratarResposta<PedidoDTO>(response);
}

// HU06 — aceitar o parecer positivo e avançar para a execução do contrato
export async function avancarPedido(pedidoId: number, clienteId: number): Promise<PedidoDTO> {
  const response = await fetch(`${PEDIDOS_URL}/${pedidoId}/avancar?clienteId=${clienteId}`, {
    method: "PUT",
  });
  return tratarResposta<PedidoDTO>(response);
}

// HU07 — pedidos aguardando avaliação (fila de trabalho do agente)
export async function listarPedidosPendentes(
  page: number,
  size = 10
): Promise<PageResponse<PedidoDTO>> {
  const response = await fetch(
    `${PEDIDOS_URL}/pendentes?page=${page}&size=${size}&sort=dataCriacao`
  );
  return tratarResposta<PageResponse<PedidoDTO>>(response);
}

// HU08 — registrar parecer da avaliação financeira
export async function avaliarPedido(
  pedidoId: number,
  agenteId: number,
  parecer: "POSITIVO" | "NEGATIVO"
): Promise<PedidoDTO> {
  const response = await fetch(`${PEDIDOS_URL}/${pedidoId}/avaliar?agenteId=${agenteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parecer),
  });
  return tratarResposta<PedidoDTO>(response);
}
