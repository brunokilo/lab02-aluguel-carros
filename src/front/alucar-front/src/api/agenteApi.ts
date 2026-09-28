import type { AgenteCadastroDTO, AgenteDTO } from "../types/agente";

const BASE_URL = "http://localhost:8080";

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

export async function criarAgente(dto: AgenteCadastroDTO): Promise<AgenteDTO> {
  const response = await fetch(`${BASE_URL}/agentes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<AgenteDTO>(response);
}

export async function criarBanco(dto: AgenteCadastroDTO): Promise<AgenteDTO> {
  const response = await fetch(`${BASE_URL}/bancos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<AgenteDTO>(response);
}
