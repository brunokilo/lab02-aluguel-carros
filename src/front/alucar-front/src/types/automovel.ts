// Espelha com.alucar.alucar.dto.AutomovelDTO
export interface AutomovelDTO {
  id: number;
  placa: string;
  ano: number;
  marca: string;
  modelo: string;
  emUso: boolean;
}

// Dados que a empresa/banco preenche pra cadastrar um carro da própria frota
export type NovoAutomovelDTO = Omit<AutomovelDTO, "id">;
