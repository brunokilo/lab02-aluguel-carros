// Espelha com.alucar.alucar.dto.UsuarioDTO
export interface UsuarioDTO {
  nome: string;
  email: string;
  senha: string;
}

// Espelha com.alucar.alucar.dto.EnderecoDTO
export interface EnderecoDTO {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// Espelha com.alucar.alucar.dto.EmpregadorDTO
export interface EmpregadorDTO {
  nome: string;
  rendimento: number;
}

// Espelha com.alucar.alucar.dto.ClienteDTO
// endereco e empregadores são opcionais: o cadastro inicial só exige os
// dados do cliente; endereço e empregadores são preenchidos depois,
// em telas separadas, via PUT /clientes/{id}/endereco e /empregadores.
export interface ClienteDTO {
  id?: number;
  usuario: UsuarioDTO;
  rg: string;
  cpf: string;
  profissao: string;
  endereco?: EnderecoDTO | null;
  empregadores: EmpregadorDTO[];
}

// Estrutura de erro de validação que o Spring devolve por padrão
// quando @Valid falha (MethodArgumentNotValidException)
export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string>;
}
