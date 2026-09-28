import type { AutomovelDTO } from "./automovel";

// Espelha com.alucar.alucar.enums.StatusPedido
export type StatusPedido = "CRIADO" | "AVALIADO" | "APROVADO" | "RECUSADO" | "CANCELADO";

// Espelha com.alucar.alucar.enums.Parecer
export type Parecer = "POSITIVO" | "NEGATIVO" | null;

// Espelha com.alucar.alucar.dto.PedidoDTO
export interface PedidoDTO {
  id: number;
  dataCriacao: string; // ISO (LocalDate do backend, ex: "2026-09-20")
  status: StatusPedido;
  parecer: Parecer;
  automovelDesejado: AutomovelDTO;
  clienteId: number;
  clienteNome: string;
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
