import type { LoginResponseDTO } from "./authApi";

// Armazenamento simplificado da "sessão" no navegador — não é um token real,
// só guarda quem está logado pra essa aba/navegador. Adequado pro escopo do
// projeto de estudo; não substitui autenticação de verdade (sem expiração,
// sem proteção contra adulteração pelo próprio usuário no localStorage).
const CHAVE = "alucar:clienteLogado";

export function salvarClienteLogado(cliente: LoginResponseDTO): void {
  localStorage.setItem(CHAVE, JSON.stringify(cliente));
}

export function obterClienteLogado(): LoginResponseDTO | null {
  const bruto = localStorage.getItem(CHAVE);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as LoginResponseDTO;
  } catch {
    return null;
  }
}

export function limparClienteLogado(): void {
  localStorage.removeItem(CHAVE);
}
