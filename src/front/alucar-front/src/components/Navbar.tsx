import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rotaDaConta, rotuloDaConta } from "../utils/rotas";
import "./Navbar.css";

const classeLink = ({ isActive }: { isActive: boolean }) => (isActive ? "ativo" : undefined);

export function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="navbar-esquerda">
        <Link to="/" className="navbar-marca">
          Alucar
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end className={classeLink}>
            Home
          </NavLink>

          {usuario ? (
            <NavLink to={rotaDaConta(usuario)} className={classeLink}>
              {rotuloDaConta(usuario)}
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className={classeLink}>
                Entrar
              </NavLink>
              <NavLink to="/cadastro" className={classeLink}>
                Cadastre-se
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {usuario && (
        <div className="navbar-usuario">
          <span>{usuario.nome}</span>
          <button type="button" className="navbar-sair" onClick={handleSair}>
            Sair
          </button>
        </div>
      )}
    </header>
  );
}
