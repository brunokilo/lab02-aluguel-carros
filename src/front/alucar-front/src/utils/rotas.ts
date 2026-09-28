import type { LoginResponseDTO } from "../api/authApi";

function ehAgente(usuario: LoginResponseDTO): boolean {
  return usuario.tipo === "AGENTE" || usuario.tipo === "BANCO";
}

// Pra onde o usuário logado vai quando clica em "minha conta"
export function rotaDaConta(usuario: LoginResponseDTO): string {
  return ehAgente(usuario) ? `/agente/${usuario.id}` : `/clientes/${usuario.id}`;
}

export function rotuloDaConta(usuario: LoginResponseDTO): string {
  return ehAgente(usuario) ? "Área do agente" : "Minha conta";
}
