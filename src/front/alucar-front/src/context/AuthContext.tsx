import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { LoginResponseDTO } from "../api/authApi";
import {
  limparClienteLogado,
  obterClienteLogado,
  salvarClienteLogado,
} from "../api/authStorage";

interface AuthContextValue {
  usuario: LoginResponseDTO | null;
  entrar: (usuario: LoginResponseDTO) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Começa lendo o localStorage, pra continuar logado depois de recarregar a página
  const [usuario, setUsuario] = useState<LoginResponseDTO | null>(() => obterClienteLogado());

  function entrar(novoUsuario: LoginResponseDTO) {
    salvarClienteLogado(novoUsuario);
    setUsuario(novoUsuario);
  }

  function sair() {
    limparClienteLogado();
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return contexto;
}
