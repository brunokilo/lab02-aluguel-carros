import type { AutomovelDTO } from "./automovel";
import type { EmpregadorDTO } from "./cliente";

// Espelha com.alucar.alucar.enums.StatusPedido
export type StatusPedido = "CRIADO" | "AVALIADO" | "APROVADO" | "RECUSADO" | "CANCELADO";

// Espelha com.alucar.alucar.enums.Parecer
export type Parecer = "POSITIVO" | "NEGATIVO" | null;

// Espelha com.alucar.alucar.enums.ModalidadeContrato
export type ModalidadeContrato = "LOCACAO" | "ASSINATURA" | "LEASING";

export const ROTULOS_MODALIDADE: Record<ModalidadeContrato, string> = {
  LOCACAO: "Locação",
  ASSINATURA: "Assinatura",
  LEASING: "Leasing",
};

// Espelha com.alucar.alucar.dto.PedidoDTO
export interface PedidoDTO {
  id: number;
  dataCriacao: string; // ISO (LocalDate do backend, ex: "2026-09-20")
  status: StatusPedido;
  parecer: Parecer;
  modalidade: ModalidadeContrato;
  automovelDesejado: AutomovelDTO;
  clienteId: number;
  clienteNome: string;
  empregadoresCliente: EmpregadorDTO[];
  numeroContratoCredito: string | null;
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
