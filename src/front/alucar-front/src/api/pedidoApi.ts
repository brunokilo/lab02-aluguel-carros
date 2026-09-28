import type { PageResponse, PedidoDTO } from "../types/pedido";

const BASE_URL = "http://localhost:8080/clientes";

export async function listarPedidos(
  clienteId: number,
  page: number,
  size = 10
): Promise<PageResponse<PedidoDTO>> {
  const response = await fetch(
    `${BASE_URL}/${clienteId}/pedidos?page=${page}&size=${size}&sort=dataCriacao,desc`
  );

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao buscar pedidos`);
  }

  return response.json();
}
