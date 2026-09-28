import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rotaDaConta, rotuloDaConta } from "../utils/rotas";
import "./HomePage.css";

export function HomePage() {
  const { usuario } = useAuth();

  return (
    <div className="home">
      <h1>Alucar</h1>
      <p className="home-subtitulo">
        Alugue seu carro com facilidade — locação, assinatura ou leasing.
      </p>

      <section className="home-modalidades">
        <div className="modalidade-card">
          <h2>Locação</h2>
          <p>Uso por prazo determinado, com devolução do veículo ao final do contrato.</p>
        </div>
        <div className="modalidade-card">
          <h2>Assinatura</h2>
          <p>Uso recorrente mediante mensalidade, sem burocracia de compra.</p>
        </div>
        <div className="modalidade-card">
          <h2>Leasing</h2>
          <p>Uso de longo prazo associado a um contrato de crédito com um banco parceiro.</p>
        </div>
      </section>

      {usuario ? (
        <>
          <p className="home-aviso">Olá, {usuario.nome}!</p>

          <div className="home-acoes">
            <Link to={rotaDaConta(usuario)}>
              <button type="button" className="botao-principal">
                {rotuloDaConta(usuario)}
              </button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="home-aviso">O sistema só pode ser utilizado após cadastro prévio.</p>

          <div className="home-acoes">
            <Link to="/login">
              <button type="button" className="botao-principal">Entrar</button>
            </Link>
            <Link to="/cadastro">
              <button type="button" className="botao-secundario">Cadastre-se</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
