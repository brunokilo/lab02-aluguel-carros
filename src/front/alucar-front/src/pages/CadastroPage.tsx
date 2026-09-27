import { useNavigate } from "react-router-dom";
import { CadastroClienteForm } from "../components/CadastroClienteForm";

export function CadastroPage() {
  const navigate = useNavigate();

  return (
    <CadastroClienteForm
      onCadastrado={(clienteId) => navigate(`/clientes/${clienteId}`)}
    />
  );
}
