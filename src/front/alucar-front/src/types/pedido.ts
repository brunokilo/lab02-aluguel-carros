export type StatusPedido = "PENDENTE" | "APROVADO" | "REPROVADO" | "CANCELADO";
export type Parecer = "POSITIVO" | "NEGATIVO" | null;

export interface PedidoDTO {
  id: number;
  dataCriacao: string; // ISO (LocalDate do backend, ex: "2026-09-20")
  status: StatusPedido;
  parecer: Parecer;
}

// Espelha org.springframework.data.domain.Page<T> serializado pelo Spring
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página atual (0-indexed)
  size: number;
  first: boolean;
  last: boolean;
}
