import type { ClienteDTO, EnderecoDTO, EmpregadorDTO } from "../types/cliente";

const BASE_URL = "http://localhost:8080/clientes";

async function tratarResposta<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let mensagem = `Erro ${response.status} ao comunicar com o servidor`;
    try {
      const corpo = await response.json();
      mensagem = corpo.message ?? JSON.stringify(corpo);
    } catch {
      // corpo sem JSON (ex: erro 500 sem handler) — mantém mensagem padrão
    }
    throw new Error(mensagem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function criarCliente(dto: ClienteDTO): Promise<ClienteDTO> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<ClienteDTO>(response);
}

export async function buscarClientePorId(id: number): Promise<ClienteDTO> {
  const response = await fetch(`${BASE_URL}/${id}`);
  return tratarResposta<ClienteDTO>(response);
}

export async function atualizarCliente(
  id: number,
  dto: ClienteDTO
): Promise<ClienteDTO> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<ClienteDTO>(response);
}

// Preenche/atualiza o endereço de um cliente já cadastrado.
// Depende do endpoint novo PUT /clientes/{id}/endereco no backend.
export async function atualizarEndereco(
  clienteId: number,
  dto: EnderecoDTO
): Promise<ClienteDTO> {
  const response = await fetch(`${BASE_URL}/${clienteId}/endereco`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  return tratarResposta<ClienteDTO>(response);
}

// Substitui a lista de empregadores de um cliente (máx. 3, validado no backend).
// Depende do endpoint novo PUT /clientes/{id}/empregadores no backend.
export async function atualizarEmpregadores(
  clienteId: number,
  empregadores: EmpregadorDTO[]
): Promise<ClienteDTO> {
  const response = await fetch(`${BASE_URL}/${clienteId}/empregadores`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(empregadores),
  });
  return tratarResposta<ClienteDTO>(response);
}

export async function excluirCliente(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return tratarResposta<void>(response);
}
