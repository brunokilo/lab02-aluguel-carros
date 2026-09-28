import { useParams } from "react-router-dom";
import "../components/ClienteForm.css";

// Placeholder — a listagem de pedidos para avaliação entra aqui
// quando o front de pedidos for implementado.
export function AgentePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="cliente-form">
      <h1>Área do agente</h1>
      <p className="texto-auxiliar">
        Agente #{id}. Em breve: pedidos recebidos para análise e registro de parecer.
      </p>
    </div>
  );
}
