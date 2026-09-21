import { useState } from "react";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [profissao, setProfissao] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clienteDTO = {
      usuario: {
        nome: nome,
      },
      rg: rg,
      cpf: cpf,
      profissao: profissao,
      endereco: null,
      empregadores: [],
    };

    try {
      const resposta = await fetch("http://localhost:8080/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteDTO),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar cliente.");
      }

      const clienteCadastrado = await resposta.json();

      console.log("Cliente cadastrado:", clienteCadastrado);

      alert("Cliente cadastrado com sucesso!");

      setNome("");
      setRg("");
      setCpf("");
      setProfissao("");
    } catch (erro) {
      console.error("Erro:", erro);
      alert("Não foi possível cadastrar o cliente.");
    }
  }

  return (
    <div className="container">
      <h1>Sistema de Aluguel de Carros</h1>

      <h2>Cadastro de Cliente</h2>

      <form onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="rg">RG</label>
          <input
            id="rg"
            type="text"
            value={rg}
            onChange={(event) => setRg(event.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            value={cpf}
            onChange={(event) => setCpf(event.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="profissao">Profissão</label>
          <input
            id="profissao"
            type="text"
            value={profissao}
            onChange={(event) => setProfissao(event.target.value)}
          />
        </div>

        <button type="submit">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default App;