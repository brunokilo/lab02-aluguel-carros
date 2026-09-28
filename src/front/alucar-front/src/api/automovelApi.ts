import type { PageResponse } from "../types/pedido";
import type { AutomovelDTO, NovoAutomovelDTO } from "../types/automovel";

const API_ROOT = "http://localhost:8080";
const BASE_URL = `${API_ROOT}/automoveis`;

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

// GET /automoveis/disponiveis?page=0&size=50 — só carros livres pro cliente escolher
export async function listarAutomoveisDisponiveis(
  page = 0,
  size = 50
): Promise<PageResponse<AutomovelDTO>> {
  const response = await fetch(`${BASE_URL}/disponiveis?page=${page}&size=${size}`);
  return tratarResposta<PageResponse<AutomovelDTO>>(response);
}

// POST /agentes/3/automoveis — empresa/banco cadastra um carro da própria frota
export async function criarAutomovel(
  agenteId: number,
  dto: NovoAutomovelDTO
): Promise<AutomovelDTO> {
  const response = await fetch(`${API_ROOT}/agentes/${agenteId}/automoveis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<AutomovelDTO>(response);
}

// GET /agentes/3/automoveis — frota cadastrada por esse agente/banco
export async function listarAutomoveisDoAgente(agenteId: number): Promise<AutomovelDTO[]> {
  const response = await fetch(`${API_ROOT}/agentes/${agenteId}/automoveis`);
  return tratarResposta<AutomovelDTO[]>(response);
}
