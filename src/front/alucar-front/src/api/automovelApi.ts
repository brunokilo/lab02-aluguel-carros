import type { PageResponse } from "../types/pedido";
import type { AutomovelDTO } from "../types/automovel";

const BASE_URL = "http://localhost:8080/automoveis";

// GET /automoveis/disponiveis?page=0&size=50 — só carros livres pro cliente escolher
export async function listarAutomoveisDisponiveis(
  page = 0,
  size = 50
): Promise<PageResponse<AutomovelDTO>> {
  const response = await fetch(`${BASE_URL}/disponiveis?page=${page}&size=${size}`);

  if (!response.ok) {
    throw new Error(`Erro ${response.status} ao buscar automóveis disponíveis`);
  }

  return response.json();
}
