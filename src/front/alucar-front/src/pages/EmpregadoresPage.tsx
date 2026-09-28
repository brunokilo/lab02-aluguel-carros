import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { EmpregadorDTO } from "../types/cliente";
import { buscarClientePorId } from "../api/clienteApi";
import { EmpregadoresForm } from "../components/EmpregadoresForm";

export function EmpregadoresPage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);
  const navigate = useNavigate();

  const [empregadoresAtuais, setEmpregadoresAtuais] = useState<EmpregadorDTO[] | undefined>(
    undefined
  );

  useEffect(() => {
    if (!clienteId) return;
    buscarClientePorId(clienteId).then((cliente) => setEmpregadoresAtuais(cliente.empregadores));
  }, [clienteId]);

  if (empregadoresAtuais === undefined) return <p className="texto-auxiliar">Carregando...</p>;

  return (
    <EmpregadoresForm
      clienteId={clienteId}
      empregadoresAtuais={empregadoresAtuais}
      onSalvo={() => navigate(`/clientes/${clienteId}`)}
    />
  );
}
