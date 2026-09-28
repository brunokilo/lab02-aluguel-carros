export interface LoginRequestDTO {
  email: string;
  senha: string;
}

export interface LoginResponseDTO {
  id: number;
  nome: string;
  email: string;
  tipo: "CLIENTE" | "AGENTE" | "BANCO";
}

const BASE_URL = "http://localhost:8080/auth";

export async function login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    let mensagem = "E-mail ou senha inválidos";
    try {
      const corpo = await response.json();
      mensagem = corpo.message ?? mensagem;
    } catch {
      // mantém mensagem padrão
    }
    throw new Error(mensagem);
  }

  return response.json();
}
