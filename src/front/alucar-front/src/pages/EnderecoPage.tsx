import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { EnderecoDTO } from "../types/cliente";
import { buscarClientePorId } from "../api/clienteApi";
import { EnderecoForm } from "../components/EnderecoForm";

export function EnderecoPage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = Number(id);
  const navigate = useNavigate();

  const [enderecoAtual, setEnderecoAtual] = useState<EnderecoDTO | null | undefined>(undefined);

  useEffect(() => {
    if (!clienteId) return;
    buscarClientePorId(clienteId).then((cliente) => setEnderecoAtual(cliente.endereco));
  }, [clienteId]);

  // undefined = ainda carregando; evita mostrar o form vazio por um instante
  // antes de sabermos se já existe um endereço cadastrado pra pré-preencher
  if (enderecoAtual === undefined) return <p className="texto-auxiliar">Carregando...</p>;

  return (
    <EnderecoForm
      clienteId={clienteId}
      enderecoAtual={enderecoAtual}
      onSalvo={() => navigate(`/clientes/${clienteId}`)}
    />
  );
}
