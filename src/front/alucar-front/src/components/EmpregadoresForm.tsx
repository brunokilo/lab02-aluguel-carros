import { useState } from "react";
import type { EmpregadorDTO } from "../types/cliente";
import { atualizarEmpregadores } from "../api/clienteApi";
import "./ClienteForm.css";

const MAX_EMPREGADORES = 3;

interface Props {
  clienteId: number;
  empregadoresAtuais?: EmpregadorDTO[];
  onSalvo?: () => void;
}

export function EmpregadoresForm({ clienteId, empregadoresAtuais, onSalvo }: Props) {
  const [empregadores, setEmpregadores] = useState<EmpregadorDTO[]>(
    empregadoresAtuais ?? []
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  function adicionarEmpregador() {
    if (empregadores.length >= MAX_EMPREGADORES) return;
    setEmpregadores((atual) => [...atual, { nome: "", rendimento: 0 }]);
  }

  function removerEmpregador(indice: number) {
    setEmpregadores((atual) => atual.filter((_, i) => i !== indice));
  }

  function atualizarEmpregador(indice: number, campo: keyof EmpregadorDTO, valor: string) {
    setEmpregadores((atual) =>
      atual.map((emp, i) =>
        i === indice
          ? { ...emp, [campo]: campo === "rendimento" ? Number(valor) : valor }
          : emp
      )
    );
  }

  async function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSucesso(false);
    setEnviando(true);

    try {
      await atualizarEmpregadores(clienteId, empregadores);
      setSucesso(true);
      onSalvo?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro desconhecido ao salvar empregadores");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <div className="secao-titulo">
        <h1>Empregadores</h1>
        <span className="contador">
          {empregadores.length}/{MAX_EMPREGADORES}
        </span>
      </div>

      <section>
        {empregadores.length === 0 && (
          <p className="texto-auxiliar">
            Nenhum empregador cadastrado ainda. Você pode incluir até {MAX_EMPREGADORES}.
          </p>
        )}

        {empregadores.map((empregador, indice) => (
          <div className="empregador-card" key={indice}>
            <div className="linha">
              <label className="campo-grande">
                Nome do empregador
                <input
                  required
                  value={empregador.nome}
                  onChange={(e) => atualizarEmpregador(indice, "nome", e.target.value)}
                />
              </label>

              <label>
                Rendimento (R$)
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={empregador.rendimento}
                  onChange={(e) => atualizarEmpregador(indice, "rendimento", e.target.value)}
                />
              </label>
            </div>

            <button
              type="button"
              className="botao-remover"
              onClick={() => removerEmpregador(indice)}
            >
              Remover
            </button>
          </div>
        ))}

        <button
          type="button"
          className="botao-secundario"
          onClick={adicionarEmpregador}
          disabled={empregadores.length >= MAX_EMPREGADORES}
        >
          + Adicionar empregador
        </button>
      </section>

      {erro && <p className="mensagem-erro">{erro}</p>}
      {sucesso && <p className="mensagem-sucesso">Empregadores salvos com sucesso.</p>}

      <button type="submit" className="botao-principal" disabled={enviando}>
        {enviando ? "Salvando..." : "Salvar empregadores"}
      </button>
    </form>
  );
}
